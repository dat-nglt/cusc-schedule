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
    CalendarToday as CalendarTodayIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    Schedule as ScheduleIcon,
    DateRange as DateRangeIcon
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

export default function SemesterDetailModal({ open, onClose, semester }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!semester) return null;

    const handleCopySemesterId = () => {
        navigator.clipboard.writeText(semester.semester_id);
        toast.success(`Đã sao chép mã học kỳ: ${semester.semester_id}`);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'pending': return 'warning';
            case 'upcoming': return 'info';
            case 'completed': return 'default';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'Đang diễn ra';
            case 'inactive': return 'Không hoạt động';
            case 'pending': return 'Chờ xử lý';
            case 'upcoming': return 'Sắp diễn ra';
            case 'completed': return 'Đã kết thúc';
            default: return status || 'Không xác định';
        }
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
                        <CalendarTodayIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {semester.semester_name || 'Chi tiết học kỳ'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {semester.semester_id}
                            </Typography>
                            <Tooltip title="Sao chép mã học kỳ">
                                <IconButton
                                    onClick={handleCopySemesterId}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip
                                label={getStatusText(semester.status)}
                                color={getStatusColor(semester.status)}
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
                    {/* Hàng 1: 2 cột - Thông tin cơ bản & Thời gian */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin cơ bản" icon={<CodeIcon />}>
                            <InfoItem
                                label="Mã học kỳ"
                                value={semester.semester_id}
                                icon={<CodeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Tên học kỳ"
                                value={semester.semester_name}
                                icon={<CalendarTodayIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Năm học"
                                value={semester.academic_year}
                                icon={<CalendarTodayIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thời gian học kỳ" icon={<DateRangeIcon />}>
                            <InfoItem
                                label="Ngày bắt đầu"
                                value={formatDate(semester.start_date)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Ngày kết thúc"
                                value={formatDate(semester.end_date)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Thời lượng"
                                value={semester.duration ? `${semester.duration} tuần` : null}
                                icon={<ScheduleIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    {/* Hàng 2: 2 cột - Lịch sử hệ thống & Thông tin bổ sung */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
                            <InfoItem
                                label="Ngày tạo"
                                value={formatDateTime(semester.created_at)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cập nhật cuối"
                                value={formatDateTime(semester.updated_at)}
                                icon={<UpdateIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Người tạo"
                                value={semester.created_by}
                                icon={<EventIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin bổ sung" icon={<StatusIcon />}>
                            <InfoItem
                                label="Trạng thái"
                                value={getStatusText(semester.status)}
                                icon={<StatusIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Ghi chú"
                                value={semester.notes}
                                icon={<CalendarTodayIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Số lượng môn học"
                                value={semester.course_count}
                                icon={<CalendarTodayIcon fontSize="small" />}
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