import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Snackbar, Alert, IconButton, Slide } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Sử dụng forwardRef để có thể gọi các hàm từ component cha
const CustomSnackbar = forwardRef(({ autoHideDuration = 3000 }, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // success, error, warning, info

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    show: (msg, type = 'info') => {
      setMessage(msg);
      setSeverity(type);
      setOpen(true);
    },
    hide: () => {
      setOpen(false);
    }
  }));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // Tùy chỉnh vị trí hiển thị
  const snackbarOrigin = { vertical: 'top', horizontal: 'center' };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={snackbarOrigin}
      // Thêm TransitionComponent để hiệu ứng đẹp hơn
      TransitionComponent={Slide}
      TransitionProps={{ direction: "down" }}
      sx={{
        // Đảm bảo thông báo hiển thị ở giữa màn hình
        left: '50%',
        transform: 'translateX(-50%)',
        top: '20px', // Khoảng cách từ đỉnh màn hình
        width: { xs: '90%', sm: 'auto' }, // Chiều rộng linh hoạt trên mobile
        maxWidth: '500px', // Giới hạn chiều rộng tối đa
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled" // Sử dụng variant filled để màu sắc nổi bật hơn
        sx={{
          width: '100%',
          // Tùy chỉnh màu sắc dựa trên severity cho rõ ràng hơn trong các chế độ
          // Material-UI Alert đã tự động điều chỉnh màu cho chế độ sáng/tối
          '&.MuiAlert-filledSuccess': {
            backgroundColor: '#4CAF50', // Màu xanh lá cây cho thành công
          },
          '&.MuiAlert-filledError': {
            backgroundColor: '#f44336', // Màu đỏ cho lỗi
          },
          '&.MuiAlert-filledWarning': {
            backgroundColor: '#ff9800', // Màu cam cho cảnh báo
          },
          '&.MuiAlert-filledInfo': {
            backgroundColor: '#2196f3', // Màu xanh dương cho thông tin
          },
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
});

export default CustomSnackbar;