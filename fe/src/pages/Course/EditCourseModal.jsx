// src/pages/Course/EditCourseModal.jsx
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
    courseid: '',
    coursename: '',
    startdate: '',
    enddate: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (course) {
      setEditedCourse({
        id: course.id,
        courseid: course.courseid,
        coursename: course.coursename,
        startdate: course.startdate,
        enddate: course.enddate,
        created_at: course.created_at,
        updated_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !editedCourse.courseid ||
      !editedCourse.coursename ||
      !editedCourse.startdate ||
      !editedCourse.enddate
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
            name="courseid"
            value={editedCourse.courseid}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Tên khóa học"
            name="coursename"
            value={editedCourse.coursename}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="startdate"
            type="date"
            value={editedCourse.startdate}
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
            value={editedCourse.enddate}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian tạo"
            name="created_at"
            value={editedCourse.created_at}
            fullWidth
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Thời gian cập nhật"
            name="updated_at"
            value={editedCourse.updated_at}
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