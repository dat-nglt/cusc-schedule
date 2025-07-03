import axiosInstance from "./axiosConfig";

export const getAllSubjects = async () => {
    try {
        const response = await axiosInstance.get("/api/subjects/getAll");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        throw error;
    }
};

export const getSubjectById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/subjects/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching subject with ID ${id}:`, error);
        throw error;
    }
};

export const createSubject = async (subjectData) => {
    try {
        const response = await axiosInstance.post("/api/subjects/create", subjectData);
        return response.data.data;
    } catch (error) {
        console.error("Error creating subject:", error);
        throw error;
    }
};


export const updateSubject = async (id, subjectData) => {
    try {
        const response = await axiosInstance.put(`/api/subjects/update/${id}`, subjectData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating subject with ID ${id}:`, error);
        throw error;
    }
};

export const deleteSubject = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/subjects/delete/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error deleting subject with ID ${id}:`, error);
        throw error;
    }
};

export const importSubject = async (jsonData) => {
    try {
        const response = await axiosInstance.post('/api/subjects/importJson', {
            subjects: jsonData
        });
        return response;
    } catch (error) {
        console.error('Error importing subjects:', error);
        throw error;
    }
};
