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

const DeleteClassModal = ({ open, onClose, onDelete, classItem }) => {
  const handleDelete = () => {
    onDelete(classItem.class_id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa lớp học</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa lớp học với mã{' '}
          <Box
            component="span"
            sx={{ color: '#1976d2', fontWeight: 'bold' }}
          >
            {classItem?.class_id}
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

export default DeleteClassModal;