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

const DeleteNotificationModal = ({ open, onClose, onDelete, notification }) => {
  const handleDelete = () => {
    onDelete(notification.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa thông báo</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa thông báo với mã{' '}
          <Box
            component="span"
            sx={{
              color: '#1976d2',
              fontWeight: 'bold',
            }}
          >
            {notification?.maThongBao}
          </Box>{' '}
          không?
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

export default DeleteNotificationModal;