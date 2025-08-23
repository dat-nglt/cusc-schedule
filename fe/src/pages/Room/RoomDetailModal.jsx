import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Stack,
  Paper,
  Tooltip
} from '@mui/material';
import {
  MeetingRoom as RoomIcon,
  Groups as CapacityIcon,
  Place as LocationIcon,
  Category as TypeIcon,
  Power as StatusIcon,
  Notes as NoteIcon,
  Schedule as TimeIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';

const CompactInfoCard = ({ icon, title, value, color = 'primary' }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      borderRadius: 1.5,
      border: '1px solid',
      borderColor: 'divider',
      flex: 1,
      minWidth: 100
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      <Avatar
        sx={{
          bgcolor: `${color}.light`,
          color: `${color}.dark`,
          width: 28,
          height: 28,
          mr: 1,
          fontSize: '0.8rem'
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography variant="subtitle1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
      {value || '-'}
    </Typography>
  </Paper>
);

export default function RoomDetailModal({ open, onClose, room }) {
  if (!room) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(room.room_id);
    toast.success(`Đã sao chép mã phòng: ${room.room_id}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxWidth: 600
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 1.5,
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {room.room_name || 'Chi tiết phòng'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {room.room_id}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Sao chép mã">
            <IconButton onClick={handleCopy} size="small" sx={{ color: 'white', p: 0.5 }}>
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white', ml: 0.5, p: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          {/* Compact Info Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 1.5,
              py: 1
            }}
          >
            <CompactInfoCard
              icon={<RoomIcon fontSize="small" />}
              title="Tên phòng"
              value={room.room_name}
              color="primary"
            />
            <CompactInfoCard
              icon={<LocationIcon fontSize="small" />}
              title="Vị trí"
              value={room.location}
              color="secondary"
            />
            <CompactInfoCard
              icon={<CapacityIcon fontSize="small" />}
              title="Sức chứa"
              value={room.capacity}
              color="success"
            />
            <CompactInfoCard
              icon={<TypeIcon fontSize="small" />}
              title="Loại phòng"
              value={
                room.type === 'theory'
                  ? 'Lý thuyết'
                  : room.type === 'practice'
                    ? 'Thực hành'
                    : room.type
              }
              color="warning"
            />
          </Box>

          {/* Status Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Trạng thái:
            </Typography>
            <Chip
              label={room.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              color={room.status === 'active' ? 'success' : 'error'}
              size="small"
              icon={<StatusIcon sx={{ fontSize: '0.8rem' }} />}
              sx={{ fontWeight: 'medium' }}
            />
          </Box>

          {/* Note Section */}
          {room.note && (
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Ghi chú:
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  borderLeft: '2px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Typography variant="body2">{room.note}</Typography>
              </Paper>
            </Box>
          )}

          {/* Timeline Section */}
          <Box sx={{ mt: 1 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TimeIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tạo lúc:
                  </Typography>
                  <Typography variant="body2" display="block">
                    {formatDateTime(room.created_at)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TimeIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cập nhật:
                  </Typography>
                  <Typography variant="body2" display="block">
                    {formatDateTime(room.updated_at)}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />
      <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          size="small"
          sx={{
            borderRadius: 1,
            px: 2,
            fontSize: '0.8rem',
            textTransform: 'none'
          }}
        >
          Đóng
        </Button>
      </Box>
    </Dialog>
  );
}

// Cần sửas