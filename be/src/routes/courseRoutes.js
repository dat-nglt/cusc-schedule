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
    importCoursesFromJsonController,
    downloadTemplateController,
} from '../controllers/courseController.js';
// Make sure to import uploadExcel if you plan to use the /import route
// import { uploadExcel } from '../middleware/excelMiddleware.js';


const courseRoutes = express.Router();

/**
 * @route GET /api/courses/
 * @desc Lấy tất cả các khóa học.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
courseRoutes.get(
    '/getAll',
    authenticateAndAuthorize(['admin', 'training_officer']),
    getAllCoursesController
);

/**
 * @route GET /api/courses/:course_id
 * @desc Lấy thông tin một khóa học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
courseRoutes.get(
    '/:course_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    getCourseByIdController
);

/**
 * @route POST /api/courses/add
 * @desc Thêm một khóa học mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
courseRoutes.post(
    '/add',
    authenticateAndAuthorize(['admin', 'training_officer']),
    createCourseController
);

/**
 * @route PUT /api/courses/edit/:course_id
 * @desc Cập nhật thông tin một khóa học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
courseRoutes.put(
    '/edit/:course_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    updateCourseController
);

/**
 * @route DELETE /api/courses/delete/:course_id
 * @desc Xóa một khóa học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
courseRoutes.delete(
    '/delete/:course_id',
    authenticateAndAuthorize(['admin', 'training_officer']),
    deleteCourseController
);

/**
 * @route GET /api/courses/list
 * @desc Lấy danh sách các khóa học với các tùy chọn bộ lọc.
 * Lưu ý: Tuyến đường này được đặt là `/list` để tránh xung đột tiềm ẩn với tuyến đường `GET /` khi không có tham số ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// courseRoutes.get(
//     '/list', // Đổi thành '/list' để tường minh hơn cho các truy vấn có bộ lọc
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     listCoursesController
// );

/**
 * @route POST /api/courses/import
 * @desc Nhập dữ liệu khóa học từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập từ Excel.
 * Đảm bảo đã import `uploadExcel` từ `excelMiddleware.js` nếu sử dụng.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// courseRoutes.post(
//     '/import',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Giả định bạn mong đợi một file Excel duy nhất với tên trường là 'file'
//     importCoursesController
// );

/**
 * @route POST /api/courses/importJson
 * @desc Nhập dữ liệu khóa học từ định dạng JSON (dùng cho tính năng xem trước hoặc API nội bộ).
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
courseRoutes.post(
    '/importJson',
    authenticateAndAuthorize(['admin', 'training_officer']),
    importCoursesFromJsonController
);

/**
 * @route GET /api/courses/template/download
 * @desc Tải xuống template Excel cho khóa học.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
courseRoutes.get(
    '/template/download',
    authenticateAndAuthorize(['admin', 'training_officer']),
    downloadTemplateController
);

export default courseRoutes;