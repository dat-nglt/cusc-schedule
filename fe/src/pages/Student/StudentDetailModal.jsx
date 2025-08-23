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
    Person as PersonIcon,
    Badge as BadgeIcon,
    Class as ClassIcon,
    School as SchoolIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Cake as CakeIcon,
    Transgender as GenderIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
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

export default function StudentDetailModal({ open, onClose, student }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!student) return null;

    const handleCopyStudentId = () => {
        navigator.clipboard.writeText(student.student_id);
        toast.success(`Đã sao chép mã học viên: ${student.student_id}`);
    };

    const getGenderText = (gender) => {
        switch (gender?.toLowerCase()) {
            case 'male': return 'Nam';
            case 'female': return 'Nữ';
            case 'other': return 'Khác';
            default: return 'Chưa xác định';
        }
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
            case 'active': return 'Đang học';
            case 'inactive': return 'Ngừng học';
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
                        {student.name?.[0]?.toUpperCase() || 'H'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {student.name || 'Chi tiết học viên'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {student.student_id}
                            </Typography>
                            <Tooltip title="Sao chép mã học viên">
                                <IconButton
                                    onClick={handleCopyStudentId}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip
                                label={getStatusText(student.status)}
                                color={getStatusColor(student.status)}
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
                    {/* Hàng 1: 2 cột - Thông tin cá nhân & Thông tin liên hệ */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin cá nhân" icon={<PersonIcon />}>
                            <InfoItem
                                label="Mã học viên"
                                value={student.student_id}
                                icon={<BadgeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Giới tính"
                                value={getGenderText(student.gender)}
                                icon={<GenderIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Ngày sinh"
                                value={student.day_of_birth}
                                icon={<CakeIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin liên hệ" icon={<EmailIcon />}>
                            <InfoItem
                                label="Email"
                                value={student.account.email}
                                icon={<EmailIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Số điện thoại"
                                value={student.phone_number}
                                icon={<PhoneIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Địa chỉ"
                                value={student.address}
                                icon={<LocationIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    {/* Hàng 2: 2 cột - Thông tin học tập & Lịch sử hệ thống */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin học tập" icon={<SchoolIcon />}>
                            <InfoItem
                                label="Lớp học"
                                value={student.class_name || student.class_id}
                                icon={<ClassIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Khóa học"
                                value={student.course_name}
                                icon={<SchoolIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Chuyên ngành"
                                value={student.major || 'Chưa xác định'}
                                icon={<SchoolIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
                            <InfoItem
                                label="Ngày tạo"
                                value={formatDateTime(student.created_at)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cập nhật cuối"
                                value={formatDateTime(student.updated_at)}
                                icon={<UpdateIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Trạng thái tài khoản"
                                value={getStatusText(student.status)}
                                icon={<StatusIcon fontSize="small" />}
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
}