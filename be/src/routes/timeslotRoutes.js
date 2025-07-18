import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js"; // Đảm bảo import .js extension nếu dùng ES Modules
import {
    getAllTimeslotController,
    getTimeslotByIdController,
    createTimeslotController,
    updateTimeslotController,
    deleteTimeslotController,
    importTimeslotFromJSONController,
    downloadTemplateController,
    listTimeslotController, // Thêm controller cho chức năng liệt kê có bộ lọc
    importTimeslotFromExcelController, // Thêm controller nếu có nhập từ Excel
} from "../controllers/timeslotController.js"; // Đảm bảo import .js extension


const timeslotRoutes = express.Router();

// 
timeslotRoutes.get(
    "/getAll",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getAllTimeslotController
);

/**
 * @route GET /api/programs/:id
 * @desc Lấy thông tin chi tiết một khung thời gian theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
timeslotRoutes.get(
    "/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getTimeslotByIdController
);

/**
 * @route POST /api/timeslot/create
 * @desc Tạo một khung thời gian mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
timeslotRoutes.post(
    "/create",
    authenticateAndAuthorize(["admin", "training_officer"]),
    createTimeslotController
);

/**
 * @route PUT /api/timeslot/update/:id
 * @desc Cập nhật thông tin khung thời gian theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
timeslotRoutes.put(
    "/update/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    updateTimeslotController
);

/**
 * @route DELETE /api/timeslot/delete/:id
 * @desc Xóa một khung thời gian theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
timeslotRoutes.delete(
    "/delete/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    deleteTimeslotController
);

/**
 * @route GET /api/timeslot/list
 * @desc Liệt kê các khung thời gian với các bộ lọc tùy chọn.
 * Tuyến đường này được thêm vào để hỗ trợ các truy vấn có bộ lọc, phân trang, sắp xếp.
 * Đảm bảo bạn đã định nghĩa `listTimeslotController` trong `timeslotController.js`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// timeslotRoutes.get(
//     "/list", // Đặt tên rõ ràng để tránh xung đột với GET /:id
//     authenticateAndAuthorize(["admin", "training_officer"]),
//     listTimeslotController
// );

/**
 * @route POST /api/timeslot/importJson
 * @desc Nhập dữ liệu chương trình đào tạo từ định dạng JSON (dùng cho tính năng xem trước hoặc API nội bộ).
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// timeslotRoutes.post(
//     "/importJson",
//     authenticateAndAuthorize(["admin", "training_officer"]),
//     importTimeslotFromJSONController
// );

/**
 * @route POST /api/timeslot/importExcel
 * @desc Nhập dữ liệu khung thời gian từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập từ Excel.
 * Đảm bảo đã import `uploadExcel` từ `excelMiddleware.js` nếu sử dụng và có `importTimeslotFromExcelController`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// timeslotRoutes.post(
//     '/importExcel',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Sử dụng .single('file') nếu chỉ cho phép một file với tên 'file'
//     importTimeslotFromExcelController
// );

/**
 * @route GET /api/timeslot/template/download
 * @desc Tải xuống template Excel cho chương trình đào tạo.
 * Hiện tại, tuyến đường này không yêu cầu xác thực, hãy cân nhắc có nên bảo vệ nó không.
 * @access Public (hoặc Private nếu bạn muốn hạn chế truy cập template)
 */
// timeslotRoutes.get(
//     "/template/download",
//     // authenticateAndAuthorize(["admin", "training_officer"]), // Có thể uncomment nếu muốn bảo vệ template
//     downloadTemplateController
// );

export default timeslotRoutes;