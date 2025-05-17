const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const { protect } = require('../middlewares/authMiddleware');


router.post('/', protect, async (req, res) => {
  try {
    const { productId, stars, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !stars) return res.status(400).json({ message: "Thiếu thông tin" });

    const existing = await Rating.findOneAndUpdate(
      { user: userId, productId },
      { stars, comment },
      { new: true, upsert: true }
    );

    res.json({ message: "Đánh giá thành công", rating: existing });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


router.get('/:productId', async (req, res) => {
  try {
    const ratings = await Rating.find({ productId: req.params.productId });
    const total = ratings.length;
    const average = total === 0 ? 0 : (ratings.reduce((sum, r) => sum + r.stars, 0) / total).toFixed(1);
    res.json({ average: parseFloat(average), total });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
router.get('/:productId/all', async (req, res) => {
  try {
    const ratings = await Rating.find({ productId: req.params.productId, comment: { $ne: null } })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
