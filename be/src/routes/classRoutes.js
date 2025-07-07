import express from 'express';
import authMiddleware, { authenticateAndAuthorize } from '../middleware/authMiddleware.js';
import {
  getAllClassesController,
  getClassByIdController,
  createClassController,
  updateClassController,
  deleteClassController,
  listClassesController,
  importClassesController,
  importClassesFromJsonController,
  downloadTemplateController,
} from '../controllers/classController.js';
import { uploadExcel } from '../middleware/excelMiddleware.js';

const classRoutes = express.Router();

// Lấy tất cả lớp học
classRoutes.get('/', authenticateAndAuthorize(['admin', 'training_officer']), getAllClassesController);

// Lấy lớp học theo ID
classRoutes.get('/:class_id', authenticateAndAuthorize(['admin', 'training_officer']), getClassByIdController);

// Thêm lớp học mới
classRoutes.post('/add', authenticateAndAuthorize(['admin', 'training_officer']), createClassController);

// Cập nhật lớp học
classRoutes.put('/edit/:class_id', authenticateAndAuthorize(['admin', 'training_officer']), updateClassController);

// Xóa lớp học
classRoutes.delete('/delete/:class_id', authenticateAndAuthorize(['admin', 'training_officer']), deleteClassController);

// Danh sách lớp học với các bộ lọc
classRoutes.get('/list', authenticateAndAuthorize(['admin', 'training_officer']), listClassesController);

// Import Excel routes
// classRoutes.post('/import', authenticateAndAuthorize(['admin', 'training_officer']), uploadExcel, importClassesController);
classRoutes.post('/importJson', authenticateAndAuthorize(['admin', 'training_officer']), importClassesFromJsonController);
classRoutes.get('/template/download', authenticateAndAuthorize(['admin', 'training_officer']), downloadTemplateController);

export default classRoutes;