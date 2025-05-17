// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  deleteOrder,
  getMyOrderById,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

// POST: Tạo đơn hàng
router.post("/", protect, createOrder);

// GET: Lấy đơn hàng theo user
router.get("/", protect, getUserOrders);

// DELETE: Xoá đơn hàng theo ID
router.delete("/:id", protect, deleteOrder);
router.get("/:id", protect, getMyOrderById);

module.exports = router;
