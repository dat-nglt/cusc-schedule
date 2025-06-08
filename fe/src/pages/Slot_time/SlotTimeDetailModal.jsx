
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
  Schedule as ScheduleIcon,
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

const SlotTimeDetailModal = ({ open, onClose, slotTime }) => {
  if (!slotTime) return null;

  // Hàm sao chép mã khung giờ
  const handleCopyMaKhungGio = () => {
    navigator.clipboard.writeText(slotTime.maKhungGio);
    alert('Đã sao chép mã khung giờ!');
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
          Chi tiết khung giờ {slotTime.maKhungGio}
        </Typography>
        <Tooltip title="Sao chép mã khung giờ">
          <IconButton
            onClick={handleCopyMaKhungGio}
            sx={{ color: '#fff' }}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: 3 }}>
        <Grid container spacing={2}>
          {/* Mã khung giờ */}
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: '#333' }}
                >
                  Mã khung giờ
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(slotTime.maKhungGio)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Tên khung giờ */}
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: '#333' }}
                >
                  Tên khung giờ
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(slotTime.tenKhungGio)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Buổi học */}
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
              <ScheduleIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: '#333' }}
                >
                  Buổi học
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(slotTime.buoiHoc)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Thời gian bắt đầu */}
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
              <ScheduleIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: '#333' }}
                >
                  Thời gian bắt đầu
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(slotTime.thoiGianBatDau)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Thời gian kết thúc */}
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
              <ScheduleIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: '#333' }}
                >
                  Thời gian kết thúc
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(slotTime.thoiGianKetThuc)}
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: '#333' }}
                >
                  Thời gian tạo
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {formatDateTime(slotTime.thoiGianTao)}
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
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: '#333' }}
                >
                  Thời gian cập nhật
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {formatDateTime(slotTime.thoiGianCapNhat)}
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

export default SlotTimeDetailModal;