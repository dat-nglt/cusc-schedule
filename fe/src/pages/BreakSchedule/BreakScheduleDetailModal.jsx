import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Grid,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import {
  Code as CodeIcon,
  Label as LabelIcon,
  Schedule as ScheduleIcon,
  ToggleOn as ToggleOnIcon,
  Event as EventIcon,
  Update as UpdateIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  BeachAccess as BreakIcon,
  WorkOff
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Hàm định dạng thời gian từ YYYY-MM-DD HH:mm thành DD/MM/YYYY HH:mm
const formatDateTime = (dateTime) => {
  if (!dateTime) return 'Không có dữ liệu';
  try {
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${time || ''}`;
  } catch {
    return 'Không hợp lệ';
  }
};

// Hàm kiểm tra giá trị và trả về giá trị hoặc thông báo mặc định
const getValueOrDefault = (value) => value || 'Không có dữ liệu';

const InfoCard = ({ title, icon, children, span = 1, minHeight = 220 }) => (
  <Grid item xs={12} sm={6} md={span}>
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        minHeight: minHeight,
        borderRadius: 2,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 1
        }
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box sx={{ color: 'primary.main', mt: 0.5 }}>
            {icon}
          </Box>
          <Typography variant="subtitle2" fontWeight="600" color="primary">
            {title}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

const InfoItem = ({ label, value, icon }) => (
  <Box sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon && (
        <Box sx={{ color: 'text.secondary', mt: 1 }}>
          {icon}
        </Box>
      )}
      <Typography variant="body2" fontWeight="500">
        {value || (
          <Typography component="span" variant="body2" color="text.secondary" fontStyle="italic">
            Chưa cập nhật
          </Typography>
        )}
      </Typography>
    </Box>
  </Box>
);

const BreakScheduleDetailModal = ({ open, onClose, breakSchedule }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!breakSchedule) return null;

  // Hàm sao chép mã lịch nghỉ
  const handleCopyMaLichNghi = () => {
    navigator.clipboard.writeText(breakSchedule.break_id);
    toast.success(`Đã sao chép mã lịch nghỉ: ${breakSchedule.break_id}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'Đang áp dụng';
      case 'inactive': return 'Không áp dụng';
      case 'pending': return 'Chờ xử lý';
      default: return status || 'Không xác định';
    }
  };

  const getBreakTypeText = (breakType) => {
    switch (breakType?.toLowerCase()) {
      case 'holiday': return 'Ngày lễ';
      case 'break': return 'Nghỉ giữa giờ';
      case 'maintenance': return 'Bảo trì';
      case 'emergency': return 'Khẩn cấp';
      default: return breakType || 'Không xác định';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : 2,
          maxWidth: 950,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            <WorkOff />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Chi tiết lịch nghỉ
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {breakSchedule.break_id}
              </Typography>
              <Tooltip title="Sao chép mã lịch nghỉ">
                <IconButton
                  onClick={handleCopyMaLichNghi}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Chip
                label={getStatusText(breakSchedule.status)}
                color={getStatusColor(breakSchedule.status)}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3} justifyContent={'center'}>
          {/* Hàng 1: 2 cột - Thông tin cơ bản & Thời gian */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Thông tin cơ bản" icon={<CodeIcon />}>
              <InfoItem
                label="Mã lịch nghỉ"
                value={breakSchedule.break_id}
                icon={<CodeIcon fontSize="small" />}
              />
              <InfoItem
                label="Loại lịch nghỉ"
                value={getBreakTypeText(breakSchedule.break_type)}
                icon={<LabelIcon fontSize="small" />}
              />
              <InfoItem
                label="Trạng thái"
                value={getStatusText(breakSchedule.status)}
                icon={<ToggleOnIcon fontSize="small" />}
              />
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard title="Thời gian" icon={<ScheduleIcon />}>
              <InfoItem
                label="Thời gian bắt đầu"
                value={formatDateTime(breakSchedule.break_start_date)}
                icon={<ScheduleIcon fontSize="small" />}
              />
              <InfoItem
                label="Thời gian kết thúc"
                value={formatDateTime(breakSchedule.break_end_date)}
                icon={<ScheduleIcon fontSize="small" />}
              />
              <InfoItem
                label="Mô tả"
                value={breakSchedule.description}
                icon={<LabelIcon fontSize="small" />}
              />
            </InfoCard>
          </Grid>

          {/* Hàng 2: 2 cột - Lịch sử hệ thống */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
              <InfoItem
                label="Thời gian tạo"
                value={""}
                icon={<EventIcon fontSize="small" />}
              />
              <InfoItem
                label="Thời gian cập nhật"
                value={""}
                icon={<UpdateIcon fontSize="small" />}
              />
              <InfoItem
                label="Người tạo"
                value={breakSchedule.created_by}
                icon={<EventIcon fontSize="small" />}
              />
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard title="Thông tin bổ sung" icon={<LabelIcon />}>
              <InfoItem
                label="Ghi chú"
                value={breakSchedule.notes}
                icon={<LabelIcon fontSize="small" />}
              />
              <InfoItem
                label="Độ ưu tiên"
                value={breakSchedule.priority}
                icon={<LabelIcon fontSize="small" />}
              />
              <InfoItem
                label="Ảnh hưởng"
                value={breakSchedule.impact}
                icon={<LabelIcon fontSize="small" />}
              />
            </InfoCard>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color='secondary'
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            textTransform: 'none',
            fontWeight: '500'
          }}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 1,
            px: 3,
            textTransform: 'none',
            fontWeight: '500'
          }}
        >
          Chỉnh sửa thông tin
        </Button>
      </Box>
    </Dialog>
  );
};

export default BreakScheduleDetailModal;