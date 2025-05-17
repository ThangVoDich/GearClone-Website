const express = require("express");
const router = express.Router();
const {
  createDiscount,
  checkDiscount,
  getAllDiscounts,
  deleteDiscount,
  updateDiscount
} = require("../controllers/discountController");

const { protect, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Public API để người dùng kiểm tra mã
router.post("/check", checkDiscount);

// ✅ Admin routes
router.post("/", protect, isAdmin, createDiscount);
router.get("/", protect, isAdmin, getAllDiscounts);
router.delete("/:id", protect, isAdmin, deleteDiscount);
router.put("/:id", protect, isAdmin, updateDiscount);

module.exports = router;
