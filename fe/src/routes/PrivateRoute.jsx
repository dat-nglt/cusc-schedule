import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { useAuth } from '../contexts/AuthContext'; // Import custom hook useAuth
import { Alert, Box, Container, Typography } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userRole, loading } = useAuth(); // Lấy trạng thái từ AuthContext
  const location = useLocation(); // Hook để lấy thông tin về URL hiện tại

  // 1. Đang tải xác thực
  if (loading) {
    // Hiển thị một thành phần tải (spinner, skeleton screen, v.v.)
    // trong khi AuthContext đang xác minh phiên đăng nhập với backend.
    return (
      <Container
        maxWidth="sm" // Giới hạn chiều rộng của container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', // Chiếm toàn bộ chiều cao màn hình
          textAlign: 'center',
          p: 3, // Padding
        }}
      >
        <Box sx={{ my: 4 }}>

          <Alert
            severity={"success"}
            icon={<CheckCircleOutline fontSize="inherit" />}
            sx={{ width: '100%' }}
          >
            <Typography variant="body1">Đang xác thực người dùng</Typography>
          </Alert>

        </Box>

      </Container >
    );
  }

  // 2. Kiểm tra trạng thái đăng nhập
  if (!isLoggedIn) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng họ đến trang đăng nhập.
    // Dùng `state` để lưu trữ đường dẫn hiện tại mà người dùng muốn truy cập.
    // Sau khi đăng nhập thành công, bạn có thể chuyển hướng họ quay lại đường dẫn này.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra vai trò (Authorization) - Tùy chọn
  // `allowedRoles` là một mảng các vai trò được phép truy cập route này.
  // Ví dụ: `allowedRoles={['admin', 'lecturer']}`
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Nếu người dùng đã đăng nhập nhưng vai trò của họ không nằm trong danh sách
      // các vai trò được phép truy cập route này, chuyển hướng họ đến trang không có quyền.
      return <Navigate to="/login" replace />;
    }
  }

  // 4. Đã đăng nhập và có quyền
  // Nếu tất cả các kiểm tra đều vượt qua, hiển thị nội dung của route.
  return children;
};

export default PrivateRoute;