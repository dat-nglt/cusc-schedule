import {
    getAllBusySlotsService,
    getBusySlotByIdService,
    createBusySlotService,
    updateBusySlotService,
    deleteBusySlotService,
    importBusySlotsFromJSONService,
} from "../services/busyslotService.js";
import { APIResponse } from "../utils/APIResponse.js";

/**
 * @route GET /api/busyslots/
 * @desc Lấy tất cả các khe thời gian bận có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllBusySlotsController = async (req, res) => {
    try {
        const busySlots = await getAllBusySlotsService();
        return APIResponse(
            res,
            200,
            busySlots,
            "Lấy danh sách khe thời gian bận thành công."
        );
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khe thời gian bận:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi lấy danh sách khe thời gian bận."
        );
    }
};

/**
 * @route GET /api/busyslots/:id
 * @desc Lấy thông tin chi tiết của một khe thời gian bận bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getBusySlotByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const busySlot = await getBusySlotByIdService(id);
        if (!busySlot) {
            return APIResponse(
                res,
                404,
                null,
                "Không tìm thấy khe thời gian bận."
            );
        }
        return APIResponse(
            res,
            200,
            busySlot,
            "Lấy thông tin khe thời gian bận thành công."
        );
    } catch (error) {
        console.error(
            `Lỗi khi lấy thông tin khe thời gian bận với ID ${id}:`,
            error
        );
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi lấy thông tin khe thời gian bận."
        );
    }
};

/**
 * @route POST /api/busyslots/add
 * @desc Tạo một khe thời gian bận mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu khe thời gian bận).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createBusySlotController = async (req, res) => {
    const busySlotData = req.body;
    try {
        const busySlot = await createBusySlotService(busySlotData);
        return APIResponse(
            res,
            201,
            busySlot,
            "Tạo khe thời gian bận thành công."
        );
    } catch (error) {
        console.error("Lỗi khi tạo khe thời gian bận:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi tạo khe thời gian bận."
        );
    }
};

/**
 * @route PUT /api/busyslots/edit/:id
 * @desc Cập nhật thông tin một khe thời gian bận bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateBusySlotController = async (req, res) => {
    const { id } = req.params;
    const busySlotData = req.body;
    try {
        const busySlot = await updateBusySlotService(id, busySlotData);
        if (!busySlot) {
            return APIResponse(
                res,
                404,
                null,
                "Không tìm thấy khe thời gian bận để cập nhật."
            );
        }
        return APIResponse(
            res,
            200,
            busySlot,
            "Cập nhật thông tin khe thời gian bận thành công."
        );
    } catch (error) {
        console.error(`Lỗi khi cập nhật khe thời gian bận với ID ${id}:`, error);
        return APIResponse(
            res,
            500,
            null,
            error.message ||
            "Đã xảy ra lỗi khi cập nhật thông tin khe thời gian bận."
        );
    }
};

/**
 * @route DELETE /api/busyslots/delete/:id
 * @desc Xóa một khe thời gian bận bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const deleteBusySlotController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteBusySlotService(id);
        return APIResponse(res, 200, null, "Xóa khe thời gian bận thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa khe thời gian bận với ID ${id}:`, error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi xóa khe thời gian bận."
        );
    }
};

/**
 * @route POST /api/busyslots/importJson
 * @desc Nhập dữ liệu khe thời gian bận từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.busySlots` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importBusySlotsFromJSONController = async (req, res) => {
    const { busySlots } = req.body;
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!busySlots || !Array.isArray(busySlots)) {
            return APIResponse(
                res,
                400,
                null,
                "Dữ liệu khe thời gian bận không hợp lệ. Yêu cầu một mảng JSON."
            );
        }

        if (busySlots.length === 0) {
            return APIResponse(
                res,
                400,
                null,
                "Không có dữ liệu khe thời gian bận nào được cung cấp để import."
            );
        }

        // Tiến hành import dữ liệu từ JSON
        const results = await importBusySlotsFromJSONService(busySlots);

        const responseData = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} khe thời gian bận.`,
        };

        if (results.errors.length > 0) {
            responseData.message = `Thêm hoàn tất với ${results.success.length}/${busySlots.length} bản ghi thành công.`;
            return APIResponse(res, 207, responseData, responseData.message);
        } else {
            return APIResponse(res, 200, responseData, responseData.message);
        }
    } catch (error) {
        console.error(
            "Lỗi khi import khe thời gian bận từ dữ liệu JSON:",
            error
        );
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi thêm dữ liệu."
        );
    }
};
/**
 * @route GET /api/programs/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu chương trình đào tạo.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createProgramTemplate.
        const buffer = ExcelUtils.createProgramTemplate();

        // Thiết lập các headers để trình duyệt tải xuống file
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=chuong_trinh_dao_tao_mau.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Length", buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);
    } catch (error) {
        console.error(
            "Lỗi khi tạo và tải xuống template chương trình đào tạo:",
            error
        );
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};
