const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User"); // để lấy email từ userId nếu chưa có
const Discount = require("../models/Discount");


exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingInfo,
      totalPrice,
      paymentMethod,
      discountCode,
      discountPercent,
      loyaltyUsed = 0
    } = req.body;

    const usedPoints = parseInt(loyaltyUsed) || 0;
let finalTotal = totalPrice;

// Mã giảm giá
if (discountCode) {
  const discount = await Discount.findOne({ code: discountCode.toUpperCase() });
  if (!discount || discount.used >= discount.usageLimit || (discount.expiresAt && discount.expiresAt < new Date())) {
    return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn." });
  }
  finalTotal = Math.ceil(totalPrice * (1 - discount.percent / 100));
  discount.used += 1;
  await discount.save();
}

const user = await User.findById(req.user.id);
if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

const pointToMoney = usedPoints * 1000;
let earnedPoints = 0;

// Log giá trị loyaltyUsed để debug
console.log("Loyalty points used in request:", loyaltyUsed);
console.log("Parsed usedPoints:", usedPoints);

if (usedPoints > 0) {
  if (user.loyaltyPoints < usedPoints) {
    console.log("User does not have enough loyalty points:", user.loyaltyPoints);
    return res.status(400).json({ message: "Bạn không đủ điểm thưởng." });
  }

  user.loyaltyPoints -= usedPoints;   // ✅ thực sự trừ
  finalTotal -= pointToMoney;
  console.log("Loyalty points deducted. Remaining points:", user.loyaltyPoints);
} else {
  earnedPoints = Math.floor(finalTotal * 0.01 / 1000);
  user.loyaltyPoints += earnedPoints; // ✅ chỉ cộng khi không dùng điểm
  console.log("Loyalty points earned:", earnedPoints);
}

await user.save();
 // 🔒 Chắc chắn được lưu sau khi trừ/cộng

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingInfo,
      totalPrice: finalTotal,
      paidAt: Date.now(),
      isPaid: false,
      status: "pending",
      paymentMethod,
      discountCode: discountCode || null,
      discountPercent: discountPercent || 0,
      loyaltyUsed: usedPoints
    });

    await sendEmail(
      user.email,
      "Xác nhận đơn hàng tại GEARCLONE",
      `
        <h3>Chào ${shippingInfo.fullname},</h3>
        <p>Cảm ơn bạn đã đặt hàng tại <strong>GEARCLONE</strong>.</p>
        <p><strong>Mã đơn:</strong> ${order._id}</p>
        <p><strong>Tổng thanh toán:</strong> ${finalTotal.toLocaleString()}đ</p>
        <p><strong>Điểm sử dụng:</strong> ${usedPoints} (${pointToMoney.toLocaleString()}đ)</p>
        <p><strong>Điểm cộng thêm:</strong> ${earnedPoints} điểm</p>
        <p><strong>Phương thức thanh toán:</strong> ${paymentMethod === 'BANK' ? 'Chuyển khoản' : 'COD'}</p>
        <br>
        <p><em>GEARCLONE Team</em></p>
      `
    );

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};




// Lấy danh sách đơn hàng của người dùng đang đăng nhập
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng: " + err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    await order.remove();
    res.json({ message: "Đã xoá đơn hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getMyOrderById = async (req, res) => {
  try {
    console.log("Order ID:", req.params.id); // Log ID đơn hàng

    const order = await Order.findById(req.params.id).populate("user", "name email");
    console.log("Order found:", order); // Log thông tin đơn hàng

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    console.log("Authenticated user:", req.user); // Log thông tin người dùng

    // Bỏ kiểm tra quyền truy cập
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err); // Log lỗi
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng: " + err.message });
  }
};


