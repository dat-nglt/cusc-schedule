// src/pages/Course/DeleteCourseModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

const DeleteCourseModal = ({ open, onClose, onDelete, course }) => {
  const handleDelete = () => {
    onDelete(course.course_id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa khóa học</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa khóa học với mã{' '}
          <Box
            component="span"
            sx={{ color: '#1976d2', fontWeight: 'bold' }}
          >
            {course?.course_id}
          </Box> không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCourseModal;