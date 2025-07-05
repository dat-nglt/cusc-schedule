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
import { deleteLecturer } from '../../api/lecturerAPI';

const DeleteLecturerModal = ({ open, onClose, onDelete, lecturer }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteLecturer(lecturer.lecturer_id);

      if (response && response.data) {
        onDelete(lecturer.lecturer_id);
        onClose();
        alert('Xóa giảng viên thành công!');
      }
    } catch (error) {
      console.error('Error deleting lecturer:', error);
      alert('Lỗi khi xóa giảng viên: ' + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa giảng viên</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa giảng viên với mã{' '}
          <Box
            component="span"
            sx={{
              color: '#1976d2', // Màu xanh dương (tương tự màu primary của MUI)
              fontWeight: 'bold', // In đậm
            }}
          >
            {lecturer?.maGiangVien}
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

export default DeleteLecturerModal;