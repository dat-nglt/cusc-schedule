import {
    getAllTimeslotService,
    getTimeslotByIdService,
    createTimeslotService,
    updateTimeslotService,
    deleteTimeslotService,
    importTimeslotsFromJsonService

} from "../services/timeslotService.js";
import { APIResponse } from "../utils/APIResponse.js"; // Sử dụng APIResponse nhất quán
import ExcelUtils from "../utils/ExcelUtils.js";

/**
 * @route GET /api/timeslot/
 * @desc Lấy tất cả các khung thời gian có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllTimeslotController = async (req, res) => {
    try {
        const timeslot = await getAllTimeslotService();
        return APIResponse(res, 200, timeslot, "Lấy danh sách khung thời gian thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khung thời gian:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy danh sách khung thời gian.");
    }
};

/**
 * @route GET /api/timeslot/:id
 * @desc Lấy thông tin chi tiết của một khung thời gian bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getTimeslotByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const timeslot = await getTimeslotByIdService(id);
        if (!timeslot) {
            return APIResponse(res, 404, null, "Không tìm thấy khung thời gian.");
        }
        return APIResponse(res, 200, timeslot, "Lấy thông tin khung thời gian thành công.");
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin khung thời gian với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy thông tin khung thời gian.");
    }
};

/**
 * @route POST /api/programs/add
 * @desc Tạo một khung thời gian.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu chương trình).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createTimeslotController = async (req, res) => {
    const timeslotData = req.body;
    try {
        const timeslot = await createTimeslotService(timeslotData);
        return APIResponse(res, 201, timeslot, "Tạo khung thời gian thành công.");
    } catch (error) {
        console.error("Lỗi khi tạo khung thời gian:", error);
        // Có thể thêm logic kiểm tra lỗi cụ thể hơn từ service (ví dụ: duplicate entry)
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi tạo khung thời gian.");
    }
};

/**
 * @route PUT /api/timeslot/edit/:id
 * @desc Cập nhật thông tin một khung thời gian bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateTimeslotController = async (req, res) => {
    const { id } = req.params;
    const timeslotData = req.body;
    try {
        const timeslot = await updateTimeslotService(id, timeslotData);
        if (!timeslot) {
            return APIResponse(res, 404, null, "Không tìm thấy khung thời gian để cập nhật.");
        }
        return APIResponse(res, 200, timeslot, "Cập nhật thông tin khung thời gian thành công.");
    } catch (error) {
        console.error(`Lỗi khi cập nhật khung thời gian với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi cập nhật thông tin khung thời gian.");
    }
};

/**
 * @route DELETE /api/timeslot/delete/:id
 * @desc Xóa một khung thời gian bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteTimeslotController = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCount = await deleteTimeslotService(id); // Giả định service trả về số lượng bản ghi bị xóa
        if (deletedCount === 0) {
            return APIResponse(res, 404, null, "Không tìm thấy khung thời gian để xóa.");
        }
        return APIResponse(res, 200, null, "Xóa khung thời gian thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa khung thời gian với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi xóa khung thời gian.");
    }
};

/**
 * @route POST /api/timeslot/importJson
 * @desc Nhập dữ liệu khung thời gian từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.timeslots` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importTimeslotFromJSONController = async (req, res) => {
    const { timeslots } = req.body;
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!timeslots || !Array.isArray(timeslots)) {
            return APIResponse(res, 400, null, "Dữ liệu khung thời gian không hợp lệ. Yêu cầu một mảng JSON.");
        }

        if (timeslots.length === 0) {
            return APIResponse(res, 400, null, "Không có khung thời gian nào được cung cấp để import.");
        }

        // Tiến hành import dữ liệu từ JSON
        const results = await importTimeslotsFromJsonService(timeslots);

        const responseData = {
            success: true, // Chỉ ra rằng request được xử lý
            imported: results.success, // Các bản ghi đã được import thành công (đối tượng)
            errors: results.errors, // Các bản ghi lỗi cùng với lý do (đối tượng)
            message: `Đã thêm thành công ${results.success.length} khung thời gian.`
        };

        if (results.errors.length > 0) {
            // Nếu có lỗi, cập nhật thông báo và trả về 207 Multi-Status (để báo hiệu một phần thành công)
            responseData.message = `Thêm hoàn tất với ${results.success.length}/${timeslots.length} bản ghi thành công.`;
            return APIResponse(res, 207, responseData, responseData.message);
        } else {
            // Nếu không có lỗi, trả về 200 OK
            return APIResponse(res, 200, responseData, responseData.message);
        }
    } catch (error) {
        console.error("Lỗi khi import khung thời gian từ dữ liệu JSON:", error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu.");
    }
};

/**
 * @route GET /api/timeslot/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu khung thời gian.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createTimeslotTemplate.
        const buffer = ExcelUtils.createTimeslotTemplate();

        // Thiết lập các headers để trình duyệt tải xuống file
        res.setHeader('Content-Disposition', 'attachment; filename=khung_thoi_gian_mau.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);

    } catch (error) {
        console.error("Lỗi khi tạo và tải xuống template khung thời gian:", error);
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};

