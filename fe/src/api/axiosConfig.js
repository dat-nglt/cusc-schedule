// axiosConfig.js
import axios from "axios";

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: import.meta.API_URL || "http://localhost:3000", // Sử dụng biến môi trường hoặc default
  timeout: 30000, // Thời gian timeout (10 giây)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // THÊM DÒNG NÀY ĐỂ GỬI VÀ NHẬN COOKIES (BAO GỒM HTTP-ONLY)
});

// --- Biến cờ và Hàng đợi cho Refresh Token ---
let isRefreshing = false; // Ngăn chặn các yêu cầu làm mới token đồng thời
let failedQueue = []; // Lưu trữ các yêu cầu bị lỗi trong khi đang làm mới token

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Interceptor cho Request ---
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request:", config.method.toUpperCase(), config.url); // Log để debug
    // Bạn có thể thêm logic để đính kèm token vào header nếu bạn cũng sử dụng cơ chế Authorization header
    // Tuy nhiên, với HTTP-only cookies, trình duyệt sẽ tự động gửi.
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// --- Interceptor cho Response (Nơi xử lý Refresh Token) ---
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url); // Log để debug
    return response;
  },
  async (error) => {
    const originalRequest = error.config; // Lấy yêu cầu gốc đã bị lỗi

    // Xử lý lỗi 401: Unauthorized (có thể là do accessToken hết hạn)
    // originalRequest._retry là một cờ tùy chỉnh để tránh lặp vô hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu yêu cầu này đã được thử lại một lần

      // Nếu đang trong quá trình làm mới token, thêm yêu cầu gốc vào hàng đợi
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log(`New token ${token}`);

            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Đặt cờ isRefreshing để chỉ một yêu cầu làm mới được thực hiện tại một thời điểm
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token"); // <-- Thay bằng endpoint làm mới token của bạn
        // Server sẽ đặt cookie accessToken và refreshToken mới vào phản hồi

        isRefreshing = false;
        processQueue(null); // Giải quyết tất cả các yêu cầu đang chờ (thành công)

        // Sau khi refresh token thành công, thử lại yêu cầu gốc
        // Vì token được đặt trong HTTP-only cookies, trình duyệt sẽ tự động gửi accessToken mới.
        // Không cần cập nhật headers ở đây nếu bạn chỉ dùng cookies.
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError); // Báo lỗi cho tất cả các yêu cầu đang chờ (thất bại)
        console.error(
          "Failed to refresh token:",
          refreshError.response?.data || refreshError.message
        );

        // Nếu refresh token cũng hết hạn hoặc có lỗi khác khi làm mới,
        // chuyển hướng người dùng về trang đăng nhập
        window.location.href = `${
          import.meta.REACT_APP_FRONTEND_URL || "http://localhost:5000"
        }/login?error=${encodeURIComponent("session_expired")}`;
        return Promise.reject(refreshError);
      }
    }
    // Xử lý các lỗi khác không phải 401 hoặc 401 đã được xử lý retry
    else if (error.response?.status === 403) {
      console.log("Forbidden (403), access denied.");
      window.location.href = `${
        import.meta.env.VITE_FRONTEND_URL || "http://localhost:5000"
      }/login?error=${encodeURIComponent("access_denied")}`;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
