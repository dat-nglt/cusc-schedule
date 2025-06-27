import axiosInstance from './axiosConfig';

// Lấy danh sách khóa học từ API
export const getCourses = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error.response?.data || error.message);
    throw new Error('Error fetching courses: ' + (error.response?.data?.message || error.message));
  }
};

// Lấy chi tiết khóa học theo ID
export const getCourseById = async (course_id) => { // Thay courseid bằng course_id
  try {
    const response = await axiosInstance.get(`/api/courses/${course_id}`); // Sử dụng course_id
    return response.data;
  } catch (error) {
    console.error('Error fetching course detail:', error.response?.data || error.message);
    throw new Error('Error fetching course detail: ' + (error.response?.data?.message || error.message));
  }
};

// Thêm khóa học mới
export const addCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/api/courses/add', courseData);
    return response.data;
  } catch (error) {
    console.error('Error adding course:', error.response?.data || error.message);
    throw new Error('Error adding course: ' + (error.response?.data?.message || error.message));
  }
};

// Cập nhật khóa học
export const updateCourse = async (course_id, courseData) => { // Thay courseid bằng course_id
  try {
    const response = await axiosInstance.put(`/api/courses/edit/${course_id}`, courseData); // Sử dụng course_id
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error.response?.data || error.message);
    throw new Error('Error updating course: ' + (error.response?.data?.message || error.message));
  }
};

// Xóa khóa học
export const deleteCourse = async (course_id) => { // Thay courseid bằng course_id
  try {
    const response = await axiosInstance.delete(`/api/courses/delete/${course_id}`); // Sử dụng course_id
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error.response?.data || error.message);
    throw new Error('Error deleting course: ' + (error.response?.data?.message || error.message));
  }
};

// Lấy danh sách khóa học với bộ lọc (tương ứng với route rỗng '')
export const listCourses = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/api/courses', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error listing courses:', error.response?.data || error.message);
    throw new Error('Error listing courses: ' + (error.response?.data?.message || error.message));
  }
};

export const importCoursesFromExcel = async (fileBuffer) => {
  try {
    const formData = new FormData();
    formData.append('excel_file', new Blob([fileBuffer]), 'courses.xlsx');
    const response = await axiosInstance.post('/api/courses/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error importing courses:', error);
    throw new Error('Error importing courses: ' + error.response?.data?.message || error.message);
  }
};