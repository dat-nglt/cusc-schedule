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

const DeleteProgramModal = ({ open, onClose, onDelete, program }) => {
  const handleDelete = () => {
    onDelete(program.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Xác nhận xóa chương trình đào tạo</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có muốn xóa chương trình đào tạo với mã{' '}
          <Box
            component="span"
            sx={{
              color: '#1976d2', // Màu xanh dương (tương tự màu primary của MUI)
              fontWeight: 'bold', // In đậm
            }}
          >
            {program?.maChuongTrinh}
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

export default DeleteProgramModal;