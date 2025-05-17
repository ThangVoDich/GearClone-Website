const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
// 📦 Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng: " + err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (req.body.status) order.status = req.body.status;

    if (typeof req.body.isPaid === "boolean") {
      order.isPaid = req.body.isPaid;
      order.paidAt = req.body.isPaid ? Date.now() : null;
    }

    await order.save();
    res.json({ message: "Cập nhật đơn hàng thành công", order });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật đơn hàng: " + err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json({ message: "Đã xoá đơn hàng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá đơn hàng: " + err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng: " + err.message });
  }
};

// 👤 Lấy danh sách người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Có thể thêm .select("-password") nếu cần bảo mật
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi khi lấy người dùng:", err);
    res.status(500).json({ message: "Lỗi khi lấy người dùng: " + err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Đã xoá người dùng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá user: " + err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    user.isAdmin = req.body.isAdmin;
    await user.save();

    res.json({ message: "Cập nhật quyền thành công", isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật quyền: " + err.message });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm: " + err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xoá sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá sản phẩm: " + err.message });
  }
};
const createProduct = async (req, res) => {
  const { name, price, category, subcategory, image, description } = req.body;
  try {
    const product = await Product.create({ name, price, category, subcategory, image, description });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo sản phẩm: " + err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật sản phẩm: " + err.message });
  }
};


// ✅ Export duy nhất 1 lần
module.exports = {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllProducts,
  deleteProduct,
  createProduct,
  updateProduct
};
