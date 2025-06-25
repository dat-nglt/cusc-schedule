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
  MenuItem,
} from '@mui/material';

const AddCourseModal = ({ open, onClose, onAddCourse }) => {
  const [newCourse, setNewCourse] = useState({
    course_id: '', // Thay courseid bằng course_id
    course_name: '', // Thay coursename bằng course_name
    start_date: '', // Thay startdate bằng start_date
    end_date: '', // Thay enddate bằng end_date
    status: '', // Thêm status theo model
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !newCourse.course_id ||
      !newCourse.course_name ||
      !newCourse.start_date ||
      !newCourse.end_date ||
      !newCourse.status
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
      course_id: '',
      course_name: '',
      start_date: '',
      end_date: '',
      status: '',
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
            name="course_id" // Thay courseid bằng course_id
            value={newCourse.course_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Tên khóa học"
            name="course_name" // Thay coursename bằng course_name
            value={newCourse.course_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="start_date" // Thay startdate bằng start_date
            type="date"
            value={newCourse.start_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian kết thúc"
            name="end_date" // Thay enddate bằng end_date
            type="date"
            value={newCourse.end_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Trạng thái"
            name="status"
            value={newCourse.status}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            select // Loại bỏ SelectProps={{ native: true }}
          >
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </TextField>
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