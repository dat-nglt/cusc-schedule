import express from 'express';
import passport from 'passport';
import { login, register, logout, googleCallback } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../utils/validation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Tuyến đường xác thực người dùng ---

/**
 * @route POST /api/auth/login
 * @desc Đăng nhập người dùng.
 * Đường dẫn này đã được comment lại, có thể được kích hoạt nếu sử dụng xác thực bằng email/mật khẩu truyền thống.
 * @access Public
 */
// router.post('/login', validateLogin, login);

/**
 * @route POST /api/auth/register
 * @desc Đăng ký người dùng mới.
 * Đường dẫn này đã được comment lại, có thể được kích hoạt nếu sử dụng xác thực bằng email/mật khẩu truyền thống.
 * @access Public
 */
// router.post('/register', validateRegister, register);

/**
 * @route POST /api/auth/logout
 * @desc Đăng xuất người dùng. Yêu cầu người dùng phải xác thực trước khi thực hiện.
 * @access Private
 */
router.post('/logout', authMiddleware, logout);

// --- Tuyến đường xác thực Google OAuth ---

/**
 * @route GET /api/auth/google
 * @desc Bắt đầu quá trình xác thực với Google.
 * Chuyển hướng người dùng đến trang đăng nhập của Google.
 * @access Public
 */
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @route GET /api/auth/google/callback
 * @desc Xử lý phản hồi từ Google sau khi xác thực.
 * Nếu xác thực thành công, sẽ gọi `googleCallback`. Nếu thất bại, chuyển hướng về trang /login.
 * @access Public
 */
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    googleCallback
);

export default router;