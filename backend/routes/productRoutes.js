const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts
} = require('../controllers/productController');

// ❗ ĐẶT các route đặc biệt lên trước
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);

// ❗ CUỐI CÙNG mới là route động :id
router.get('/:id', getProductById);

// ❗ Đặt / sau cùng để không nuốt route khác
router.get('/', getProducts);

module.exports = router;
