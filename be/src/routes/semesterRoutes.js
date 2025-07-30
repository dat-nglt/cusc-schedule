import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js"; // Đảm bảo import .js extension nếu dùng ES Modules
import {
    getAllSemestersController,
    getSemesterByIdController,
    createSemesterController,
    updateSemesterController,
    deleteSemesterController,
    importSemestersFromJSONController,
    downloadTemplateController,
    // listSemestersController, // Thêm controller cho chức năng liệt kê có bộ lọc
    // importSemestersFromExcelController, // Thêm controller nếu có nhập từ Excel
} from "../controllers/semesterController.js"; // Đảm bảo import .js extension

// Nếu có tính năng import từ Excel, hãy thêm dòng này:
// import { uploadExcel } from '../middleware/excelMiddleware.js';

const semesterRoutes = express.Router();


/**
 * @route GET /api/semesters/getAll
 * @desc Lấy tất cả các học kỳ.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
semesterRoutes.get(
    "/getAll",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getAllSemestersController
);

/**
 * @route GET /api/semesters/:id
 * @desc Lấy thông tin chi tiết một học kỳ theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
semesterRoutes.get(
    "/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getSemesterByIdController
);

/**
 * @route POST /api/semesters/create
 * @desc Tạo một học kỳ mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
semesterRoutes.post(
    "/create",
    authenticateAndAuthorize(["admin", "training_officer"]),
    createSemesterController
);

/**
 * @route PUT /api/semesters/update/:id
 * @desc Cập nhật thông tin học kỳ theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
semesterRoutes.put(
    "/update/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    updateSemesterController
);

/**
 * @route DELETE /api/semesters/delete/:id
 * @desc Xóa một học kỳ theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
semesterRoutes.delete(
    "/delete/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    deleteSemesterController
);

/**
 * @route GET /api/semesters/list
 * @desc Liệt kê các học kỳ với các bộ lọc tùy chọn.
 * Tuyến đường này được thêm vào để hỗ trợ các truy vấn có bộ lọc, phân trang, sắp xếp.
 * Đảm bảo bạn đã định nghĩa `listSemestersController` trong `semesterController.js`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// semesterRoutes.get(
//     "/list", // Đặt tên rõ ràng để tránh xung đột với GET /:id
//     authenticateAndAuthorize(["admin", "training_officer"]),
//     listSemestersController
// );

/**
 * @route POST /api/semesters/importJson
 * @desc Nhập dữ liệu học kỳ từ định dạng JSON (dùng cho tính năng xem trước hoặc API nội bộ).
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
semesterRoutes.post(
    "/importJson",
    authenticateAndAuthorize(["admin", "training_officer"]),
    importSemestersFromJSONController
);

/**
 * @route POST /api/semesters/importExcel
 * @desc Nhập dữ liệu học kỳ từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập từ Excel.
 * Đảm bảo đã import `uploadExcel` từ `excelMiddleware.js` nếu sử dụng và có `importSemestersFromExcelController`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// semesterRoutes.post(
//     '/importExcel',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Sử dụng .single('file') nếu chỉ cho phép một file với tên 'file'
//     importSemestersFromExcelController
// );

/**
 * @route GET /api/semesters/template/download
 * @desc Tải xuống template Excel cho học kỳ.
 * Hiện tại, tuyến đường này không yêu cầu xác thực, hãy cân nhắc có nên bảo vệ nó không.
 * @access Public (hoặc Private nếu bạn muốn hạn chế truy cập template)
 */
semesterRoutes.get(
    '/template/download',
    // authenticateAndAuthorize(["admin", "training_officer"]), // Có thể uncomment nếu muốn bảo vệ template
    downloadTemplateController
);

export default semesterRoutes;