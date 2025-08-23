import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
  Stack,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Code as CodeIcon,
  Class as ClassIcon,
  School as SchoolIcon,
  Label as LabelIcon,
  Group as GroupIcon,
  ToggleOn as ToggleOnIcon,
  Event as EventIcon,
  Update as UpdateIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Power
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Helper function to format date-time
const formatDateTime = (dateTime) => {
  if (!dateTime) return 'Không có dữ liệu';
  try {
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${time}`;
  } catch {
    return 'Không hợp lệ';
  }
};

// Reusable CompactDetailItem component for consistent styling
const CompactDetailItem = ({ icon, label, value, color = 'primary' }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      flex: 1, // Allows items to grow and shrink in a flex/grid container
      minWidth: 'fit-content' // Ensures content doesn't get too cramped
    }}
  >
    <Box sx={{ color: `${color}.main` }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        {value || 'Không có dữ liệu'}
      </Typography>
    </Box>
  </Paper>
);

const ClassSectionDetailModal = ({ open, onClose, cls }) => {
  if (!cls) return null;

  const handleCopyMaLopHocPhan = () => {
    navigator.clipboard.writeText(cls.maLopHocPhan);
    toast.success(`Đã sao chép mã lớp học phần: ${cls.maLopHocPhan}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm" // Consistent max-width with other modals
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxWidth: 500 // Consistent max-width
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main', // Consistent primary color
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
            {cls.tenLopHocPhan || 'Chi tiết lớp học phần'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {cls.maLopHocPhan}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Sao chép mã">
            <IconButton onClick={handleCopyMaLopHocPhan} size="small" sx={{ color: 'white', p: 0.5 }}>
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white', ml: 0.5, p: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          {/* Identification Info */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 1.5,
              py: 1
            }}
          >
            <CompactDetailItem
              icon={<CodeIcon fontSize="small" />}
              label="Mã lớp học phần"
              value={cls.maLopHocPhan}
              color="primary"
            />
            <CompactDetailItem
              icon={<ClassIcon fontSize="small" />}
              label="Mã lớp học"
              value={cls.maLopHoc}
              color="secondary"
            />
            <CompactDetailItem
              icon={<SchoolIcon fontSize="small" />}
              label="Mã học phần"
              value={cls.maHocPhan}
              color="info"
            />
            <CompactDetailItem
              icon={<LabelIcon fontSize="small" />}
              label="Tên lớp học phần"
              value={cls.tenLopHocPhan}
              color="success"
            />
          </Box>

          {/* Capacity & Status */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 1.5
            }}
          >
            <CompactDetailItem
              icon={<GroupIcon fontSize="small" />}
              label="Sĩ số tối đa"
              value={cls.siSoToiDa}
              color="warning"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Trạng thái:
            </Typography>
            <Chip
              label={cls.status === 'active' ? 'Đang mở' : 'Chưa mở'}
              color={cls.status === 'active' ? 'success' : 'error'}
              size="small"
              icon={<Power sx={{ fontSize: '0.8rem' }} />}
              sx={{ fontWeight: 'medium' }}
            />
          </Box>

          {/* Timeline Info */}
          <Box sx={{ mt: 1.5 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EventIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tạo lúc:
                  </Typography>
                  <Typography variant="body2" display="block">
                    {formatDateTime(cls.thoiGianTao)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UpdateIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cập nhật:
                  </Typography>
                  <Typography variant="body2" display="block">
                    {formatDateTime(cls.thoiGianCapNhat)}
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
};

export default ClassSectionDetailModal;