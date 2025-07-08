import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js"; // Đảm bảo import .js extension nếu dùng ES Modules
import {
    getAllProgramsController,
    getProgramByIdController,
    createProgramController,
    updateProgramController,
    deleteProgramController,
    importProgramsFromJSONController,
    downloadTemplateController,
    listProgramsController, // Thêm controller cho chức năng liệt kê có bộ lọc
    importProgramsFromExcelController, // Thêm controller nếu có nhập từ Excel
} from "../controllers/programController.js"; // Đảm bảo import .js extension

// Nếu có tính năng import từ Excel, hãy thêm dòng này:
// import { uploadExcel } from '../middleware/excelMiddleware.js';

const programRoutes = express.Router();

/**
 * @route GET /api/programs/getAll
 * @desc Lấy tất cả các chương trình đào tạo.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
programRoutes.get(
    "/getAll",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getAllProgramsController
);

/**
 * @route GET /api/programs/:id
 * @desc Lấy thông tin chi tiết một chương trình đào tạo theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
programRoutes.get(
    "/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getProgramByIdController
);

/**
 * @route POST /api/programs/create
 * @desc Tạo một chương trình đào tạo mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
programRoutes.post(
    "/create",
    authenticateAndAuthorize(["admin", "training_officer"]),
    createProgramController
);

/**
 * @route PUT /api/programs/update/:id
 * @desc Cập nhật thông tin chương trình đào tạo theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
programRoutes.put(
    "/update/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    updateProgramController
);

/**
 * @route DELETE /api/programs/delete/:id
 * @desc Xóa một chương trình đào tạo theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
programRoutes.delete(
    "/delete/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    deleteProgramController
);

/**
 * @route GET /api/programs/list
 * @desc Liệt kê các chương trình đào tạo với các bộ lọc tùy chọn.
 * Tuyến đường này được thêm vào để hỗ trợ các truy vấn có bộ lọc, phân trang, sắp xếp.
 * Đảm bảo bạn đã định nghĩa `listProgramsController` trong `programController.js`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// programRoutes.get(
//     "/list", // Đặt tên rõ ràng để tránh xung đột với GET /:id
//     authenticateAndAuthorize(["admin", "training_officer"]),
//     listProgramsController
// );

/**
 * @route POST /api/programs/importJson
 * @desc Nhập dữ liệu chương trình đào tạo từ định dạng JSON (dùng cho tính năng xem trước hoặc API nội bộ).
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
programRoutes.post(
    "/importJson",
    authenticateAndAuthorize(["admin", "training_officer"]),
    importProgramsFromJSONController
);

/**
 * @route POST /api/programs/importExcel
 * @desc Nhập dữ liệu chương trình đào tạo từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập từ Excel.
 * Đảm bảo đã import `uploadExcel` từ `excelMiddleware.js` nếu sử dụng và có `importProgramsFromExcelController`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// programRoutes.post(
//     '/importExcel',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Sử dụng .single('file') nếu chỉ cho phép một file với tên 'file'
//     importProgramsFromExcelController
// );

/**
 * @route GET /api/programs/template/download
 * @desc Tải xuống template Excel cho chương trình đào tạo.
 * Hiện tại, tuyến đường này không yêu cầu xác thực, hãy cân nhắc có nên bảo vệ nó không.
 * @access Public (hoặc Private nếu bạn muốn hạn chế truy cập template)
 */
programRoutes.get(
    "/template/download",
    // authenticateAndAuthorize(["admin", "training_officer"]), // Có thể uncomment nếu muốn bảo vệ template
    downloadTemplateController
);

export default programRoutes;