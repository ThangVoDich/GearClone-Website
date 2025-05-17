const Discount = require("../models/Discount"); // ✅ thêm dòng này
const User = require("../models/User"); // ✅ Sửa lỗi "User is not defined"
const Order = require("../models/Order");
  const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
exports.createGuestOrder = async (req, res) => {
  try {
    const { items, shippingInfo, totalPrice, paymentMethod, discountCode } = req.body;
    const { fullname, email, address, phone, note } = shippingInfo;

    if (!items || items.length === 0 || !email || !fullname || !address || !phone) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng hoặc thông tin giao hàng." });
    }

    // ✅ Áp dụng mã giảm giá nếu có
    let finalTotal = totalPrice;
    let discountPercent = 0;

    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode.toUpperCase() });

      if (!discount || discount.used >= discount.usageLimit || (discount.expiresAt && discount.expiresAt < new Date())) {
        return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn." });
      }

      discountPercent = discount.percent;
      finalTotal = Math.ceil(totalPrice * (1 - discountPercent / 100));
      discount.used += 1;
      await discount.save();
    }

    // ✅ Tìm hoặc tạo user
    let user = await User.findOne({ email });
    let isNewUser = false;
    let resetToken = "";

    if (!user) {
      isNewUser = true;
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      resetToken = crypto.randomBytes(32).toString("hex");
      const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");

      user = await User.create({
        name: fullname,
        email,
        password: hashedPassword,
        hasPassword: false,
        resetPasswordToken: hashToken,
        resetPasswordExpire: Date.now() + 15 * 60 * 1000
      });
    }

    // ✅ Tạo đơn hàng
    const order = await Order.create({
      user: user._id,
      items,
      shippingInfo: { fullname, address, phone, note },
      totalPrice: finalTotal,
      paymentMethod,
      paidAt: Date.now(),
      isPaid: false,
      status: "pending",
      discountCode: discountCode || null,
      discountPercent
    });

    // ✅ Gửi email xác nhận
    let emailContent = `
      <h3>Chào ${fullname},</h3>
      <p>Bạn vừa đặt hàng thành công tại <strong>GEARCLONE</strong>.</p>
      <p><strong>Mã đơn hàng:</strong> ${order._id}</p>
      <p><strong>Tổng tiền:</strong> ${finalTotal.toLocaleString()}đ</p>
      <p><strong>Phương thức thanh toán:</strong> ${paymentMethod === "BANK" ? "🏦 Chuyển khoản" : "💵 COD"}</p>
      ${discountCode ? `<p>✅ Đã áp dụng mã giảm: <strong>${discountCode}</strong> (-${discountPercent}%)</p>` : ""}
      <hr>
      <p>Chúng tôi sẽ xử lý đơn hàng và giao sớm nhất có thể.</p>
    `;

    if (isNewUser && resetToken) {
      const resetLink = `http://localhost:8889/reset-password.html?token=${resetToken}`;
      emailContent += `
        <hr>
        <p>✅ Tài khoản của bạn đã được tạo tự động:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>🔐 Để đặt mật khẩu, vui lòng <a href="${resetLink}">bấm vào đây</a>. Liên kết có hiệu lực trong 15 phút.</p>
      `;
    }

    await sendEmail(email, "Xác nhận đơn hàng tại GEARCLONE", emailContent);

    res.status(201).json({ message: "Đặt hàng thành công", order });

  } catch (err) {
    console.error("Lỗi tạo đơn hàng guest:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
