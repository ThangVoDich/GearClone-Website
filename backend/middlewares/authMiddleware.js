const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware xác thực người dùng
const protect = async (req, res, next) => {
  let token;

  // Kiểm tra Authorization header có tồn tại & bắt đầu bằng "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("❌ Lỗi xác thực token:", err.message);
      return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
    }
  } else {
    return res.status(401).json({ message: "Không có token, từ chối truy cập" });
  }
};

// Middleware kiểm tra quyền admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Bạn không có quyền admin" });
  }
  next();
};

module.exports = { protect, isAdmin };
