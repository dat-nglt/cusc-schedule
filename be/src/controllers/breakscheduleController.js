import {
    getAllBreakSchedules,
    getBreakScheduleById,
    createBreakSchedule,
    updateBreakSchedule,
    deleteBreakSchedule,
    listBreakSchedules,
    importBreakSchedulesFromExcel,
    importBreakSchedulesFromJson,
    validateBreakScheduleExcelTemplate,
} from "../services/breakscheduleService.js";
import { successResponse, errorResponse, APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import path from "path";

/**
 * @route GET /api/breakschedules/
 * @desc Lấy tất cả các lịch nghỉ có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllBreakSchedulesController = async (req, res) => {
    try {
        const breakSchedules = await getAllBreakSchedules();
        return successResponse(res, breakSchedules, "Lấy tất cả lịch nghỉ thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy tất cả lịch nghỉ:", error);
        return errorResponse(res, error.message || "Lỗi khi lấy tất cả lịch nghỉ.", 500);
    }
};

/**
 * @route GET /api/breakschedules/:break_id
 * @desc Lấy thông tin chi tiết một lịch nghỉ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.break_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getBreakScheduleByIdController = async (req, res) => {
    try {
        const { break_id } = req.params;
        const breakSchedule = await getBreakScheduleById(break_id);

        if (!breakSchedule) {
            return errorResponse(res, "Không tìm thấy lịch nghỉ.", 404);
        }
        return successResponse(res, breakSchedule, "Lấy thông tin lịch nghỉ thành công.");
    } catch (error) {
        console.error(`Lỗi khi lấy lịch nghỉ với ID ${req.params.break_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi lấy lịch nghỉ.", 500);
    }
};

/**
 * @route POST /api/breakschedules/add
 * @desc Tạo một lịch nghỉ mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu lịch nghỉ).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createBreakScheduleController = async (req, res) => {
    try {
        const breakSchedule = await createBreakSchedule(req.body);
        return successResponse(res, breakSchedule, "Tạo lịch nghỉ thành công.", 201);
    } catch (error) {
        console.error("Lỗi khi tạo lịch nghỉ:", error);
        // Lỗi 400 Bad Request thường phù hợp cho lỗi validation hoặc dữ liệu không hợp lệ.
        return errorResponse(res, error.message || "Lỗi khi tạo lịch nghỉ. Dữ liệu không hợp lệ.", 400);
    }
};

/**
 * @route PUT /api/breakschedules/edit/:break_id
 * @desc Cập nhật thông tin một lịch nghỉ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.break_id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateBreakScheduleController = async (req, res) => {
    try {
        const { break_id } = req.params;
        const breakSchedule = await updateBreakSchedule(break_id, req.body);

        if (!breakSchedule) {
            return errorResponse(res, "Không tìm thấy lịch nghỉ để cập nhật.", 404);
        }
        return successResponse(res, breakSchedule, "Cập nhật lịch nghỉ thành công.");
    } catch (error) {
        console.error(`Lỗi khi cập nhật lịch nghỉ với ID ${req.params.break_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi cập nhật lịch nghỉ. Dữ liệu không hợp lệ.", 400);
    }
};

/**
 * @route DELETE /api/breakschedules/delete/:break_id
 * @desc Xóa một lịch nghỉ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.break_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteBreakScheduleController = async (req, res) => {
    try {
        const { break_id } = req.params;
        const deletedCount = await deleteBreakSchedule(break_id);

        if (deletedCount === 0) { // Giả định service trả về số lượng bản ghi bị xóa
            return errorResponse(res, "Không tìm thấy lịch nghỉ để xóa.", 404);
        }
        return successResponse(res, null, "Xóa lịch nghỉ thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa lịch nghỉ với ID ${req.params.break_id}:`, error);
        return errorResponse(res, error.message || "Lỗi khi xóa lịch nghỉ.", 400);
    }
};

/**
 * @route GET /api/breakschedules/list
 * @desc Lấy danh sách các lịch nghỉ có áp dụng các bộ lọc từ query parameters.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.query` các bộ lọc).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const listBreakSchedulesController = async (req, res) => {
    try {
        // Lấy các tham số lọc từ query string
        const { break_id, break_type, break_start_date } = req.query;

        // Xây dựng đối tượng filters
        const filters = {
            ...(break_id && { break_id }), // Thêm break_id nếu nó tồn tại
            ...(break_type && { break_type }),
            ...(break_start_date && { break_start_date }),
        };

        const breakSchedules = await listBreakSchedules(filters);

        // Sử dụng APIResponse để trả về nhất quán
        return successResponse(res, breakSchedules, "Lấy danh sách lịch nghỉ thành công.");
    } catch (error) {
        console.error("Lỗi khi liệt kê lịch nghỉ:", error);
        return errorResponse(res, error.message || "Lỗi khi liệt kê lịch nghỉ.", 500);
    }
};

/**
 * @route POST /api/breakschedules/import
 * @desc Nhập dữ liệu lịch nghỉ từ file Excel được tải lên.
 * Thực hiện validate file, validate template và sau đó import dữ liệu.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.file` từ Multer).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importBreakSchedulesController = async (req, res) => {
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
        const templateValidation = validateBreakScheduleExcelTemplate(fileBuffer);
        if (!templateValidation.valid) {
            return APIResponse(res, 400, null, templateValidation.error || "Cấu trúc template Excel không hợp lệ. Vui lòng sử dụng template mẫu.");
        }

        // Tiến hành import dữ liệu từ Excel
        const results = await importBreakSchedulesFromExcel(fileBuffer);

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
            return APIResponse(res, 200, responseData, `Import thành công ${results.success.length} lịch nghỉ.`);
        }

    } catch (error) {
        console.error("Lỗi khi import lịch nghỉ từ file Excel:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import file Excel.");
    }
};

/**
 * @route GET /api/breakschedules/template/download
 * @desc Tải xuống template Excel mẫu cho lịch nghỉ.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadBreakScheduleTemplateController = async (req, res) => {
    try {
        // Tạo buffer chứa template Excel
        const buffer = ExcelUtils.createBreakScheduleTemplate();

        // Thiết lập các headers để trình duyệt tải xuống file
        res.setHeader('Content-Disposition', 'attachment; filename=lich_nghi_mau.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);

    } catch (error) {
        console.error("Lỗi khi tạo và tải xuống template lịch nghỉ:", error);
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};

/**
 * @route POST /api/breakschedules/importJson
 * @desc Nhập dữ liệu lịch nghỉ từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.breakSchedules` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importBreakSchedulesFromJsonController = async (req, res) => {
    try {
        const { breakSchedules } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!breakSchedules || !Array.isArray(breakSchedules)) {
            return APIResponse(res, 400, null, "Dữ liệu lịch nghỉ không hợp lệ. Yêu cầu một mảng JSON.");
        }

        if (breakSchedules.length === 0) {
            return APIResponse(res, 400, null, "Không có dữ liệu lịch nghỉ nào được cung cấp để import.");
        }

        // Tiến hành import dữ liệu từ JSON
        const results = await importBreakSchedulesFromJson(breakSchedules);

        const responseData = {
            success: true, // Chỉ ra rằng request được xử lý
            imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
            errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
            message: `Import thành công ${results.success.length} lịch nghỉ.`
        };

        if (results.errors.length > 0) {
            // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status
            responseData.message = `Import hoàn tất với ${results.success.length}/${breakSchedules.length} bản ghi thành công.`;
            return APIResponse(res, 207, responseData, responseData.message);
        } else {
            // Nếu không có lỗi, trả về 200 OK
            return APIResponse(res, 200, responseData, responseData.message);
        }

    } catch (error) {
        console.error("Lỗi khi import lịch nghỉ từ dữ liệu JSON:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu.");
    }
};