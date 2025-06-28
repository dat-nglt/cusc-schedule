import axiosInstance from './axiosConfig';

export const getAllLecturers = async () => {
    try {
        const response = await axiosInstance.get('/api/lecturers/getAll');
        return response;
    }
    catch (error) {
        console.error('Error fetching lecturers:', error);
        throw new Error('Lỗi khi tải danh sách giảng viên');
    }
};

export const getLecturerById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/lecturers/getById/${id}`);
        return response;
    }
    catch (error) {
        console.error('Error fetching lecturer by ID:', error);
        throw new Error('Lỗi khi tải thông tin giảng viên');
    }
};

export const createLecturer = async (lecturerData) => {
    try {
        const response = await axiosInstance.post('/api/lecturers/create', lecturerData);
        return response;
    }
    catch (error) {
        console.error('Error creating lecturer:', error);
        throw new Error('Lỗi khi tạo giảng viên mới');
    }
};

export const updateLecturer = async (id, lecturerData) => {
    try {
        const response = await axiosInstance.put(`/api/lecturers/update/${id}`, lecturerData);
        return response;
    }
    catch (error) {
        console.error('Error updating lecturer:', error);
        throw new Error('Lỗi khi cập nhật thông tin giảng viên');
    }
};

export const importLecturers = async (jsonData) => {
    try {
        // Import từ dữ liệu JSON đã được validate
        const response = await axiosInstance.post('/api/lecturers/importJson', {
            lecturers: jsonData
        });
        return response;
    }
    catch (error) {
        console.error('Error importing lecturers:', error);
        throw new Error('Lỗi khi nhập giảng viên từ tệp');
    }
};

export const deleteLecturer = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/lecturers/delete/${id}`);
        return response;
    }
    catch (error) {
        console.error('Error deleting lecturer:', error);
        throw new Error('Lỗi khi xóa giảng viên');
    }
};