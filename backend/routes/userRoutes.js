const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { forgotPassword, resetPassword } = require('../controllers/userController');
const { googleLoginUser, setUserPassword } = require('../controllers/userController');
const { getProfile } = require("../controllers/userController");
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.post('/google-login', googleLoginUser);
router.put('/set-password', protect, setUserPassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get("/profile", protect, getProfile); // ✅ Đây là route mà frontend gọi

module.exports = router;
