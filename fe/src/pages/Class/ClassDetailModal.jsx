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
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Code as CodeIcon,
  Label as LabelIcon,
  People as PeopleIcon,
  ToggleOn as ToggleOnIcon,
  Event as EventIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  School as SchoolIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

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

const InfoItem = ({ label, value, icon }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Box sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon && (
          <Box sx={{ color: 'text.secondary', mt: 1, flexShrink: 0 }}>
            {icon}
          </Box>
        )}
        <Tooltip
          title={value || "Chưa cập nhật"}
          placement="top-start"
          disableHoverListener={!value || value.length < 30}
        >
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 150,
              cursor: value && value.length >= 30 ? 'help' : 'default',
              backgroundColor: isHovered && value && value.length >= 30 ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              borderRadius: '4px',
              padding: isHovered && value && value.length >= 30 ? '4px 8px' : 0,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {value || (
              <Typography component="span" variant="body2" color="text.secondary" fontStyle="italic">
                Chưa cập nhật
              </Typography>
            )}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
};


const ClassDetailModal = ({ open, onClose, classItem }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!classItem) return null;

  const handleCopyClassId = () => {
    navigator.clipboard.writeText(classItem.class_id);
    toast.success(`Đã sao chép mã lớp học: ${classItem.class_id}`);
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
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Ngừng hoạt động';
      case 'pending': return 'Chờ xử lý';
      default: return status || 'Không xác định';
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
            {classItem.class_name?.[0]?.toUpperCase() || 'L'}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              {classItem.class_name || 'Chi tiết lớp học'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {classItem.class_id}
              </Typography>
              <Tooltip title="Sao chép mã lớp học">
                <IconButton
                  onClick={handleCopyClassId}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Chip
                label={getStatusText(classItem.status)}
                color={getStatusColor(classItem.status)}
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
        <Grid container spacing={3} justifyContent={"center"}>
          {/* Hàng 1: 2 cột - Thông tin lớp học & Thông tin khóa học */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Thông tin lớp học" icon={<LabelIcon />}>
              <InfoItem
                label="Mã lớp học"
                value={classItem.class_id}
                icon={<CodeIcon fontSize="small" />}
              />
              <InfoItem
                label="Tên lớp học"
                value={classItem.class_name}
                icon={<LabelIcon fontSize="small" />}
              />
              <InfoItem
                label="Sĩ số"
                value={classItem.class_size}
                icon={<PeopleIcon fontSize="small" />}
              />
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard title="Thông tin khóa học" icon={<SchoolIcon />}>
              <InfoItem
                label="Mã khóa học"
                value={classItem.course_id}
                icon={<CodeIcon fontSize="small" />}
              />
              <InfoItem
                label="Tên khóa học"
                value={classItem.course_name}
                icon={<BookIcon fontSize="small" />}
              />
              <InfoItem
                label="Mô tả khóa học"
                value={classItem.course_description}
                icon={<BookIcon fontSize="small" />}
              />
            </InfoCard>
          </Grid>

          {/* Hàng 2: 2 cột - Trạng thái & Lịch sử hệ thống */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Trạng thái lớp học" icon={<ToggleOnIcon />}>
              <InfoItem
                label="Trạng thái"
                value={getStatusText(classItem.status)}
                icon={<ToggleOnIcon fontSize="small" />}
              />
              <InfoItem
                label="Sĩ số hiện tại"
                value={classItem.class_size}
                icon={<PeopleIcon fontSize="small" />}
              />
              <InfoItem
                label="Số lượng tối đa"
                value={classItem.class_size}
                icon={<PeopleIcon fontSize="small" />}
              />
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
              <InfoItem
                label="Ngày tạo"
                value={(classItem.created_at)}
                icon={<EventIcon fontSize="small" />}
              />
              <InfoItem
                label="Cập nhật cuối"
                value={(classItem.updated_at)}
                icon={<UpdateIcon fontSize="small" />}
              />
              <InfoItem
                label="Ngày bắt đầu"
                value={(classItem.start_date)}
                icon={<EventIcon fontSize="small" />}
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

export default ClassDetailModal;