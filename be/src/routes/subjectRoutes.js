import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js"; // Đảm bảo import .js extension nếu dùng ES Modules
import {
    getAllSubjectsController,
    getSubjectByIdController,
    createSubjectController,
    updateSubjectController,
    deleteSubjectController,
    getSubjectsBySemesterController,
    importSubjectsFromJSONController,
    downloadTemplateController,
    // listSubjectsController, // Thêm controller cho chức năng liệt kê có bộ lọc
    // importSubjectsFromExcelController, // Thêm controller nếu có nhập từ Excel
} from "../controllers/subjectController.js"; // Đảm bảo import .js extension

// Nếu có tính năng import từ Excel, hãy thêm dòng này:
// import { uploadExcel } from '../middleware/excelMiddleware.js';

const subjectRoutes = express.Router();

/**
 * @route GET /api/subjects/getAll
 * @desc Lấy tất cả danh sách môn học.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
subjectRoutes.get(
    "/getAll",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getAllSubjectsController
);

/**
 * @route GET /api/subjects/:id
 * @desc Lấy thông tin chi tiết một môn học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
subjectRoutes.get(
    "/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getSubjectByIdController
);

/**
 * @route POST /api/subjects/create
 * @desc Tạo một môn học mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
subjectRoutes.post(
    "/create",
    authenticateAndAuthorize(["admin", "training_officer"]),
    createSubjectController
);

/**
 * @route PUT /api/subjects/update/:id
 * @desc Cập nhật thông tin môn học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
subjectRoutes.put(
    "/update/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    updateSubjectController
);

/**
 * @route DELETE /api/subjects/delete/:id
 * @desc Xóa một môn học theo ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
subjectRoutes.delete(
    "/delete/:id",
    authenticateAndAuthorize(["admin", "training_officer"]),
    deleteSubjectController
);

/**
 * @route GET /api/subjects/semester/:semesterId
 * @desc Tìm kiếm các môn học theo ID học kỳ.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
subjectRoutes.get(
    "/semester/:semesterId",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getSubjectsBySemesterController
);

/**
 * @route GET /api/subjects/list
 * @desc Liệt kê các môn học với các bộ lọc tùy chọn.
 * Tuyến đường này được thêm vào để hỗ trợ các truy vấn có bộ lọc, phân trang, sắp xếp.
 * Đảm bảo bạn đã định nghĩa `listSubjectsController` trong `subjectController.js`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// cl

/**
 * @route POST /api/subjects/importJson
 * @desc Nhập dữ liệu môn học từ định dạng JSON.
 * Dùng cho tính năng xem trước khi nhập từ Excel từ frontend và gửi dữ liệu đã xử lý về backend dưới dạng JSON.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
subjectRoutes.post(
    "/importJson",
    authenticateAndAuthorize(["admin", "training_officer"]),
    importSubjectsFromJSONController
);

/**
 * @route POST /api/subjects/importExcel
 * @desc Nhập dữ liệu môn học trực tiếp từ file Excel.
 * Tuyến đường này hiện đang được comment; kích hoạt khi cần chức năng nhập trực tiếp từ Excel.
 * Đảm bảo đã import `uploadExcel` từ `excelMiddleware.js` nếu sử dụng và có `importSubjectsFromExcelController`.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
// subjectRoutes.post(
//     '/importExcel',
//     authenticateAndAuthorize(['admin', 'training_officer']),
//     uploadExcel.single('file'), // Sử dụng .single('file') nếu chỉ cho phép một file với tên 'file'
//     importSubjectsFromExcelController
// );

/**
 * @route GET /api/subjects/template/download
 * @desc Tải xuống template Excel mẫu cho môn học.
 * Hiện tại, tuyến đường này không yêu cầu xác thực, hãy cân nhắc có nên bảo vệ nó không.
 * @access Public (hoặc Private nếu bạn muốn hạn chế truy cập template)
 */
subjectRoutes.get(
    "/template/download",
    // authenticateAndAuthorize(["admin", "training_officer"]), // Có thể uncomment nếu muốn bảo vệ template
    downloadTemplateController
);

export default subjectRoutes;