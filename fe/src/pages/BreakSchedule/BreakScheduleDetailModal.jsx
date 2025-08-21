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
  Label as LabelIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Update as UpdateIcon,
  CheckCircle as StatusIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';

// Reusing CompactDetailItem from StudentDetailModal/ProgramDetailModal's design
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
      flex: 1,
      minWidth: 'fit-content'
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

export default function BreakScheduleDetailModal({ open, onClose, breakSchedule }) {
  if (!breakSchedule) return null;

  const handleCopyBreakId = () => {
    navigator.clipboard.writeText(breakSchedule.break_id);
    toast.success(`Đã sao chép mã lịch nghỉ: ${breakSchedule.break_id}`);
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
          maxWidth: 500
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
            {breakSchedule.break_type || 'Chi tiết lịch nghỉ'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {breakSchedule.break_id}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Sao chép mã">
            <IconButton onClick={handleCopyBreakId} size="small" sx={{ color: 'white', p: 0.5 }}>
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
          {/* Break Schedule Info Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 1.5,
              py: 2
            }}
          >
            <CompactDetailItem
              icon={<CodeIcon fontSize="small" />}
              label="Mã lịch nghỉ"
              value={breakSchedule.break_id}
              color="primary"
            />
            <CompactDetailItem
              icon={<LabelIcon fontSize="small" />}
              label="Loại lịch nghỉ"
              value={breakSchedule.break_type}
              color="secondary"
            />
          </Box>

          {/* Date and Duration Info Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 1.5
            }}
          >
            <CompactDetailItem
              icon={<ScheduleIcon fontSize="small" />}
              label="Thời gian bắt đầu"
              value={formatDateTime(breakSchedule.break_start_date)}
              color="info"
            />
            <CompactDetailItem
              icon={<ScheduleIcon fontSize="small" />}
              label="Thời gian kết thúc"
              value={formatDateTime(breakSchedule.break_end_date)}
              color="info"
            />
          </Box>

          {/* Status and Description Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 1.5
            }}
          >
            <CompactDetailItem
              icon={<LabelIcon fontSize="small" />}
              label="Mô tả"
              value={breakSchedule.description}
              color="warning"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
              <StatusIcon color="action" fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                Trạng thái:
              </Typography>
              <Chip
                label={
                  breakSchedule.status === 'active'
                    ? 'Hoạt động'
                    : breakSchedule.status === 'completed'
                    ? 'Đã hoàn thành'
                    : 'Không hoạt động'
                }
                color={
                  breakSchedule.status === 'active'
                    ? 'success'
                    : breakSchedule.status === 'completed'
                    ? 'info'
                    : 'error'
                }
                size="small"
                sx={{ fontWeight: 'medium' }}
              />
            </Box>
          </Box>

          {/* Timeline Section */}
          <Box sx={{ mt: 1.5 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EventIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tạo lúc:
                  </Typography>
                  <Typography variant="body2" display="block">
                    {formatDateTime(breakSchedule.created_at)}
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
                    {formatDateTime(breakSchedule.updated_at)}
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