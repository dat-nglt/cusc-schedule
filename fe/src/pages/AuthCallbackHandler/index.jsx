// src/pages/AuthCallbackHandler.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserData } from '../../api/authAPI'; // Hoặc đường dẫn đúng tới service của bạn
// Import các component MUI
import {
  CircularProgress, // Biểu tượng loading hình tròn
  Box,              // Component bao bọc đơn giản
  Typography,       // Để hiển thị văn bản
  Alert,            // Để hiển thị thông báo lỗi/thành công
  Container,        // Để căn giữa nội dung
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material'; // Icons cho thông báo

function AuthCallbackHandler() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [message, setMessage] = useState('Đang xác thực, vui lòng chờ...');
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [isError, setIsError] = useState(false); // Trạng thái lỗi để hiển thị Alert phù hợp

  useEffect(() => {
    const handleAuthProcess = async () => {
      setLoading(true); // Bắt đầu loading
      setIsError(false); // Đặt lại trạng thái lỗi
      try {
        const response = await getCurrentUserData();
        console.log("API Response:", response); // Log đầy đủ phản hồi để debug

        if (response && response.success) { // Giả sử API trả về { success: true, role: '...' }
          login(response.role);
          setMessage('Xác thực thành công! Đang chuyển hướng đến Dashboard...');
          // Sử dụng icon CheckCircleOutline cho thông báo thành công
          // Tự động chuyển hướng sau 1.5 giây để người dùng kịp nhìn thấy thông báo
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          // Xử lý trường hợp API trả về success: false hoặc không có dữ liệu mong muốn
          const errorMessage = response?.message || 'Lỗi không xác định từ server.';
          console.error('Lỗi khi lấy thông tin người dùng:', errorMessage);
          logout();
          setMessage(`Xác thực thất bại: ${errorMessage}`);
          setIsError(true); // Đặt trạng thái lỗi
          // Tự động chuyển hướng về trang đăng nhập sau 2.5 giây
          setTimeout(() => {
            navigate(`/login?error=${encodeURIComponent(errorMessage)}`, { replace: true });
          }, 2500);
        }
      } catch (error) {
        console.error('Lỗi trong quá trình xử lý callback frontend:', error);
        logout();
        const clientErrorMessage = error.message || 'Có lỗi xảy ra trong quá trình xác thực.';
        setMessage(`Có lỗi xảy ra: ${clientErrorMessage}`);
        setIsError(true); // Đặt trạng thái lỗi
        // Tự động chuyển hướng về trang đăng nhập sau 2.5 giây
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(clientErrorMessage)}`, { replace: true });
        }, 1500);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    handleAuthProcess();
  }, [navigate, login, logout]);

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
        {loading ? (
          <>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {message}
            </Typography>
          </>
        ) : (
          <Alert
            severity={isError ? "error" : "success"}
            icon={isError ? <ErrorOutline fontSize="inherit" /> : <CheckCircleOutline fontSize="inherit" />}
            sx={{ width: '100%' }}
          >
            <Typography variant="body1">{message}</Typography>
          </Alert>
        )}
      </Box>

    </Container>
  );
}

export default AuthCallbackHandler;