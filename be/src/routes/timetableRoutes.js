// import express from 'express';
// // Đảm bảo import .js extension nếu bạn đang sử dụng ES Modules
// import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';
// import {
//     getTimetable,
//     createTimetable,
//     updateTimetable,
//     deleteTimetable,
//     listTimetablesController, // Thêm controller cho chức năng liệt kê có bộ lọc (nếu có)
//     importTimetablesFromJSONController, // Thêm controller nếu có nhập từ JSON
//     downloadTemplateController, // Thêm controller nếu có tải template
// } from '../controllers/timetableController.js';

// const router = express.Router();

// /**
//  * @route GET /api/timetables/
//  * @desc Lấy tất cả các thời khóa biểu.
//  * Yêu cầu quyền admin hoặc training_officer.
//  * @access Private
//  */
// router.get(
//     '/',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     getTimetable
// );

// /**
//  * @route POST /api/timetables/
//  * @desc Tạo một thời khóa biểu mới.
//  * Yêu cầu quyền admin hoặc training_officer.
//  * @access Private
//  */
// router.post(
//     '/',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     createTimetable
// );

// /**
//  * @route PUT /api/timetables/:id
//  * @desc Cập nhật một thời khóa biểu theo ID.
//  * Yêu cầu quyền admin hoặc training_officer.
//  * @access Private
//  */
// router.put(
//     '/:id',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     updateTimetable
// );

// /**
//  * @route DELETE /api/timetables/:id
//  * @desc Xóa một thời khóa biểu theo ID.
//  * Yêu cầu quyền admin hoặc training_officer.
//  * @access Private
//  */
// router.delete(
//     '/:id',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     deleteTimetable
// );

// /**
//  * @route GET /api/timetables/list
//  * @desc Lấy danh sách thời khóa biểu với các bộ lọc tùy chọn.
//  * Tuyến đường này thường được sử dụng cho các truy vấn có bộ lọc, phân trang, sắp xếp.
//  * Đảm bảo bạn đã định nghĩa `listTimetablesController` trong `timetableController.js`.
//  * Yêu cầu quyền admin hoặc training_officer.
//  * @access Private
//  */
// router.get(
//     '/list',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     listTimetablesController
// );

// /**
//  * @route POST /api/timetables/importJson
//  * @desc Nhập dữ liệu thời khóa biểu từ định dạng JSON.
//  * Yêu cầu quyền admin hoặc training_officer.
//  * @access Private
//  */
// router.post(
//     '/importJson',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     importTimetablesFromJSONController
// );

// /**
//  * @route GET /api/timetables/template/download
//  * @desc Tải xuống template Excel cho thời khóa biểu.
//  * Hiện tại, tuyến đường này không yêu cầu xác thực, hãy cân nhắc có nên bảo vệ nó không.
//  * @access Public (hoặc Private nếu bạn muốn hạn chế truy cập template)
//  */
// router.get(
//     '/template/download',
//     // authenticateAndAuthorize(['admin', 'training_officer']), // Có thể uncomment nếu muốn bảo vệ template
//     downloadTemplateController
// );

// export default router;