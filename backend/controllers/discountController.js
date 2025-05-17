const Discount = require("../models/Discount");

// ✅ Admin tạo mã mới
exports.createDiscount = async (req, res) => {
  const { code, percent, expiresAt, usageLimit } = req.body;

  try {
    const discount = await Discount.create({
      code,
      percent,
      expiresAt,
      usageLimit
    });
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ message: "Tạo mã giảm giá thất bại", error: err.message });
  }
};

// ✅ Người dùng kiểm tra mã hợp lệ
exports.checkDiscount = async (req, res) => {
  const { code } = req.body;

  try {
    const discount = await Discount.findOne({ code: code.toUpperCase() });
    if (
      !discount ||
      discount.used >= discount.usageLimit ||
      (discount.expiresAt && discount.expiresAt < new Date())
    ) {
      return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" });
    }

    res.json({ percent: discount.percent });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ✅ Admin xem tất cả mã
exports.getAllDiscounts = async (req, res) => {
  const list = await Discount.find().sort({ createdAt: -1 });
  res.json(list);
};

// ✅ Admin xoá mã
exports.deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({ message: "Đã xoá mã thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá", error: err.message });
  }
};

// ✅ Admin cập nhật mã
exports.updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!discount) return res.status(404).json({ message: "Không tìm thấy mã" });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};
