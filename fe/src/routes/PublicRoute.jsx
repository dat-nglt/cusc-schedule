// src/routes/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Đảm bảo đường dẫn đúng
import Loader from '../components/common/Loader'; // Nếu bạn muốn hiển thị loader khi đang xác minh

const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading, userRole } = useAuth(); // Lấy trạng thái từ AuthContext

    if (loading) {
        // Nếu AuthContext đang loading (đang xác minh phiên), hiển thị loader
        return <Loader />;
    }

    // Nếu người dùng đã đăng nhập (isLoggedIn là true)
    if (isLoggedIn) {
        // Dựa trên vai trò có thể chuyển hướng về dashboard tương ứng.
        let redirectPath = '';
        if (userRole === 'student') {
            redirectPath = '/student';
        }
        if (userRole === 'lecturer') {
            redirectPath = '/lecturer';
        }
        if (userRole === 'admin') {
            redirectPath = '/dashboard'; // Admin có thể vẫn dùng /dashboard chung hoặc /admin-dashboard
        }

        return <Navigate to={redirectPath} replace />;
    }

    // Nếu người dùng chưa đăng nhập, cho phép họ truy cập trang công khai
    return children;
};

export default PublicRoute;