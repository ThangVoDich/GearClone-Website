const Product = require('../models/Product');

// Lấy tất cả sản phẩm hoặc lọc theo category + subcategory
const getProducts = async (req, res) => {
  try {
    const { type, sub } = req.query;
    let filter = {};

    if (type && type !== 'all') filter.category = type;
    if (sub) filter.subcategory = sub;

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find().limit(4);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server: ' + err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server: ' + err.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
        { subcategory: { $regex: keyword, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm", error: err.message });
  }
};


module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  searchProducts  // ✅ thêm vào export
};

