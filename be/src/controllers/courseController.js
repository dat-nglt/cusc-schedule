import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    listCourses,
    importCoursesFromExcel,
    importCoursesFromJson,
    validateExcelTemplate // Đảm bảo hàm này được định nghĩa đúng cho Course template
} from "../services/courseService.js";
import { successResponse, errorResponse, APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import path from 'path';

/**
 * @route GET /api/courses/getAll
 * @desc Lấy tất cả các khóa học có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllCoursesController = async (req, res) => {
    try {
        const courses = await getAllCourses();
        return successResponse(res, courses, "Lấy tất cả khóa học thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy tất cả khóa học:", error);
        return errorResponse(res, error.message || "Lỗi khi lấy tất cả khóa học.", 500);
    }
};

/**
 * @route GET /api/courses/:course_id
 * @desc Lấy thông tin chi tiết một khóa học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.course_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getCourseByIdController = async (req, res) => {
    try {
        const { course_id } = req.params;
        const course = await getCourseById(course_id);

        if (!course) {
            return errorResponse(res, "Không tìm thấy khóa học.", 404);
        }
        return successResponse(res, course, "Lấy thông tin khóa học thành công.");
    } catch (error) {
        console.error(`Lỗi khi lấy khóa học với ID ${req.params.course_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi lấy khóa học.", 500);
    }
};

/**
 * @route POST /api/courses/add
 * @desc Tạo một khóa học mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu khóa học).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createCourseController = async (req, res) => {
    try {
        const course = await createCourse(req.body);
        return successResponse(res, course, "Tạo khóa học thành công.", 201);
    } catch (error) {
        console.error("Lỗi khi tạo khóa học:", error);
        // Lỗi 400 Bad Request thường phù hợp cho lỗi validation hoặc dữ liệu không hợp lệ.
        return errorResponse(res, error.message || "Lỗi khi tạo khóa học. Dữ liệu không hợp lệ.", 400);
    }
};

/**
 * @route PUT /api/courses/edit/:course_id
 * @desc Cập nhật thông tin một khóa học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.course_id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateCourseController = async (req, res) => {
    try {
        const { course_id } = req.params;
        const course = await updateCourse(course_id, req.body);

        if (!course) {
            return errorResponse(res, "Không tìm thấy khóa học để cập nhật.", 404);
        }
        return successResponse(res, course, "Cập nhật khóa học thành công.");
    } catch (error) {
        console.error(`Lỗi khi cập nhật khóa học với ID ${req.params.course_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi cập nhật khóa học. Dữ liệu không hợp lệ.", 400);
    }
};

/**
 * @route DELETE /api/courses/delete/:course_id
 * @desc Xóa một khóa học bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.course_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteCourseController = async (req, res) => {
    try {
        const { course_id } = req.params;
        const deletedCount = await deleteCourse(course_id); // Giả định service trả về số lượng bản ghi bị xóa

        if (deletedCount === 0) {
            return errorResponse(res, "Không tìm thấy khóa học để xóa.", 404);
        }
        return successResponse(res, null, "Xóa khóa học thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa khóa học với ID ${req.params.course_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi xóa khóa học.", 400);
    }
};

/**
 * @route GET /api/courses/list
 * @desc Lấy danh sách các khóa học có áp dụng các bộ lọc từ query parameters.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.query` các bộ lọc).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const listCoursesController = async (req, res) => {
    try {
        // Lấy các tham số lọc từ query string
        const { course_id, course_name, start_date } = req.query;

        // Xây dựng đối tượng filters
        const filters = {
            ...(course_id && { course_id }), // Thêm course_id nếu nó tồn tại
            ...(course_name && { course_name }),
            ...(start_date && { start_date }),
        };

        const courses = await listCourses(filters);

        // Sử dụng APIResponse để trả về nhất quán
        return successResponse(res, courses, "Lấy danh sách khóa học thành công.");
    } catch (error) {
        console.error("Lỗi khi liệt kê khóa học:", error);
        return errorResponse(res, error.message || "Lỗi khi liệt kê khóa học.", 500);
    }
};

/**
 * @route POST /api/courses/import
 * @desc Nhập dữ liệu khóa học từ file Excel được tải lên.
 * Thực hiện validate file, validate template và sau đó import dữ liệu.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.file` từ Multer).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importCoursesController = async (req, res) => {
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
        // Đảm bảo `validateExcelTemplate` trong courseService.js kiểm tra đúng cấu trúc cho Course
        const templateValidation = validateExcelTemplate(fileBuffer);
        if (!templateValidation.valid) {
            return APIResponse(res, 400, null, templateValidation.error || "Cấu trúc template không hợp lệ. Vui lòng sử dụng template mẫu.");
        }

        // Tiến hành import dữ liệu từ Excel
        const results = await importCoursesFromExcel(fileBuffer);

        const responseData = {
            summary: {
                total: results.total,
                success: results.success.length,
                errors: results.errors.length
            },
            successRecords: results.success, // Các bản ghi được import thành công
            errorRecords: results.errors // Các bản ghi lỗi cùng với lý do
        };

        if (results.errors.length > 0) {
            // Trả về mã 207 Multi-Status nếu có cả thành công và lỗi
            return APIResponse(res, 207, responseData, `Import hoàn tất với ${results.success.length}/${results.total} bản ghi thành công.`);
        } else {
            // Trả về mã 200 OK nếu tất cả đều thành công
            return APIResponse(res, 200, responseData, `Import thành công ${results.success.length} khóa học.`);
        }

    } catch (error) {
        console.error("Lỗi khi import khóa học từ file Excel:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import file Excel.");
    }
};

/**
 * @route GET /api/courses/template/download
 * @desc Tải xuống template Excel mẫu cho khóa học.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createCourseTemplate.
        const buffer = ExcelUtils.createCourseTemplate();

        // Thiết lập các headers để trình duyệt tải xuống file
        res.setHeader('Content-Disposition', 'attachment; filename=khoa_hoc_mau.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);

    } catch (error) {
        console.error("Lỗi khi tạo và tải xuống template khóa học:", error);
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};

/**
 * @route POST /api/courses/importJson
 * @desc Nhập dữ liệu khóa học từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.courses` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importCoursesFromJsonController = async (req, res) => {
    try {
        const { courses } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!courses || !Array.isArray(courses)) {
            return APIResponse(res, 400, null, "Dữ liệu khóa học không hợp lệ. Yêu cầu một mảng JSON.");
        }

        if (courses.length === 0) {
            return APIResponse(res, 400, null, "Không có dữ liệu khóa học nào được cung cấp để import.");
        }

        // Tiến hành import dữ liệu từ JSON
        const results = await importCoursesFromJson(courses);

        const responseData = {
            success: true, // Chỉ ra rằng request được xử lý
            imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
            errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
            message: `Import thành công ${results.success.length} khóa học.`
        };

        if (results.errors.length > 0) {
            // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status
            responseData.message = `Import hoàn tất với ${results.success.length}/${courses.length} bản ghi thành công.`;
            return APIResponse(res, 207, responseData, responseData.message);
        } else {
            // Nếu không có lỗi, trả về 200 OK
            return APIResponse(res, 200, responseData, responseData.message);
        }

    } catch (error) {
        console.error("Lỗi khi import khóa học từ dữ liệu JSON:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu.");
    }
};