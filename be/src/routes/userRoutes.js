import express from 'express';
import { getAllUsersController, getCurrentUser } from '../controllers/userController.js';
import authMiddleware, { requireRole, authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

// Get current user info - tất cả user đã đăng nhập đều có thể truy cập
userRoutes.get('/me', authMiddleware, getCurrentUser);

// Get all users - chỉ admin và training_officer mới được xem
// Cách 1: Sử dụng 2 middleware riêng biệt
// userRoutes.get('/getAll', authMiddleware, requireRole(['admin', 'training_officer']), getAllUsersController);

// Cách 2: Sử dụng middleware kết hợp (nên dùng cách này)
userRoutes.get('/getAll', authenticateAndAuthorize(['admin', 'training_officer']), getAllUsersController);

export default userRoutes;