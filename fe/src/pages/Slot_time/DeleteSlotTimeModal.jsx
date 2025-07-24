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

const DeleteSlotTimeModal = ({ open, onClose, onDelete, slotTime }) => {
  const handleDelete = async () => {
    try {
      const response = await onDelete(slotTime.slot_id);
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting slot time:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa khung giờ</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa khung giờ với mã{' '}
          <Box
            component="span"
            sx={{
              color: '#1976d2', // Màu xanh dương (tương tự màu primary của MUI)
              fontWeight: 'bold', // In đậm
            }}
          >
            {slotTime?.maKhungGio}
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

export default DeleteSlotTimeModal;