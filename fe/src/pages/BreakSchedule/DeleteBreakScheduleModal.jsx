// src/pages/BreakSchedule/DeleteBreakScheduleModal.jsx
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

const DeleteBreakScheduleModal = ({ open, onClose, onDelete, breakSchedule }) => {
  const handleDelete = () => {
    onDelete(breakSchedule.break_id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa lịch nghỉ</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa lịch nghỉ với mã{' '}
          <Box
            component="span"
            sx={{ color: '#1976d2', fontWeight: 'bold' }}
          >
            {breakSchedule?.break_id}
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

export default DeleteBreakScheduleModal;