
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';

const AddCourseModal = ({ open, onClose, onAddCourse }) => {
  const [newCourse, setNewCourse] = useState({
    maKhoaHoc: '',
    tenKhoaHoc: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !newCourse.maKhoaHoc ||
      !newCourse.tenKhoaHoc ||
      !newCourse.thoiGianBatDau ||
      !newCourse.thoiGianKetThuc
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const courseToAdd = {
      ...newCourse,
      id: Date.now(), // Tạo ID tạm thời
      stt: 0, // Sẽ được cập nhật sau
      thoiGianTao: currentDateTime,
      thoiGianCapNhat: currentDateTime,
    };

    onAddCourse(courseToAdd);
    setNewCourse({
      maKhoaHoc: '',
      tenKhoaHoc: '',
      thoiGianBatDau: '',
      thoiGianKetThuc: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Thêm khóa học mới</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* <TextField
            label="Mã khóa học"
            name="maKhoaHoc"
            value={newCourse.maKhoaHoc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          /> */}
          <TextField
            label="Tên khóa học"
            name="tenKhoaHoc"
            value={newCourse.tenKhoaHoc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="thoiGianBatDau"
            type="date"
            value={newCourse.thoiGianBatDau}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian kết thúc"
            name="thoiGianKetThuc"
            type="date"
            value={newCourse.thoiGianKetThuc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseModal;