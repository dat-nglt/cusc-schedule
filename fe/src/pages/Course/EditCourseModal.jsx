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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const EditCourseModal = ({ open, onClose, course, onSave }) => {
  const [editedCourse, setEditedCourse] = useState({
    course_id: '',
    course_name: '',
    start_date: '',
    end_date: '',
    status: '',
    created_at: '',
    updated_at: '',
  });

  const statusOptions = [
    { value: 'Hoạt động', db: 'active' },
    { value: 'Tạm ngưng', db: 'suspended' },
    { value: 'Ngừng hoạt động', db: 'inactive' }
  ];

  useEffect(() => {
    if (course) {
      // Chuyển trạng thái từ tiếng Anh sang tiếng Việt để hiển thị
      let viStatus = 'Hoạt động';
      const statusMap = {
        active: 'Hoạt động',
        inactive: 'Ngừng hoạt động',
        suspended: 'Tạm ngưng'
      };
      if (course.status && statusMap[course.status]) {
        viStatus = statusMap[course.status];
      } else if (course.status && statusOptions.some(opt => opt.value === course.status)) {
        viStatus = course.status;
      }
      setEditedCourse({
        course_id: course.course_id || '',
        course_name: course.course_name || '',
        start_date: course.start_date || '',
        end_date: course.end_date || '',
        status: viStatus,
        created_at: course.created_at || '',
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
      !editedCourse.course_id ||
      !editedCourse.course_name ||
      !editedCourse.start_date ||
      !editedCourse.end_date ||
      !editedCourse.status
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Chuyển trạng thái sang tiếng Anh trước khi lưu
    const statusObj = statusOptions.find(opt => opt.value === editedCourse.status);
    const dbStatus = statusObj ? statusObj.db : 'active';

    const updatedCourse = {
      ...editedCourse,
      status: dbStatus,
      updated_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    onSave(updatedCourse);
    onClose();
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
          margin: 0,
          maxHeight: 'calc(100% - 64px)',
          top: '40px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Chỉnh sửa khóa học</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Mã khóa học"
            name="course_id"
            value={editedCourse.course_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Tên khóa học"
            name="course_name"
            value={editedCourse.course_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="start_date"
            type="date"
            value={editedCourse.start_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian kết thúc"
            name="end_date"
            type="date"
            value={editedCourse.end_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={editedCourse.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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