import express from "express";
import authMiddleware, {
  authenticateAndAuthorize,
} from "../middleware/authMiddleware.js";
import {
  getAllStudentsController,
  getStudentByIdController,
  createStudentController,
  updateStudentController,
  deleteStudentController,
  importStudentsFromJSONController,
  downloadTemplateController,
  // listStudentsController, // Thêm controller cho chức năng liệt kê có bộ lọc
  // importStudentsFromExcelController, // Thêm controller nếu có nhập từ Excel
} from "../controllers/studentController.js";
// Nếu có tính năng import từ Excel, hãy thêm dòng này:
// import { uploadExcel } from '../middleware/excelMiddleware.js';

const studentRoutes = express.Router();

/**
 * @route GET /api/students/getAll
 * @desc Lấy tất cả danh sách sinh viên.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
studentRoutes.get(
  "/getAll",
  authenticateAndAuthorize(["admin", "training_officer"]),
  getAllStudentsController
);

/**
 * @route GET /api/students/:id
 * @desc Lấy thông tin chi tiết một sinh viên theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
studentRoutes.get(
  "/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  getStudentByIdController
);

/**
 * @route POST /api/students/create
 * @desc Tạo một sinh viên mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
studentRoutes.post(
  "/create",
  authenticateAndAuthorize(["admin", "training_officer"]),
  createStudentController
);

/**
 * @route PUT /api/students/update/:id
 * @desc Cập nhật thông tin sinh viên theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
studentRoutes.put(
  "/update/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  updateStudentController
);

/**
 * @route DELETE /api/students/delete/:id
 * @desc Xóa một sinh viên theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
studentRoutes.delete(
  "/delete/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  deleteStudentController
);

/**
 * @route GET /api/students/list
 * @desc Liệt kê sinh viên với các bộ lọc tùy chọn.
 * Tuyến đường này được thêm vào để hỗ trợ các truy vấn có bộ lọc, phân trang, sắp xếp.
 * Đảm bảo bạn đã định nghĩa `listStudentsController` trong `studentController.js`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// studentRoutes.get(
//     '/list', // Đặt tên rõ ràng để tránh xung đột với GET /:id
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     listStudentsController
// );

/**
 * @route POST /api/students/importJson
 * @desc Nhập dữ liệu sinh viên từ định dạng JSON.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
studentRoutes.post(
  "/importJson",
  authenticateAndAuthorize(["admin", "training_officer"]),
  importStudentsFromJSONController
);

/**
 * @route POST /api/students/importExcel
 * @desc Nhập dữ liệu sinh viên từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập từ Excel.
 * Đảm bảo đã import `uploadExcel` từ `excelMiddleware.js` nếu sử dụng và có `importStudentsFromExcelController`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// studentRoutes.post(
//     '/importExcel',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Sử dụng .single('file') nếu chỉ cho phép một file với tên 'file'
//     importStudentsFromExcelController
// );

/**
 * @route GET /api/students/template/download
 * @desc Tải xuống template Excel cho sinh viên.
 * Hiện tại, tuyến đường này không yêu cầu xác thực, hãy cân nhắc có nên bảo vệ nó không.
 * @access Public (hoặc Private nếu bạn muốn hạn chế truy cập template)
 */
studentRoutes.get(
  "/template/download",
  // authenticateAndAuthorize(['admin', 'training_officer']), // Có thể uncomment nếu muốn bảo vệ template
  downloadTemplateController
);

export default studentRoutes;
