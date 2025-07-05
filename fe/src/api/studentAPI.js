import axiosInstance from "./axiosConfig";

export const getAllStudents = async () => {
    try {
        const response = await axiosInstance.get('/api/students/getAll');
        return response;
    } catch (error) {
        console.error("Error getting students:", error);
        throw error;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/students/${id}`);
        return response;
    } catch (error) {
        console.error(`Error getting student with id ${id}:`, error);
        throw error
    }
}

export const createStudent = async (studentData) => {
    try {
        const response = await axiosInstance.post(`/api/students/create`, studentData);
        return response;
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
}

export const updateStudent = async (id, studentData) => {
    try {
        const response = await axiosInstance.put(`/api/students/update/${id}`, studentData);
        return response;
    } catch (error) {
        console.error(`Error updating student with id ${id}:`, error);
        throw error;
    }
};

export const deleteStudent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/students/delete/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting student with id ${id}:`, error);
        throw error;
    }
};

export const importStudents = async (jsonData) => {
    try {
        const response = await axiosInstance.post('/api/students/importJson', {
            students: jsonData
        });
        return response;
    } catch (error) {
        console.error('Error importing students:', error);
        throw error;
    }
};