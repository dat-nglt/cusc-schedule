// axiosConfig.js
// Cấu hình Axios instance cho toàn app
import axios from "axios";

// Tạo instance của axios
const axiosInstance = axios.create({
  // Đặt base URL của backend (thay bằng URL thực tế của server)
  baseURL: "http://localhost:3000", // Sử dụng biến môi trường hoặc default
  timeout: 10000, // Thời gian timeout (10 giây)
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // <-- Loại bỏ dòng này
  },
  // THÊM DÒNG NÀY ĐỂ GỬI VÀ NHẬN COOKIES (BAO GỒM HTTP-ONLY)
  withCredentials: true,
});

// Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request:", config); // Log để debug
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response); // Log để debug
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    // Xử lý lỗi tập trung (ví dụ: chuyển hướng khi token hết hạn)
    if (error.response) {
      if (error.response.status === 401) {
        // Xử lý khi không được ủy quyền (ví dụ: logout)
        console.log("Unauthorized (401), attempting logout...");
        // Ở đây bạn có thể kích hoạt một hàm logout toàn cục,
        // ví dụ: bằng cách dispatch một action Redux hoặc gọi hàm từ AuthContext.
        // Ví dụ: window.location.href = '/login'; hoặc gọi hàm logout từ AuthContext
      } else if (error.response.status === 403) {
        // Xử lý khi không có quyền (ví dụ: chuyển hướng đến trang từ chối truy cập)
        console.log("Forbidden (403), access denied.");
        // window.location.href = '/unauthorized';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
