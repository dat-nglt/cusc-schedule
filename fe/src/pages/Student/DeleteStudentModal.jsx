import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

const DeleteStudentModal = ({ open, onClose, onDelete, student }) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(student.student_id);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Không thể xóa học viên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
            {student?.student_id}
          </Box> không?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteStudentModal;