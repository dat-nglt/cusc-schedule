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

const DeleteSemesterModal = ({ open, onClose, onDelete, semester }) => {
  const handleDelete = async () => {
    try {
      const response = await onDelete(semester.semester_id);
      if (response && response.data) {
        onDelete(semester.semester_id);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting semester:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa học kỳ</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa học kỳ với mã{' '}
          <Box
            component="span"
            sx={{
              color: '#1976d2', // Màu xanh dương (tương tự màu primary của MUI)
              fontWeight: 'bold', // In đậm
            }}
          >
            {semester?.semester_id}
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

export default DeleteSemesterModal;