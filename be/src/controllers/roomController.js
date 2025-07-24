import { error } from "winston";
import {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    importRoomsFromJSON
} from "../services/roomService";
import { APIResponse } from "../utils/APIResponse";
import ExcelUtils from "../utils/ExcelUtils";

export const getAllRoomsController = async (req, res) => {
    try {
        const rooms = await getAllRooms();
        return APIResponse(res, 200, rooms, "Rooms fetched successfully");
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return APIResponse(res, 500, error.message || "Error fetching rooms");
    }
}

export const getRoomByIdController = async (req, res) => {
    const {id} = req.params;
    try {
        const room = await getRoomById(id);
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
        const room = await createRoom(roomData);
        return APIResponse(res, 201, room, "Room created successfully");
    } catch (error) {
        console.error("Error creating room:", error);
        return APIResponse(res, 500, error.message || "Error creating room");
    }
}

export const updateRoomController = async (req, res) => {
    const {id} = req.params;
    const roomData = req.body;
    try {
        const room = await updateRoom(id, roomData); 
        if (!room) {
            return APIResponse(res, 404, null, "Room not found");
        }
        return APIResponse(res, 200, room, "Room updated successfully");
    }catch (error) {
        console.error(`Error updating room with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error updating room");
    }
}

export const deleteRoomController = async (req, res) => {
    const {id} = req.params;
    try {
        const response = await deleteRoom(id);
        return APIResponse(res, 200, response, "Room deleted successfully");
    } catch (error) {
        console.error(`Error deleting room with id ${id}:`, error);
        return APIResponse (res, 500, error.message || "Error deleting room");
    }
}

export const importRoomsFromJSONController = async (req, res) => {
    const { rooms } = req.body;
    try {
        if (!rooms || !Array.isArray(rooms)) {
            return APIResponse(res, 400, null, "Invalid data format");
        }
        if (rooms.length ===0) {
            return APIResponse(res, 400, null, "No rooms to import");
        }

        const results = await importRoomsFromJSON(rooms);

        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} phòng`
        };

        if (results.errors.length > 0) {
            response.message = `Thêm hoàn tất với ${results.success.length}/${rooms.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        }else {
            return APIResponse(res, 200, response, response.message);
        }
    } catch (error) {
        console.error("Error importing room from JSON:", error);
        return APIResponse(res, 500, null, "Lỗi khi thêm dữ liệu");
    }
};