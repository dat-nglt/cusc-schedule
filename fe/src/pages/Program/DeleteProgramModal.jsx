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
import { deleteProgram } from '../../api/programAPI';
const DeleteProgramModal = ({ open, onClose, onDelete, program }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteProgram(program.program_id);

      if (response && response.data) {
        onDelete(program.program_id);
        onClose();
        alert('Xóa giảng viên thành công!');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Lỗi khi xóa giảng viên: ' + error.message);
    }
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
            {program?.program_id}
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