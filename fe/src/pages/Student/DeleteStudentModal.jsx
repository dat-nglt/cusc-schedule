import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

const DeleteStudentModal = ({ open, onClose, onDelete, student, loading }) => {

  const handleDelete = async () => {
    try {
      loading(true);
      const response = await onDelete(student.student_id);
      if (response && response.data) {
        onDelete(student.student_id);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Không thể xóa học viên. Vui lòng thử lại.');
    } finally {
      loading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa học viên</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa học viên với mã{' '}
          <Box
            component="span"
            sx={{
              color: '#1976d2', // Màu xanh dương (tương tự màu primary của MUI)
              fontWeight: 'bold', // In đậm
            }}
          >
            {student?.student_id}
          </Box> không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteStudentModal;