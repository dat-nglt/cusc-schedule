import axiosInstance from './axiosConfig';

// Lấy danh sách lớp học từ API
export const getClasses = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/classes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error.response?.data || error.message);
    throw new Error('Error fetching classes: ' + (error.response?.data?.message || error.message));
  }
};

// Lấy chi tiết lớp học theo ID
export const getClassById = async (class_id) => {
  try {
    const response = await axiosInstance.get(`/api/classes/${class_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class detail:', error.response?.data || error.message);
    throw new Error('Error fetching class detail: ' + (error.response?.data?.message || error.message));
  }
};

// Thêm lớp học mới
export const addClass = async (classData) => {
  try {
    if (!classData.course_id) {
      throw new Error('Mã khóa học là bắt buộc');
    }
    const response = await axiosInstance.post('/api/classes/add', classData);
    return response.data;
  } catch (error) {
    console.error('Error adding class:', error.response?.data || error.message);
    throw new Error('Error adding class: ' + (error.response?.data?.message || error.message));
  }
};

// Cập nhật lớp học
export const updateClass = async (class_id, classData) => {
  try {
    if (!classData.course_id) {

      throw new Error('Mã khóa học là bắt buộc');
    }
    const response = await axiosInstance.put(`/api/classes/edit/${class_id}`, classData);
    return response.data;
  } catch (error) {
    console.error('Error updating class:', error.response?.data || error.message);
    throw new Error('Error updating class: ' + (error.response?.data?.message || error.message));
  }
};

// Xóa lớp học
export const deleteClass = async (class_id) => {
  try {
    const response = await axiosInstance.delete(`/api/classes/delete/${class_id}`);
    return response.data;
  } catch (error) {
    console.error('Error Deleting class:', error.response?.data || error.message);
    throw new Error('Error deleting class: ' + (error.response?.data?.message || error.message));
  }
};

// Lấy danh sách lớp học với bộ lọc
export const listClasses = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/api/classes/list', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error listing classes:', error.response?.data || error.message);
    throw new Error('Error listing classes: ' + (error.response?.data?.message || error.message));
  }
};

// Nhập lớp học từ file Excel hoặc dữ liệu JSON đã được validate
export const importClasses = async (file, jsonData = null) => {
  try {
    if (jsonData) {
      // Import từ dữ liệu JSON đã được validate
      const response = await axiosInstance.post('/api/classes/importJson', {
        classes: jsonData
      });
      return response;
    } else {
      // Import từ file Excel
      const formData = new FormData();
      formData.append('excel_file', file);

      const response = await axiosInstance.post('/api/classes/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    }
  } catch (error) {
    console.error('Error importing classes:', error);
    throw new Error('Lỗi khi nhập lớp học từ tệp');
  }
};

// Tải template Excel cho lớp học
export const downloadClassTemplate = async () => {
  try {
    const response = await axiosInstance.get('/api/classes/template/download', {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading class template:', error.response?.data || error.message);
    throw new Error('Error downloading class template: ' + (error.response?.data?.message || error.message));
  }
};