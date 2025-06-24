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

const DeleteStudentModal = ({ open, onClose, onDelete, student }) => {
  const handleDelete = () => {
    onDelete(student.id);
    onClose();
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
            {student?.maHocVien}
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

export default DeleteStudentModal;