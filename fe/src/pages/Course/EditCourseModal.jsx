
import React, { useState, useEffect } from 'react';
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

const EditCourseModal = ({ open, onClose, course, onSave }) => {
  const [editedCourse, setEditedCourse] = useState({
    id: null,
    maKhoaHoc: '',
    tenKhoaHoc: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
    thoiGianTao: '',
    thoiGianCapNhat: '',
  });

  useEffect(() => {
    if (course) {
      setEditedCourse({
        id: course.id,
        maKhoaHoc: course.maKhoaHoc,
        tenKhoaHoc: course.tenKhoaHoc,
        thoiGianBatDau: course.thoiGianBatDau,
        thoiGianKetThuc: course.thoiGianKetThuc,
        thoiGianTao: course.thoiGianTao,
        thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !editedCourse.maKhoaHoc ||
      !editedCourse.tenKhoaHoc ||
      !editedCourse.thoiGianBatDau ||
      !editedCourse.thoiGianKetThuc
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onSave(editedCourse);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Chỉnh sửa khóa học</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Mã khóa học"
            name="maKhoaHoc"
            value={editedCourse.maKhoaHoc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Tên khóa học"
            name="tenKhoaHoc"
            value={editedCourse.tenKhoaHoc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="thoiGianBatDau"
            type="date"
            value={editedCourse.thoiGianBatDau}
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
            value={editedCourse.thoiGianKetThuc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian tạo"
            name="thoiGianTao"
            value={editedCourse.thoiGianTao}
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Thời gian cập nhật"
            name="thoiGianCapNhat"
            value={editedCourse.thoiGianCapNhat}
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }}>
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourseModal;