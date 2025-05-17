const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.post('/', async (req, res) => {
  try {
    const { name, message, productId } = req.body;
    if (!name || !message || !productId) return res.status(400).json({ message: "Thiếu thông tin" });

    const newComment = new Comment({ name, message, productId });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
