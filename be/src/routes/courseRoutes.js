import express from 'express';
import {
  getAllCoursesController,
  getCourseByIdController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
  listCoursesController,
} from '../controllers/courseController.js';

const courseRoutes = express.Router();

// Lấy tất cả khóa học
courseRoutes.get('/', getAllCoursesController);

// Lấy khóa học theo ID
courseRoutes.get('/:id', getCourseByIdController);

// Thêm khóa học mới
courseRoutes.post('/add', createCourseController);

// Cập nhật khóa học
courseRoutes.put('/edit/:id', updateCourseController);

// Xóa khóa học
courseRoutes.delete('/delete/:courseid', deleteCourseController);

// Danh sách khóa học với các bộ lọc
courseRoutes.get('', listCoursesController);

export default courseRoutes;
