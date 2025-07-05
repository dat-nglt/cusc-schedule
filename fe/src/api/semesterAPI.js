import axiosInstance from "./axiosConfig";

export const getAllSemesters = async () => {
    try {
        const response = await axiosInstance.get("/api/semesters/getAll");
        return response;
    } catch (error) {
        console.error("Error fetching semesters:", error);
        throw error;
    }
};

export const getSemesterById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/semesters/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching semester with ID ${id}:`, error);
        throw error;
    }
};

export const createSemester = async (semesterData) => {
    try {
        const response = await axiosInstance.post("/api/semesters/create", semesterData);
        return response;
    } catch (error) {
        console.error("Error creating semester:", error);
        throw error;
    }
};


export const updateSemester = async (id, semesterData) => {
    try {
        const response = await axiosInstance.put(`/api/semesters/update/${id}`, semesterData);
        return response;
    } catch (error) {
        console.error(`Error updating semester with ID ${id}:`, error);
        throw error;
    }
};

export const deleteSemester = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/semesters/delete/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting semester with ID ${id}:`, error);
        throw error;
    }
};

export const importSemesters = async (jsonData) => {
    try {
        const response = await axiosInstance.post('/api/semesters/importJson', {
            semesters: jsonData
        });
        return response;
    } catch (error) {
        console.error('Error importing semesters:', error);
        throw error;
    }
};
