import axiosInstance from "./axiosConfig";

export const getAllTimeslotAPI = async () => {
    try {
        const response = await axiosInstance.get("/api/timeslots/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching timeslots:", error);
        throw error;
    }
};

export const getTimeslotByIdAPI = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/timeslots/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching timeslot with ID ${id}:`, error);
        throw error;
    }
};

export const createTimeslotAPI = async (timeslotData) => {
    try {
        const response = await axiosInstance.post("/api/timeslots/create", timeslotData);
        return response;
    } catch (error) {
        console.error("Error creating timeslot:", error);
        throw error;
    }
};

export const updateTimeslotAPI = async (id, timeslotData) => {
    try {
        const response = await axiosInstance.put(`/api/timeslots/update/${id}`, timeslotData);
        return response;
    } catch (error) {
        console.error(`Error updating timeslot with ID ${id}:`, error);
        throw error;
    }
};

export const deleteTimeslotAPI = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/timeslots/delete/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting timeslot with ID ${id}:`, error);
        throw error;
    }
};

export const importTimeslotsFromJsonAPI = async (timeslots) => {
    try {
        const response = await axiosInstance.post('/api/timeslots/importJson', {
            timeslots: timeslots
        });
        return response;
    } catch (error) {
        console.error("Error importing timeslots from JSON:", error);
        throw error;
    }
};