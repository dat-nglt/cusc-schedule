
import model from "../models/index";

const { Room } = model;

export const getAllRooms = async () => {
    try {
        const rooms = await Room.findAll();
        return rooms;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

export const getRoomById = async (id) => {
    try {
        const room = await Room.findByPk(id);
        return room;
    } catch (error) {
        console.error(`Error fetching room with id ${id}:`, error);
        throw error;
    }
};

export const createRoom = async (roomData) => {
    try {
        const room = await Room.create(roomData);
        return room;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};

export const updateRoom = async (id, roomData) => {
    try {
        const room = await Room.findByPk(id);
        if (!room) throw new Error("Room not found");
        return await room.update(roomData);
    } catch (error) {
        console.error (`Error updating room with id ${id}:`, error);
        throw error;
    }
};

export const deleteRoom = async (id) => {
    try {
        const room = await Room.findByPk(id);
        if (!room) throw new Error("Room not found");
        await room.destroy();
        return {message: "Room deleted successfully"};
    } catch (error) {
        console.error(`Error deleting room with id ${id}:`, error);
        throw error;
    }
};

export const importRoomsFromJSON = async (roomsData) => {
    try {
        if (!roomsData || !Array.isArray(roomsData)) {
            throw new Error("DỮ liệu không hợp lệ");
        }

        const results = {
            success: [],
            errors: [],
            total: roomsData.length
        };

        //validate and create room for each item
        for (let i = 0; i < roomsData.length; i++) {
            const roomData = roomsData[i];
            const index = i + 1;

            try {
                //validate required fields
                if (!roomData.room_id) {
                    results.errors.push({
                        index: index,
                        room_id: roomData.room_id || 'N/A',
                        error: 'Mã phòng là bắt buộc'
                    });
                    continue; 
                }

                // clean and format data
                const cleanedData = {
                    room_id: roomData.room_id.toString().trim(),
                    room_name: roomData.room_name ? roomData.room_name.toString().trim() : null,
                    location: roomData.location ? roomData.location.toString().trim(): null,
                    capacity: roomData.capacity ? parseInt(roomData.capacity): null,
                    status: roomData.status ? roomData.status.toString().trim() : 'Hoạt động',
                    type: roomData.type ? roomData.type.toString().trim(): null,
                    note: roomData.note ? roomData.note.toString().trim(): null, 
                }

                // Kiểm tra trang thái phòng
                const allowedStatus = ['Hoạt động', 'Không hoạt động'];
                if (!allowedStatus.includes(cleanedData.status)) {
                    results.errors.push({
                        index: index,
                        room_id: cleanedData.room_id,
                        error: 'Trạng thái không hợp lệ. Chỉ cho phép "Hoạt động" Hoặc "Không hoạt động"'
                    });
                    continue;
                }

                // Validate capacity if provided
                if (cleanedData.capacity !== null && (isNaN(cleanedData.capacity) || cleanedData.capacity < 0)) {
                    results.errors.push({
                        index: index,
                        room_id: cleanedData.room_id,
                        error: 'Sức chứa phải là số nguyên dương'
                    });
                    continue;
                }

                // Kiểm tra room_id đã tồn tại chưa
                const existingRoom = await Room.findOne({
                    where: { room_id: cleanedData.room_id }
                });
                if (existingRoom) {
                    results.errors.push({
                        index: index,
                        room_id: cleanedData.room_id,
                        error: 'Mã phòng đã tồn tại!'
                    });
                    continue;
                }

                // Tạo room mới
                const newRoom = await Room.create(cleanedData);
                results.success.push(newRoom);

            } catch (error) {
                results.errors.push({
                    index: index,
                    room_id: roomData.room_id || 'N/A',
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }
        return results;
    } catch(error) {
        console.error("Error importing rooms from JSON:", error);
        throw error;
    }
};