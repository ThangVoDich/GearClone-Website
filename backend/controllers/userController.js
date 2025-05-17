const User = require("../models/User");
const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Đăng ký tài khoản mới
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "Email đã tồn tại" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
};

// Đăng nhập
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Bắt buộc phải lấy password để so sánh
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu (user không tồn tại)" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Sai email hoặc mật khẩu (không match)" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  });
};



// Cập nhật thông tin người dùng (bao gồm đổi mật khẩu)
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  // Nếu có yêu cầu đổi mật khẩu
  if (req.body.newPassword) {
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
    }
  
    user.password = req.body.newPassword; // ✅ Không cần hash ở đây
  }
  

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    token: generateToken(updatedUser._id)
  });
};
// Đăng nhập Google
const googleLoginUser = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const tempPassword = Math.random().toString(36).substring(2, 10);
      user = await User.create({
        name,
        email,
        password: tempPassword,
        hasPassword: false
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // ✅ THÊM DÒNG NÀY
      token: generateToken(user._id),
      requirePasswordSetup: !user.hasPassword
    });
    
  } catch (err) {
    res.status(401).json({ message: "Xác thực Google thất bại", error: err.message });
  }
};

// API đặt mật khẩu mới
const setUserPassword = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

  user.password = req.body.newPassword;
  user.hasPassword = true;
  await user.save();

  res.json({ message: "Mật khẩu đã được cập nhật thành công" });
};

// Gửi email reset password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Không tìm thấy email" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashToken;
  user.resetPasswordExpire = Date.now() + 1000 * 60 * 15; // 15 phút
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;

  await sendEmail(email, "Đặt lại mật khẩu GEARCLONE", `
    <h3>Yêu cầu đặt lại mật khẩu</h3>
    <p>Nhấn vào liên kết sau để đặt lại:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Liên kết sẽ hết hạn sau 15 phút.</p>
  `);

  res.json({ message: "Đã gửi liên kết đặt lại mật khẩu tới email." });
};

// Xử lý reset mật khẩu
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: "Liên kết không hợp lệ hoặc đã hết hạn." });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Đặt lại mật khẩu thành công." });
};
// ✅ Trả về thông tin user (cho dashboard)
const getProfile = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    loyaltyPoints: req.user.loyaltyPoints || 0
  });
};

// ✅ Export duy nhất 1 lần ở cuối file
module.exports = {
  registerUser,
  loginUser,
  googleLoginUser,
  setUserPassword,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getProfile
};
