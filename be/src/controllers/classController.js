import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    listClasses,
    importClassesFromExcel,
    importClassesFromJson,
    validateExcelTemplate // Đổi tên hàm này để rõ ràng hơn nếu validate cho class template
} from "../services/classService.js";
import { successResponse, errorResponse, APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import path from "path";

/**
 * @route GET /api/classes/
 * @desc Lấy tất cả các lớp học có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllClassesController = async (req, res) => {
    try {
        const classes = await getAllClasses();
        return successResponse(res, classes, "Lấy tất cả lớp học thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy tất cả lớp học:", error);
        return errorResponse(res, error.message || "Lỗi khi lấy tất cả lớp học.", 500);
    }
};

/**
 * @route GET /api/classes/:class_id
 * @desc Lấy thông tin chi tiết một lớp học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.class_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getClassByIdController = async (req, res) => {
    try {
        const { class_id } = req.params;
        const classInstance = await getClassById(class_id);

        if (!classInstance) {
            return errorResponse(res, "Không tìm thấy lớp học.", 404);
        }
        return successResponse(res, classInstance, "Lấy thông tin lớp học thành công.");
    } catch (error) {
        console.error(`Lỗi khi lấy lớp học với ID ${req.params.class_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi lấy lớp học.", 500);
    }
};

/**
 * @route POST /api/classes/add
 * @desc Tạo một lớp học mới. Bao gồm kiểm tra validation cơ bản cho mã và tên lớp.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu lớp học).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createClassController = async (req, res) => {
    try {
        const { class_id, class_name } = req.body;

        // Kiểm tra validation cơ bản
        if (!class_id) {
            return errorResponse(res, "Mã lớp học là bắt buộc.", 400);
        }
        if (class_name && class_name.length > 50) {
            return errorResponse(res, "Tên lớp học không được vượt quá 50 ký tự.", 400);
        }

        const classInstance = await createClass(req.body);
        return successResponse(res, classInstance, "Tạo lớp học thành công.", 201);
    } catch (error) {
        console.error("Lỗi khi tạo lớp học:", error);
        return errorResponse(res, error.message || "Lỗi khi tạo lớp học. Dữ liệu không hợp lệ.", 400);
    }
};

/**
 * @route PUT /api/classes/edit/:class_id
 * @desc Cập nhật thông tin một lớp học bằng ID. Bao gồm kiểm tra validation cho tên lớp.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.class_id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateClassController = async (req, res) => {
    try {
        const { class_name } = req.body;

        // Kiểm tra validation cơ bản
        if (class_name && class_name.length > 50) {
            return errorResponse(res, "Tên lớp học không được vượt quá 50 ký tự.", 400);
        }

        const classInstance = await updateClass(req.params.class_id, req.body);

        if (!classInstance) {
            return errorResponse(res, "Không tìm thấy lớp học để cập nhật.", 404);
        }
        return successResponse(res, classInstance, "Cập nhật lớp học thành công.");
    } catch (error) {
        console.error(`Lỗi khi cập nhật lớp học với ID ${req.params.class_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi cập nhật lớp học. Dữ liệu không hợp lệ.", 400);
    }
};

/**
 * @route DELETE /api/classes/delete/:class_id
 * @desc Xóa một lớp học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.class_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteClassController = async (req, res) => {
    try {
        const { class_id } = req.params;
        const deletedCount = await deleteClass(class_id); // Giả định service trả về số lượng bản ghi bị xóa

        if (deletedCount === 0) {
            return errorResponse(res, "Không tìm thấy lớp học để xóa.", 404);
        }
        return successResponse(res, null, "Xóa lớp học thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa lớp học với ID ${req.params.class_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi xóa lớp học.", 400);
    }
};

/**
 * @route GET /api/classes/list
 * @desc Lấy danh sách các lớp học có áp dụng các bộ lọc từ query parameters.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.query` các bộ lọc).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const listClassesController = async (req, res) => {
    try {
        const { class_id, class_name, status, course_id } = req.query;

        // Xây dựng đối tượng filters
        const filters = {
            ...(class_id && { class_id }),
            ...(class_name && { class_name }),
            ...(status && { status }),
            ...(course_id && { course_id }),
        };

        const classes = await listClasses(filters);

        // Sử dụng APIResponse để trả về nhất quán
        return successResponse(res, classes, "Lấy danh sách lớp học thành công.");
    } catch (error) {
        console.error("Lỗi khi liệt kê lớp học:", error);
        return errorResponse(res, error.message || "Lỗi khi liệt kê lớp học.", 500);
    }
};

/**
 * @route POST /api/classes/import
 * @desc Nhập dữ liệu lớp học từ file Excel được tải lên.
 * Thực hiện validate file, validate template và sau đó import dữ liệu.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.file` từ Multer).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importClassesController = async (req, res) => {
    try {
        if (!req.file) {
            return APIResponse(res, 400, null, "Vui lòng chọn file Excel để import.");
        }

        const fileBuffer = req.file.buffer;

        // Validate đuôi file
        const allowedExtensions = ['.xlsx', '.xls'];
        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return APIResponse(res, 400, null, "Chỉ chấp nhận file Excel (.xlsx, .xls).");
        }

        // Validate cấu trúc template Excel
        // Đảm bảo `validateExcelTemplate` trong classService.js kiểm tra đúng cấu trúc cho Class
        const templateValidation = validateExcelTemplate(fileBuffer);
        if (!templateValidation.valid) {
            return APIResponse(res, 400, null, templateValidation.error || "Cấu trúc template không hợp lệ. Vui lòng sử dụng template mẫu.");
        }

        // Tiến hành import dữ liệu từ Excel
        const results = await importClassesFromExcel(fileBuffer);

        const responseData = {
            summary: {
                total: results.total,
                success: results.success.length,
                errors: results.errors.length,
            },
            successRecords: results.success, // Các bản ghi được import thành công
            errorRecords: results.errors, // Các bản ghi lỗi cùng với lý do
        };

        if (results.errors.length > 0) {
            // Trả về mã 207 Multi-Status nếu có cả thành công và lỗi
            return APIResponse(res, 207, responseData, `Import hoàn tất với ${results.success.length}/${results.total} bản ghi thành công.`);
        } else {
            // Trả về mã 200 OK nếu tất cả đều thành công
            return APIResponse(res, 200, responseData, `Import thành công ${results.success.length} lớp học.`);
        }
    } catch (error) {
        console.error("Lỗi khi import lớp học từ file Excel:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import file Excel.");
    }
};

/**
 * @route GET /api/classes/template/download
 * @desc Tải xuống template Excel mẫu cho lớp học.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createClassTemplate.
        const buffer = ExcelUtils.createClassTemplate();

        // Thiết lập các headers để trình duyệt tải xuống file
        res.setHeader('Content-Disposition', 'attachment; filename=lop_hoc_mau.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);
    } catch (error) {
        console.error("Lỗi khi tạo và tải xuống template lớp học:", error);
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};

/**
 * @route POST /api/classes/importJson
 * @desc Nhập dữ liệu lớp học từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.classes` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importClassesFromJsonController = async (req, res) => {
    try {
        const { classes } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!classes || !Array.isArray(classes)) {
            return APIResponse(res, 400, null, "Dữ liệu lớp học không hợp lệ. Yêu cầu một mảng JSON.");
        }

        if (classes.length === 0) {
            return APIResponse(res, 400, null, "Không có dữ liệu lớp học nào được cung cấp để import.");
        }

        // Tiến hành import dữ liệu từ JSON
        const results = await importClassesFromJson(classes);

        const responseData = {
            success: true, // Chỉ ra rằng request được xử lý
            imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
            errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
            message: `Import thành công ${results.success.length} lớp học.`,
        };

        if (results.errors.length > 0) {
            // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status
            responseData.message = `Import hoàn tất với ${results.success.length}/${classes.length} bản ghi thành công.`;
            return APIResponse(res, 207, responseData, responseData.message);
        } else {
            // Nếu không có lỗi, trả về 200 OK
            return APIResponse(res, 200, responseData, responseData.message);
        }
    } catch (error) {
        console.error("Lỗi khi import lớp học từ dữ liệu JSON:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu.");
    }
};