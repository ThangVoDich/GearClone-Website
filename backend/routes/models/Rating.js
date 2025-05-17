const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

ratingSchema.index({ user: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
