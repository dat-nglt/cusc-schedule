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
    Assignment as AssignmentIcon,
    Code as CodeIcon,
    AccessTime as TimeIcon,
    CheckCircle as StatusIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    School as SchoolIcon,
    CreditScore as CreditIcon,
    Category as CategoryIcon
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

export default function SubjectDetailModal({ open, onClose, subject }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!subject) return null;

    const handleCopySubjectId = () => {
        navigator.clipboard.writeText(subject.subject_id);
        toast.success(`Đã sao chép mã học phần: ${subject.subject_id}`);
    };

    const getStatusColor = (status) => {
        if (!status) return 'default';
        
        const statusLower = status.toLowerCase();
        if (statusLower.includes('hoạt động') || statusLower === 'active') return 'success';
        if (statusLower.includes('không hoạt động') || statusLower === 'inactive') return 'error';
        if (statusLower.includes('chờ') || statusLower === 'pending') return 'warning';
        return 'default';
    };

    const getStatusText = (status) => {
        if (!status) return 'Không xác định';
        
        const statusLower = status.toLowerCase();
        if (statusLower.includes('hoạt động') || statusLower === 'active') return 'Hoạt động';
        if (statusLower.includes('không hoạt động') || statusLower === 'inactive') return 'Không hoạt động';
        if (statusLower.includes('chờ') || statusLower === 'pending') return 'Chờ xử lý';
        return status;
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
                        <AssignmentIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {subject.subject_name || 'Chi tiết học phần'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {subject.subject_id}
                            </Typography>
                            <Tooltip title="Sao chép mã học phần">
                                <IconButton
                                    onClick={handleCopySubjectId}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip
                                label={getStatusText(subject.status)}
                                color={getStatusColor(subject.status)}
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
                    {/* Hàng 1: 2 cột - Thông tin cơ bản & Thông tin giờ học */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin cơ bản" icon={<AssignmentIcon />}>
                            <InfoItem
                                label="Mã học phần"
                                value={subject.subject_id}
                                icon={<CodeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Tên học phần"
                                value={subject.subject_name}
                                icon={<AssignmentIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Mô tả"
                                value={subject.description}
                                icon={<AssignmentIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin giờ học" icon={<TimeIcon />}>
                            <InfoItem
                                label="Số tín chỉ"
                                value={subject.credits}
                                icon={<CreditIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Số giờ lý thuyết"
                                value={subject.theory_hours ? `${subject.theory_hours} giờ` : null}
                                icon={<TimeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Số giờ thực hành"
                                value={subject.practice_hours ? `${subject.practice_hours} giờ` : null}
                                icon={<TimeIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    {/* Hàng 2: 2 cột - Lịch sử hệ thống & Thông tin bổ sung */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
                            <InfoItem
                                label="Ngày tạo"
                                value={formatDateTime(subject.created_at)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cập nhật cuối"
                                value={formatDateTime(subject.updated_at)}
                                icon={<UpdateIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Người tạo"
                                value={subject.created_by}
                                icon={<EventIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin bổ sung" icon={<CategoryIcon />}>
                            <InfoItem
                                label="Trạng thái"
                                value={getStatusText(subject.status)}
                                icon={<StatusIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Loại học phần"
                                value={subject.subject_type}
                                icon={<CategoryIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Khoa/Bộ môn"
                                value={subject.department}
                                icon={<SchoolIcon fontSize="small" />}
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

