import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Code as CodeIcon,
  Label as LabelIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  Send as SendIcon,
  Event as EventIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';

// Hàm định dạng thời gian từ YYYY-MM-DD HH:mm thành DD/MM/YYYY HH:mm
const formatDateTime = (dateTime) => {
  if (!dateTime) return 'Không có dữ liệu';
  try {
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${time}`;
  } catch {
    return 'Không hợp lệ';
  }
};

// Hàm kiểm tra giá trị và trả về giá trị hoặc thông báo mặc định
const getValueOrDefault = (value) => value || 'Không có dữ liệu';

const NotificationDetailModal = ({ open, onClose, notification }) => {
  if (!notification) return null;

  // Hàm sao chép mã thông báo
  const handleCopyMaThongBao = () => {
    navigator.clipboard.writeText(notification.maThongBao);
    alert('Đã sao chép mã thông báo!');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
        }}
      >
        <Typography variant="h6">
          Chi tiết thông báo {notification.maThongBao}
        </Typography>
        <Tooltip title="Sao chép mã thông báo">
          <IconButton
            onClick={handleCopyMaThongBao}
            sx={{ color: '#fff' }}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: 3 }}>
        <Grid container spacing={2}>
          {/* Mã thông báo */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Mã thông báo
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(notification.maThongBao)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Tiêu đề nội dung */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <LabelIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Tiêu đề nội dung
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(notification.tieuDeNoiDung)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Loại thông báo */}
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <CategoryIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Loại thông báo
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(notification.loaiThongBao)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Mức độ ưu tiên */}
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <PriorityIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Mức độ ưu tiên
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(notification.mucDoUuTien)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Kênh gửi */}
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <SendIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Kênh gửi
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(notification.kenhGui)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Thời gian gửi */}
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <EventIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Thời gian gửi
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {formatDateTime(notification.thoiGianGui)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Thời gian tạo */}
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <EventIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Thời gian tạo
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {formatDateTime(notification.thoiGianTao)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Thời gian cập nhật */}
          <Grid item xs={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <UpdateIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Thời gian cập nhật
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {formatDateTime(notification.thoiGianCapNhat)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#115293' },
            borderRadius: 1,
            px: 3,
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDetailModal;