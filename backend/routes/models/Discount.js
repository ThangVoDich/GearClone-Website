const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  percent: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  expiresAt: Date,
  usageLimit: {
    type: Number,
    default: 100
  },
  used: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Discount", discountSchema);
