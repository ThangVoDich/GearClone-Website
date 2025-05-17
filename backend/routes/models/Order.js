const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  shippingInfo: {
    fullname: String,
    address: String,
    phone: String,
    note: String
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
    default: "pending"
  },
  discountCode: {
  type: String
},
discountPercent: {
  type: Number,
  default: 0
}
,
  
  totalPrice: Number,
  paymentMethod: {
    type: String,
    enum: ["COD", "BANK"],
    default: "COD",
    required: true
  },
  paidAt: Date,
  isPaid: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
