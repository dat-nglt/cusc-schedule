import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  Close,
  DeleteOutline,
  Book
} from '@mui/icons-material';

const DeleteSubjectModal = ({ open, onClose, onDelete, subject }) => {
  const handleDelete = async () => {
    try {
      const response = await onDelete(subject.subject_id);
      if (response && response.data) {
        onDelete(subject.id);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'error.light',
        color: 'white',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Book sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight="bold">
            Xóa học phần
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white' }}
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            borderRadius: 1,
            alignItems: 'center'
          }}
          icon={<DeleteOutline />}
        >
          <Typography variant="body2" fontWeight="medium">
            Thao tác này không thể hoàn tác
          </Typography>
        </Alert>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Bạn có chắc chắn muốn xóa học phần này không?
        </Typography>

        <Box sx={{ 
          backgroundColor: 'grey.50', 
          p: 2, 
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 100 }}>
              Mã HP:
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {subject?.subject_id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 100 }}>
              Tên HP:
            </Typography>
            <Typography variant="body2">
              {subject?.subject_name}
            </Typography>
          </Box>

          {subject?.credits && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 100 }}>
                Số tín chỉ:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subject?.credits}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="error.main" sx={{ mt: 2, fontStyle: 'italic' }}>
          * Tất cả dữ liệu liên quan đến học phần này sẽ bị xóa vĩnh viễn.
        </Typography>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          startIcon={<DeleteOutline />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            fontWeight: 'bold'
          }}
        >
          Xóa học phần
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSubjectModal;