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
    Schedule as ScheduleIcon,
    ToggleOn as ToggleOnIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    School as SchoolIcon,
    Description as DescriptionIcon
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
                    <Box sx={{ color: 'primary.main' }}>
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
                <Box sx={{ color: 'text.secondary' }}>
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

export default function CourseDetailModal({ open, onClose, course }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!course) return null;

    const handleCopyCourseId = () => {
        navigator.clipboard.writeText(course.course_id);
        toast.success(`Đã sao chép mã khóa học: ${course.course_id}`);
    };

    const getStatusColor = (status) => {
        if (!status) return 'default';
        
        const statusLower = status.toLowerCase();
        if (statusLower.includes('hoạt động') || statusLower === 'active') return 'success';
        if (statusLower.includes('không hoạt động') || statusLower === 'inactive') return 'error';
        if (statusLower.includes('chờ') || statusLower === 'pending') return 'warning';
        if (statusLower.includes('sắp') || statusLower === 'upcoming') return 'info';
        if (statusLower.includes('kết thúc') || statusLower === 'completed') return 'default';
        return 'default';
    };

    const getStatusText = (status) => {
        if (!status) return 'Không xác định';
        
        const statusLower = status.toLowerCase();
        if (statusLower.includes('hoạt động') || statusLower === 'active') return 'Đang hoạt động';
        if (statusLower.includes('không hoạt động') || statusLower === 'inactive') return 'Không hoạt động';
        if (statusLower.includes('chờ') || statusLower === 'pending') return 'Chờ xử lý';
        if (statusLower.includes('sắp') || statusLower === 'upcoming') return 'Sắp diễn ra';
        if (statusLower.includes('kết thúc') || statusLower === 'completed') return 'Đã kết thúc';
        return status;
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return 'Không có dữ liệu';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN');
        } catch {
            return 'Không hợp lệ';
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
                        <SchoolIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {course.course_name || 'Chi tiết khóa học'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {course.course_id}
                            </Typography>
                            <Tooltip title="Sao chép mã khóa học">
                                <IconButton
                                    onClick={handleCopyCourseId}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip
                                label={getStatusText(course.status)}
                                color={getStatusColor(course.status)}
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
                <Grid container spacing={3}>
                    {/* Hàng 1: 2 cột - Thông tin cơ bản & Thời gian */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin cơ bản" icon={<SchoolIcon />}>
                            <InfoItem
                                label="Mã khóa học"
                                value={course.course_id}
                                icon={<CodeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Tên khóa học"
                                value={course.course_name}
                                icon={<LabelIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Mô tả"
                                value={course.description}
                                icon={<DescriptionIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thời gian khóa học" icon={<ScheduleIcon />}>
                            <InfoItem
                                label="Ngày bắt đầu"
                                value={formatDate(course.start_date)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Ngày kết thúc"
                                value={formatDate(course.end_date)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Thời lượng"
                                value={course.duration ? `${course.duration} tuần` : null}
                                icon={<ScheduleIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    {/* Hàng 2: 2 cột - Lịch sử hệ thống & Thông tin bổ sung */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
                            <InfoItem
                                label="Ngày tạo"
                                value={formatDateTime(course.created_at)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cập nhật cuối"
                                value={formatDateTime(course.updated_at)}
                                icon={<UpdateIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Người tạo"
                                value={course.created_by}
                                icon={<EventIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin bổ sung" icon={<ToggleOnIcon />}>
                            <InfoItem
                                label="Trạng thái"
                                value={getStatusText(course.status)}
                                icon={<ToggleOnIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Số lượng học viên"
                                value={course.student_count}
                                icon={<SchoolIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Ghi chú"
                                value={course.notes}
                                icon={<DescriptionIcon fontSize="small" />}
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