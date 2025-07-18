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

// --- Tuyến đường API cho Lớp học (Classes) ---

/**
 * @route GET /api/classes/
 * @desc Lấy tất cả các lớp học.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.get(
    '/',
    authenticateAndAuthorize(['admin', 'training_officer']),
    getAllClassesController
);

/**
 * @route GET /api/classes/:class_id
 * @desc Lấy thông tin một lớp học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.get(
    '/:class_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    getClassByIdController
);

/**
 * @route POST /api/classes/add
 * @desc Thêm một lớp học mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.post(
    '/add',
    authenticateAndAuthorize(['admin', 'training_officer']),
    createClassController
);

/**
 * @route PUT /api/classes/edit/:class_id
 * @desc Cập nhật thông tin một lớp học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.put(
    '/edit/:class_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    updateClassController
);

/**
 * @route DELETE /api/classes/delete/:class_id
 * @desc Xóa một lớp học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.delete(
    '/delete/:class_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    deleteClassController
);

/**
 * @route GET /api/classes/list
 * @desc Lấy danh sách các lớp học với các tùy chọn bộ lọc.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.get(
    '/list',
    authenticateAndAuthorize(['admin', 'training_officer']),
    listClassesController
);

/**
 * @route POST /api/classes/import
 * @desc Nhập dữ liệu lớp học từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập từ Excel.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// classRoutes.post(
//     '/import',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Giả định bạn mong đợi một file Excel duy nhất với tên trường là 'file'
//     importClassesController
// );

/**
 * @route POST /api/classes/importJson
 * @desc Nhập dữ liệu lớp học từ định dạng JSON (dùng cho tính năng xem trước hoặc API nội bộ).
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.post(
    '/importJson',
    authenticateAndAuthorize(['admin', 'training_officer']),
    importClassesFromJsonController
);

/**
 * @route GET /api/classes/template/download
 * @desc Tải xuống template Excel cho lớp học.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
classRoutes.get(
    '/template/download',
    authenticateAndAuthorize(['admin', 'training_officer']),
    downloadTemplateController
);

export default classRoutes;