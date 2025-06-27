import express from 'express';
import authMiddleware, { authenticateAndAuthorize } from '../middleware/authMiddleware.js';
import {
  getAllCoursesController,
  getCourseByIdController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
  listCoursesController,
  importCoursesController,
  downloadTemplateController,
} from '../controllers/courseController.js';
import { uploadExcel } from '../middleware/excelMiddleware';

const courseRoutes = express.Router();

// Lấy tất cả khóa học
courseRoutes.get('/', authenticateAndAuthorize(['admin', 'training_officer']), getAllCoursesController);

// Lấy khóa học theo ID
courseRoutes.get('/:course_id', authenticateAndAuthorize(['admin', 'training_officer']), getCourseByIdController);

// Thêm khóa học mới
courseRoutes.post('/add', authenticateAndAuthorize(['admin', 'training_officer']), createCourseController);

// Cập nhật khóa học
courseRoutes.put('/edit/:course_id', authenticateAndAuthorize(['admin', 'training_officer']), updateCourseController);

// Xóa khóa học
courseRoutes.delete('/delete/:course_id', authenticateAndAuthorize(['admin', 'training_officer']), deleteCourseController);

// Danh sách khóa học với các bộ lọc
courseRoutes.get('', authenticateAndAuthorize(['admin', 'training_officer']), listCoursesController);

// Import Excel routes
courseRoutes.post('/import', authenticateAndAuthorize(['admin', 'training_officer']), uploadExcel, importCoursesController);
courseRoutes.get('/template/download', authenticateAndAuthorize(['admin', 'training_officer']), downloadTemplateController);

export default courseRoutes;