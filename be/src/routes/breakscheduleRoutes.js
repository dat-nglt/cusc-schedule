import express from 'express';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';
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
import { uploadExcel } from '../middleware/excelMiddleware.js'; // Make sure this path is correct

const breakscheduleRoutes = express.Router();

// --- Tuyến đường API cho Lịch nghỉ (Break Schedules) ---

/**
 * @route GET /api/breakschedules
 * @desc Lấy tất cả các lịch nghỉ.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.get(
    '/',
    authenticateAndAuthorize(['admin', 'training_officer']),
    getAllBreakSchedulesController
);

/**
 * @route GET /api/breakschedules/:break_id
 * @desc Lấy thông tin lịch nghỉ theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.get(
    '/:break_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    getBreakScheduleByIdController
);

/**
 * @route POST /api/breakschedules/add
 * @desc Thêm một lịch nghỉ mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.post(
    '/add',
    authenticateAndAuthorize(['admin', 'training_officer']),
    createBreakScheduleController
);

/**
 * @route PUT /api/breakschedules/edit/:break_id
 * @desc Cập nhật thông tin lịch nghỉ theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.put(
    '/edit/:break_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    updateBreakScheduleController
);

/**
 * @route DELETE /api/breakschedules/delete/:break_id
 * @desc Xóa một lịch nghỉ theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.delete(
    '/delete/:break_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    deleteBreakScheduleController
);

/**
 * @route GET /api/breakschedules/list (Hoặc /api/breakschedules?...)
 * @desc Lấy danh sách lịch nghỉ với các tùy chọn bộ lọc.
 * Lưu ý: Tuyến đường này có thể trùng với tuyến đường GET '/' nếu không có bộ lọc cụ thể.
 * Cần đảm bảo thứ tự tuyến đường hoặc sử dụng đường dẫn rõ ràng hơn nếu có bộ lọc.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.get(
    '/list', // Đổi thành /list để tránh trùng lặp với '/' nếu không có query params
    authenticateAndAuthorize(['admin', 'training_officer']),
    listBreakSchedulesController
);

// --- Tuyến đường nhập xuất dữ liệu lịch nghỉ ---

/**
 * @route POST /api/breakschedules/import
 * @desc Nhập dữ liệu lịch nghỉ từ file Excel.
 * Tuyến đường này hiện đang được comment, kích hoạt khi cần chức năng nhập từ Excel.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// breakscheduleRoutes.post(
//     '/import',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Sử dụng .single('file') nếu chỉ cho phép một file với tên 'file'
//     importBreakSchedulesController
// );

/**
 * @route POST /api/breakschedules/importJson
 * @desc Nhập dữ liệu lịch nghỉ từ định dạng JSON (dùng cho tính năng xem trước hoặc API nội bộ).
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.post(
    '/importJson',
    authenticateAndAuthorize(['admin', 'training_officer']),
    importBreakSchedulesFromJsonController
);

/**
 * @route GET /api/breakschedules/template/download
 * @desc Tải xuống template Excel cho lịch nghỉ.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
breakscheduleRoutes.get(
    '/template/download',
    authenticateAndAuthorize(['admin', 'training_officer']),
    downloadBreakScheduleTemplateController
);

export default breakscheduleRoutes;