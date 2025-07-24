import axiosInstance from "./axiosConfig"; 

export const getAllRooms = async () => {
    try {
        const response = await axiosInstance.get('/api/rooms/getAll');
        return response;
    }catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
}

export const getRoomById = async(id) => {
    try {
        const response = await axiosInstance.get(`/api/rooms/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching room with id ${id}:`, error);
        throw error;
    }
}

export const createRoom = async (roomData) => {
    try {
        const response = await axiosInstance.post('/api/rooms/create', roomData);
        return response;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error;
    }
}

export const updateRoom = async (id, roomData) => {
    try {
        const response = await axiosInstance.put(`/api/rooms/update/${id}`, roomData);
        return response;
    }catch (error) {
        console.error(`Error updating room with id ${id}:`, error);
        throw error;
    }
}

export const deleteRoom = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/rooms/delete/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting room with id ${id}:`, error);
        throw error;
    }
}

export const importRoom = async (jsonData) => {
    try {
        const response = await axiosInstance.post('/api/rooms/importJson', {
            rooms: jsonData
        });
        return response;
    } catch (error) {
        console.error('Error importing rooms:', error);
        throw error;
    }
}