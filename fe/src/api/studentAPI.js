import axiosInstance from "./axiosConfig";

export const getAllStudents = async () => {
    try {
        const response = await axiosInstance.get('/api/students/getAll');
        return response;
    } catch (error) {
        console.error("Error getting students:", error);
        throw new Error("Loi khi tải danh sách sinh viên");
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/students/${id}`);
        return response;
    } catch (error) {
        console.error(`Error getting student with id ${id}:`, error);
        throw new Error(`Lỗi khi tải thông tin sinh viên với ID ${id}`)
    }
}

export const createStudent = async (studentData) => {
    try {
        const response = await axiosInstance.post(`/api/students/create`, studentData);
        return response;
    } catch (error) {
        console.error("Error creating student:", error);
        throw new Error("Lỗi khi tạo sinh viên mới");
    }
}

export const updateStudent = async (id, studentData) => {
    try {
        const response = await axiosInstance.put(`/api/students/update/${id}`, studentData);
        return response;
    } catch (error) {
        console.error(`Error updating student with id ${id}:`, error);
        throw new Error(`Lỗi khi cập nhật thông tin sinh viên với ID ${id}`);
    }
};

export const deleteStudent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/students/delete/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting student with id ${id}:`, error);
        throw new Error(`Lỗi khi xóa sinh viên với ID ${id}`);
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
        throw new Error('Lỗi khi nhập sinh viên từ file Excel');
    }
};