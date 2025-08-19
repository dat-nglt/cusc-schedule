import axiosInstance from "./axiosConfig";

export const getAllSchedules = async () => {
    try {
        const response = await axiosInstance.get("/api/classSchedules/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching schedules:", error);
        throw error.response ? error.response.data : new Error(error.message);
    }
};