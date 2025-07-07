import express from 'express';
import authMiddleware, { authenticateAndAuthorize } from '../middleware/authMiddleware.js';
import {
  getAllBreakSchedulesController,
  getBreakScheduleByIdController,
  createBreakScheduleController,
  updateBreakScheduleController,
  deleteBreakScheduleController,
  listBreakSchedulesController,
  importBreakSchedulesController,
  importBreakSchedulesFromJsonController,
  downloadBreakScheduleTemplateController,
} from '../controllers/breakscheduleController.js';
import { uploadExcel } from '../middleware/excelMiddleware';

const breakscheduleRoutes = express.Router();

// Lấy tất cả lịch nghỉ
breakscheduleRoutes.get('/', authenticateAndAuthorize(['admin', 'training_officer']), getAllBreakSchedulesController);

// Lấy lịch nghỉ theo ID
breakscheduleRoutes.get('/:break_id', authenticateAndAuthorize(['admin', 'training_officer']), getBreakScheduleByIdController);

// Thêm lịch nghỉ mới
breakscheduleRoutes.post('/add', authenticateAndAuthorize(['admin', 'training_officer']), createBreakScheduleController);

// Cập nhật lịch nghỉ
breakscheduleRoutes.put('/edit/:break_id', authenticateAndAuthorize(['admin', 'training_officer']), updateBreakScheduleController);

// Xóa lịch nghỉ
breakscheduleRoutes.delete('/delete/:break_id', authenticateAndAuthorize(['admin', 'training_officer']), deleteBreakScheduleController);

// Danh sách lịch nghỉ với các bộ lọc
breakscheduleRoutes.get('', authenticateAndAuthorize(['admin', 'training_officer']), listBreakSchedulesController);

// Import Excel routes
// breakscheduleRoutes.post('/import', authenticateAndAuthorize(['admin', 'training_officer']), uploadExcel, importBreakSchedulesController);
breakscheduleRoutes.post('/importJson', authenticateAndAuthorize(['admin', 'training_officer']), importBreakSchedulesFromJsonController);
breakscheduleRoutes.get('/template/download', authenticateAndAuthorize(['admin', 'training_officer']), downloadBreakScheduleTemplateController);

export default breakscheduleRoutes;