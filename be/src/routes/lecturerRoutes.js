import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js";
import {
  getAllLecturersController,
  // getLecturerByIdController,
  createLecturerController,
  updateLecturerController,
  deleteLecturerController,
  importLecturersFromJsonController,
  downloadTemplateController,
} from "../controllers/lecturerController.js";

const lecturerRoutes = express.Router();

/**
 * @route GET /api/lecturers/getAll
 * @desc Lấy tất cả danh sách giảng viên.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
lecturerRoutes.get(
  "/getAll",
  authenticateAndAuthorize(["admin", "training_officer"]),
  getAllLecturersController
);

/**
 * @route GET /api/lecturers/:id
 * @desc Lấy thông tin chi tiết một giảng viên theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// lecturerRoutes.get(
//   "/:id",
//   authenticateAndAuthorize(["admin", "training_officer"]),
//   getLecturerByIdController
// );

/**
 * @route POST /api/lecturers/create
 * @desc Tạo một giảng viên mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
lecturerRoutes.post(
  "/create",
  authenticateAndAuthorize(["admin", "training_officer"]),
  createLecturerController
);

/**
 * @route PUT /api/lecturers/update/:id
 * @desc Cập nhật thông tin giảng viên theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
lecturerRoutes.put(
  "/update/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  updateLecturerController
);

/**
 * @route DELETE /api/lecturers/delete/:id
 * @desc Xóa một giảng viên theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
lecturerRoutes.delete(
  "/delete/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  deleteLecturerController
);

/**
 * @route GET /api/lecturers/list
 * @desc Liệt kê giảng viên với các bộ lọc tùy chọn.
 * Tuyến đường này được thêm vào để hỗ trợ các truy vấn có bộ lọc, phân trang, sắp xếp.
 * Đảm bảo bạn đã định nghĩa `listLecturersController` trong `lecturerController.js`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// lecturerRoutes.get(
//     '/list', // Đặt tên rõ ràng để tránh xung đột với GET /:id
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     listLecturersController
// );

/**
 * @route POST /api/lecturers/importJson
 * @desc Nhập dữ liệu giảng viên từ định dạng JSON.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
lecturerRoutes.post(
  "/importJson",
  authenticateAndAuthorize(["admin", "training_officer"]),
  importLecturersFromJsonController
);

/**
 * @route POST /api/lecturers/importExcel
 * @desc Nhập dữ liệu giảng viên từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập từ Excel.
 * Đảm bảo đã import `uploadExcel` từ `excelMiddleware.js` nếu sử dụng và có `importLecturersController`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// lecturerRoutes.post(
//     '/importExcel',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Sử dụng .single('file') nếu chỉ cho phép một file với tên 'file'
//     importLecturersController
// );

/**
 * @route GET /api/lecturers/template/download
 * @desc Tải xuống template Excel cho giảng viên.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
lecturerRoutes.get(
  "/template/download",
  authenticateAndAuthorize(["admin", "training_officer"]),
  downloadTemplateController
);

export default lecturerRoutes;
