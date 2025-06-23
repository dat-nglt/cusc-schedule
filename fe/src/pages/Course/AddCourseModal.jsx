// src/pages/Course/AddCourseModal.jsx
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
    courseid: '',
    coursename: '',
    startdate: '',
    enddate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !newCourse.courseid ||
      !newCourse.coursename ||
      !newCourse.startdate ||
      !newCourse.enddate
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const courseToAdd = {
      ...newCourse,
      created_at: currentDateTime,
      updated_at: currentDateTime,
    };

    onAddCourse(courseToAdd);
    setNewCourse({
      courseid: '',
      coursename: '',
      startdate: '',
      enddate: '',
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
          <TextField
            label="Mã khóa học"
            name="courseid"
            value={newCourse.courseid}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Tên khóa học"
            name="coursename"
            value={newCourse.coursename}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="startdate"
            type="date"
            value={newCourse.startdate}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian kết thúc"
            name="enddate"
            type="date"
            value={newCourse.enddate}
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