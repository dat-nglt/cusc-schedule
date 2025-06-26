// // axiosConfig.js
// // Cấu hình Axios instance cho toàn app
import axios from 'axios';

// // Tạo instance của axios
const axiosInstance = axios.create({
  // Đặt base URL của backend (thay bằng URL thực tế của server)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Sử dụng biến môi trường hoặc default
  timeout: 10000, // Thời  gian timeout (10 giây)
  headers: {
    'Content-Type': 'application/json',
    // Có thể thêm các header khác (ví dụ: Authorization) nếu cần
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});

// // Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token hoặc các thông tin khác vào header trước khi gửi request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config); // Log để debug
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// // Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response); // Log để debug
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    // Xử lý lỗi tập trung (ví dụ: chuyển hướng khi token hết hạn)
    if (error.response && error.response.status === 401) {
      // Xử lý khi không được ủy quyền (ví dụ: logout)
      console.log('Unauthorized, logging out...');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;