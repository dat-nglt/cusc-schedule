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

export const getClassScheduleForLecturerService = async (lecturerId) => {
    try {
        const response = await axiosInstance.get(`/api/classSchedules/lecturer/${lecturerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching class schedule for lecturer:", error);
        throw error.response ? error.response.data : new Error(error.message);
    }
};
export const getClassScheduleForStudentService = async (studentId) => {
    try {
        const response = await axiosInstance.get(`/api/classSchedules/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching class schedule for student:", error);
        throw error.response ? error.response.data : new Error(error.message);
    }
};