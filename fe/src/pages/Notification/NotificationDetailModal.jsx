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
  Title as TitleIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  Email as EmailIcon,
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
            aria-label="Sao chép mã thông báo"
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: 3 }}>
        <Grid container spacing={2}>
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
              <TitleIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Tiêu đề
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(notification.tieuDe)}
                </Typography>
              </Box>
            </Box>
          </Grid>
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
              <DescriptionIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Nội dung
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(notification.noiDung)}
                </Typography>
              </Box>
            </Box>
          </Grid>
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
              <PriorityHighIcon sx={{ mr: 1, color: '#1976d2' }} />
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
              <EmailIcon sx={{ mr: 1, color: '#1976d2' }} />
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
          aria-label="Đóng modal chi tiết"
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDetailModal;