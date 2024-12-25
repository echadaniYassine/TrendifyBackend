//Routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/TrendifyAuthController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/Trendify_register', authController.register);
router.post('/Trendify_login', authController.login);
router.put('/Trendify_modifyUser', authMiddleware,authController.modifyUser);
router.post('/Trendify_forgot-password', authController.forgotPassword);
router.post('/Trendify_reset-password/:token', authController.resetPassword);
router.get('/Trendify_user-info', authMiddleware,authController.getUserInfo);


module.exports = router;
