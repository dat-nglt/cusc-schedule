import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const DeleteNotificationModal = ({ open, onClose, onDelete, notification }) => {
  if (!notification) return null;

  const handleConfirmDelete = () => {
    onDelete(notification.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ bgcolor: '#d32f2f', color: '#fff', py: 1.5 }}>
        Xóa thông báo
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: 3 }}>
        <Typography>
          Bạn có chắc chắn muốn xóa thông báo <strong>{notification.maThongBao}</strong> không? Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} aria-label="Hủy xóa thông báo">Hủy</Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
          sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
          aria-label="Xác nhận xóa thông báo"
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteNotificationModal;