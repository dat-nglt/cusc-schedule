// src/services/authService.js
import axiosInstance from "./axiosConfig";

// Định nghĩa base URL của backend API.
// Sử dụng biến môi trường là tốt nhất cho môi trường thực tế.
const API_BASE_URL = "http://localhost:3000";

/**
 * Lấy thông tin người dùng hiện tại từ backend.
 * API này được gọi sau khi Google OAuth callback hoàn tất,
 * dựa vào HTTP-Only cookie 'jwt' đã được đặt bởi backend.
 * @returns {Promise<Object>} Thông tin người dùng (id, role, v.v.)
 * @throws {Error} Nếu có lỗi trong quá trình gọi API hoặc xác thực.
 */
export const getCurrentUserData = async () => {
  try {
    // Axios sẽ tự động gửi cookie HTTP-Only 'jwt' với yêu cầu này
    const response = await axiosInstance.get(
      `${API_BASE_URL}/auth/current-user`,
      {
        withCredentials: true,
      }
    );
    return response.data; // Axios tự động parse JSON
  } catch (error) {
    // Xử lý lỗi từ response của server (ví dụ: 401 Unauthorized)
    if (error.response) {
      // Lỗi từ server (có status code)
      throw new Error(
        error.response.data.message || "Lỗi khi lấy thông tin người dùng."
      );
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi
      throw new Error(
        "Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng."
      );
    } else {
      // Lỗi khác khi thiết lập request
      throw new Error(
        "Lỗi trong quá trình thiết lập yêu cầu: " + error.message
      );
    }
  }
};

// Bạn cũng có thể thêm hàm logout vào đây
/**
 * Gửi yêu cầu đăng xuất đến backend để xóa session/cookie.
 */
export const logoutUser = async () => {
  try {
    await axiosInstance.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return true;
  } catch (error) {
    console.error(
      "Lỗi khi đăng xuất:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Đăng xuất thất bại.");
  }
};

export const loginWithGoogle = () => {
  window.location.href = "http://localhost:3000/auth/google";
};
