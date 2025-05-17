const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
  getAllUsers,
  deleteUser,
  updateUserRole,
  createProduct,
  updateProduct,
  getAllProducts,
  deleteProduct
} = require("../controllers/adminController");

const { protect, isAdmin } = require("../middlewares/authMiddleware");

// 📦 Đơn hàng
router.get("/orders", protect, isAdmin, getAllOrders);
router.get("/orders/:id", protect, isAdmin, getOrderById);
router.put("/orders/:id/status", protect, isAdmin, updateOrderStatus);
router.delete("/orders/:id", protect, isAdmin, deleteOrder);

// 👤 Người dùng
router.get("/users", protect, isAdmin, getAllUsers); // ✅ Dành cho dashboard
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.put("/users/:id/role", protect, isAdmin, updateUserRole);
router.get("/products", protect, isAdmin, getAllProducts);
router.delete("/products/:id", protect, isAdmin, deleteProduct);
router.post("/products", protect, isAdmin, createProduct);
router.put("/products/:id", protect, isAdmin, updateProduct);

module.exports = router;
