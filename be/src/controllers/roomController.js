import {
    getAllRoomService,
    getRoomByIdService,
    createRoomService,
    updateRoomService,
    deleteRoomService,
    importRoomsFromJsonService
} from "../services/roomService.js";
import { APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";

export const getAllRoomsController = async (req, res) => {
    try {
        const rooms = await getAllRoomService();
        return APIResponse(res, 200, rooms, "Rooms fetched successfully");
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return APIResponse(res, 500, error.message || "Error fetching rooms");
    }
}

export const getRoomByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await getRoomByIdService(id);
        if (!room) {
            return APIResponse(res, 404, null, "Room not found");
        }
        return APIResponse(res, 200, room, "Room fetched successfully");
    } catch (error) {
        console.error(`Error fetching room with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error fetching room");
    }
}

export const createRoomController = async (req, res) => {
    const roomData = req.body;
    try {
        const room = await createRoomService(roomData);
        return APIResponse(res, 201, room, "Room created successfully");
    } catch (error) {
        console.error("Error creating room:", error);
        return APIResponse(res, 500, error.message || "Error creating room");
    }
}

export const updateRoomController = async (req, res) => {
    const { id } = req.params;
    const roomData = req.body;
    try {
        const room = await updateRoomService(id, roomData);
        if (!room) {
            return APIResponse(res, 404, null, "Room not found");
        }
        return APIResponse(res, 200, room, "Room updated successfully");
    } catch (error) {
        console.error(`Error updating room with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error updating room");
    }
}

export const deleteRoomController = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deleteRoomService(id);
        return APIResponse(res, 200, response, "Room deleted successfully");
    } catch (error) {
        console.error(`Error deleting room with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error deleting room");
    }
}

export const importRoomsFromJSONController = async (req, res) => {
    const { rooms } = req.body;
    try {
        if (!rooms || !Array.isArray(rooms)) {
            return APIResponse(res, 400, null, "Invalid data format");
        }
        if (rooms.length === 0) {
            return APIResponse(res, 400, null, "No rooms to import");
        }

        const results = await importRoomsFromJsonService(rooms);

        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} phòng`
        };

        if (results.errors.length > 0) {
            response.message = `Thêm hoàn tất với ${results.success.length}/${rooms.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        } else {
            return APIResponse(res, 200, response, response.message);
        }
    } catch (error) {
        console.error("Error importing room from JSON:", error);
        return APIResponse(res, 500, null, "Lỗi khi thêm dữ liệu");
    }
};

/**
 * @route GET /api/rooms/template/download
 * @desc Tải xuống template Excel mẫu để nhập dữ liệu phòng học.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo buffer chứa template Excel. Đảm bảo ExcelUtils có hàm createRoomTemplate.
        const buffer = ExcelUtils.createRoomTemplate();

        // Thiết lập các headers để trình duyệt tải xuống file
        res.setHeader('Content-Disposition', 'attachment; filename=phong_hoc_mau.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length); // Đặt Content-Length

        // Gửi buffer làm phản hồi
        return res.send(buffer);

    } catch (error) {
        console.error("Lỗi khi tạo và tải xuống template phòng học:", error);
        return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
    }
};