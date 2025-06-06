// src/pages/Course/CourseDetailModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

const CourseDetailModal = ({ open, onClose, course }) => {
  if (!course) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Chi tiết khóa học</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" color="primary">
          {course.maKhoaHoc} - {course.tenKhoaHoc}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            <strong>Thời gian bắt đầu:</strong> {course.thoiGianBatDau}
          </Typography>
          <Typography variant="body1">
            <strong>Thời gian kết thúc:</strong> {course.thoiGianKetThuc}
          </Typography>
          <Typography variant="body1">
            <strong>Thời gian tạo:</strong> {course.thoiGianTao}
          </Typography>
          <Typography variant="body1">
            <strong>Thời gian cập nhật:</strong> {course.thoiGianCapNhat}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDetailModal;