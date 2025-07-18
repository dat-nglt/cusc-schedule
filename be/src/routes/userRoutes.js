import express from 'express';
import { getAllUsersController, getCurrentUserData } from '../controllers/userController.js';
import authMiddleware, { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

/**
 * @route GET /api/users/me
 * @desc Lấy thông tin của người dùng hiện tại (đã đăng nhập).
 * Bất kỳ người dùng nào đã xác thực đều có thể truy cập tuyến đường này.
 * @access Private (yêu cầu xác thực)
 */
userRoutes.get('/me', authMiddleware, getCurrentUserData);

/**
 * @route GET /api/users/getAll
 * @desc Lấy tất cả danh sách người dùng từ hệ thống.
 * Chỉ những người dùng có vai trò 'admin' hoặc 'training_officer' mới được phép truy cập.
 * Sử dụng middleware kết hợp `authenticateAndAuthorize` để xử lý cả xác thực và phân quyền.
 * @access Private (yêu cầu quyền admin hoặc training_officer)
 */
userRoutes.get('/getAll', authenticateAndAuthorize(['admin', 'training_officer']), getAllUsersController);

export default userRoutes;