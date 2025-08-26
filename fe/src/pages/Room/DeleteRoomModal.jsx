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
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close,
  DeleteOutline,
  MeetingRoomOutlined
} from '@mui/icons-material';

const DeleteRoomModal = ({ open, onClose, onDelete, room, loading }) => {
  const handleDelete = async () => {
    try {
      const response = await onDelete(room.room_id);
      if (response && response.data) {
        onDelete(room.room_id);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Không thể xóa phòng học. Vui lòng thử lại.');
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
          <MeetingRoomOutlined sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight="bold">
            Xóa phòng học
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
            mb: 2,
            mt: 2,
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
          Bạn có chắc chắn muốn xóa phòng học này không?
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
              Mã phòng:
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {room?.room_id}
            </Typography>
          </Box>

          {room?.room_name && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 100 }}>
                Tên phòng:
              </Typography>
              <Typography variant="body2">
                {room?.room_name}
              </Typography>
            </Box>
          )}

          {room?.capacity && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 100 }}>
                Sức chứa:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {room?.capacity} chỗ
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="error.main" sx={{ mt: 2, fontStyle: 'italic' }}>
          * Tất cả dữ liệu liên quan đến phòng học này sẽ bị xóa vĩnh viễn.
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
          disabled={loading}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <DeleteOutline />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            fontWeight: 'bold'
          }}
          disabled={loading}
        >
          {loading ? 'Đang xóa...' : 'Xóa phòng học'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRoomModal;