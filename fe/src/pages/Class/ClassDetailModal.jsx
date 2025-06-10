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
  Person as PersonIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  ToggleOn as ToggleOnIcon,
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

const ClassDetailModal = ({ open, onClose, cls }) => {
  if (!cls) return null;

  // Hàm sao chép mã lớp học
  const handleCopyMaLopHoc = () => {
    navigator.clipboard.writeText(cls.maLopHoc);
    alert('Đã sao chép mã lớp học!');
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
          Chi tiết lớp học {cls.maLopHoc}
        </Typography>
        <Tooltip title="Sao chép mã lớp học">
          <IconButton
            onClick={handleCopyMaLopHoc}
            sx={{ color: '#fff' }}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: 3 }}>
        <Grid container spacing={2}>
          {/* Mã lớp học */}
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
                  Mã lớp học
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(cls.maLopHoc)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Mã học viên */}
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
              <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Mã học viên
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(cls.maHocVien)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Mã khóa học */}
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
              <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Mã khóa học
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(cls.maKhoaHoc)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Sĩ số lớp */}
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
              <GroupIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Sĩ số lớp
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(cls.siSoLop)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Trạng thái */}
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
              <ToggleOnIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Trạng thái
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(cls.trangThai)}
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
                  {formatDateTime(cls.thoiGianTao)}
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
                  {formatDateTime(cls.thoiGianCapNhat)}
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

export default ClassDetailModal;