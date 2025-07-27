import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Code as CodeIcon,
  Label as LabelIcon,
  Home as HomeIcon,
  Group as GroupIcon,
  Category as CategoryIcon,
  ToggleOn as ToggleOnIcon,
  Event as EventIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';

// Hàm kiểm tra giá trị và trả về giá trị hoặc thông báo mặc định
const getValueOrDefault = (value) => value || 'Không có dữ liệu';

export default function RoomDetailModal({ open, onClose, room }) {
  if (!room) return null;

  // Hàm sao chép mã phòng học
  const handleCopyMaPhongHoc = () => {
    navigator.clipboard.writeText(room.room_id);
    toast.success('Đã sao chép mã phòng học: ' + room.room_id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#1976d2',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
        }}
      >
        <Typography variant="h6">
          Chi tiết phòng học {room.room_id}
        </Typography>
        <Tooltip title="Sao chép mã phòng học">
          <IconButton
            onClick={handleCopyMaPhongHoc}
            sx={{ color: '#fff' }}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, px: 3 }}>
        <Grid container spacing={2}>
          {/* Mã phòng học */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Mã phòng học
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(room.room_id)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Tên phòng học */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <LabelIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Tên phòng học
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(room.room_name)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Vị trí */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <HomeIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Vị trí
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(room.location)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Sức chứa */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <GroupIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Sức chứa
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(room.capacity)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Loại phòng học */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <CategoryIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Loại phòng học
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {getValueOrDefault(room.type)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Trạng thái */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <ToggleOnIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Trạng thái
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {getStatusChip(room.status)}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Ghi chú */}
          {room.note && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  bgcolor: '#f9f9f9',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                }}
              >
                <CategoryIcon sx={{ mr: 1, color: '#1976d2', mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Ghi chú
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    {getValueOrDefault(room.note)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Thời gian tạo */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <EventIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Thời gian tạo
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {formatDateTime(room.created_at)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Thời gian cập nhật */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
                p: 2,
                borderRadius: 1,
                border: '1px solid #e0e0e0',
              }}
            >
              <UpdateIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Thời gian cập nhật
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  {formatDateTime(room.updated_at)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#115293' },
            borderRadius: 1,
            px: 3,
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}