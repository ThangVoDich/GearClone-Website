const express = require("express");
const router = express.Router();
const { createGuestOrder } = require("../controllers/guestOrderController");

router.post("/", createGuestOrder);
// router.get("/", protect, getUserOrders);
module.exports = router;
