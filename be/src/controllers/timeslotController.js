import { 
    getAllTimeslot,
    getTimeslotById,
    createTimeslot,
    updateTimeslot,
    deleteTimeslot

 } from "../services/timeslotService";
import { APIResponse } from "../utils/APIResponse"; // Sử dụng APIResponse nhất quán

/**
 * @route GET /api/timeslot/
 * @desc Lấy tất cả các khung thời gian có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllTimeslotController = async (req, res) => {
    try {
        const timeslot = await getAllTimeslot();
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
        const timeslot = await getTimeslotById(id);
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
        const timeslot = await createTimeslot(timeslotData);
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
        const timeslot = await updateTimeslot(id, timeslotData);
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
        const deletedCount = await deleteTimeslot(id); // Giả định service trả về số lượng bản ghi bị xóa
        if (deletedCount === 0) {
            return APIResponse(res, 404, null, "Không tìm thấy khung thời gian để xóa.");
        }
        return APIResponse(res, 200, null, "Xóa khung thời gian thành công.");
    } catch (error) {
        console.error(`Lỗi khi xóa khung thời gian với ID ${id}:`, error);
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi xóa khung thời gian.");
    }
};