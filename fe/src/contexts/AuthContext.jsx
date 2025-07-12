// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCurrentUser, logoutUser } from '../api/authAPI';

// Tạo Context
const AuthContext = createContext(null);

const IS_LOGGED_IN_KEY = 'isLoggedIn';
const USER_ROLE_KEY = 'userRole';

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  // Lấy trạng thái ban đầu từ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem(IS_LOGGED_IN_KEY) === 'true'
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem(USER_ROLE_KEY) || null
  );
  const [loading, setLoading] = useState(true); // Trạng thái loading khi xác minh phiên

  // Hàm để đặt trạng thái đăng nhập và vai trò
  const login = useCallback((role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
    localStorage.setItem(USER_ROLE_KEY, role);
  }, []);

  // Hàm để xóa trạng thái đăng nhập và vai trò
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Lỗi khi gọi API đăng xuất:', error);
    } finally {
      setIsLoggedIn(false);
      setUserRole(null);
      localStorage.removeItem(IS_LOGGED_IN_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
    }
  }, []);

  // Hàm xác minh phiên với Backend
  const verifySession = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API để backend kiểm tra JWT trong HTTP-Only cookie.
      // Axios sẽ tự động gửi cookie này với mỗi request.
      const response = await getCurrentUser();
      if (response.success === 200) {
        login(response.role); // Cập nhật trạng thái đăng nhập từ dữ liệu backend
        return true;
      }
    } catch (error) {
      // Nếu có lỗi (ví dụ: 401 Unauthorized), nghĩa là token không hợp lệ/hết hạn
      console.error('Lỗi khi xác minh phiên đăng nhập:', error.response?.data?.message || error.message);
      logout(); // Xóa trạng thái đăng nhập cục bộ
      return false;
    } finally {
      setTimeout(() => {
        setLoading(false); // Kết thúc trạng thái loading sau khi xác minh
      }, 1000); // Giả lập thời gian xác minh
    }
  }, [login, logout]);

  // useEffect để kiểm tra phiên khi ứng dụng khởi động
  useEffect(() => {
    verifySession();
  }, [verifySession]); // Đảm bảo verifySession là dependency

  // Giá trị được cung cấp bởi Context
  const authContextValue = {
    isLoggedIn,
    userRole,
    loading, // Trạng thái loading khi đang xác minh phiên
    login,
    logout,
    verifySession, // Hàm có thể gọi lại nếu cần
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook để sử dụng Context một cách tiện lợi
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};