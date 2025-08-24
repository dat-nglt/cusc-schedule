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
    Tooltip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Person as PersonIcon,
    Badge as BadgeIcon,
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
    Transgender as GenderIcon,
    Subject as SubjectIcon,
    Work as WorkIcon,
    LabelImportant,
    Book
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';
import { getStatusForLectuer } from '../../components/ui/StatusChip';
import { useState } from 'react';

const InfoCard = ({ title, icon, children, span = 1, minHeight = 220 }) => (
    <Grid item xs={12} sm={6} md={span}>
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                minHeight: minHeight,
                maxWidth: 250,
                minWidth: 250,
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

const InfoItem = ({ label, value, icon, chips }) => (
    <Box sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: chips ? 'flex-start' : 'center', gap: 1 }}>
            {icon && (
                <Box sx={{ color: 'text.secondary', mt: 1 }}>
                    {icon}
                </Box>
            )}
            {chips ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flexGrow: 1 }}>
                    {value && value.length > 0 ? (
                        value.map((item, idx) => (
                            <Chip
                                key={idx}
                                label={item.subject_name}   // ✅ chỉ lấy tên môn
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 0.5 }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mt: 1 }}>
                            Chưa có dữ liệu
                        </Typography>
                    )}

                </Box>
            ) : (
                <Typography variant="body2" fontWeight="500">
                    {value || (
                        <Typography component="span" variant="body2" color="text.secondary" fontStyle="italic">
                            Chưa cập nhật
                        </Typography>
                    )}
                </Typography>
            )}
        </Box>
    </Box>
);

export default function LecturerDetailModal({ open, onClose, lecturer }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!lecturer) return null;

    const handleCopyLecturerId = () => {
        navigator.clipboard.writeText(lecturer.lecturer_id);
        toast.success(`Đã sao chép mã giảng viên: ${lecturer.lecturer_id}`);
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
            case 'active': return 'Đang giảng dạy';
            case 'inactive': return 'Ngừng giảng dạy';
            case 'pending': return 'Chờ xử lý';
            default: return status || 'Không xác định';
        }
    };

    const getGenderText = (gender) => {
        switch (gender?.toLowerCase()) {
            case 'male': return 'Nam';
            case 'female': return 'Nữ';
            case 'other': return 'Khác';
            default: return 'Chưa xác định';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            fullScreen={isMobile}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: isMobile ? 0 : 2,
                    maxWidth: "fit-content",
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
                        {lecturer.name?.[0]?.toUpperCase() || 'G'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {lecturer.name || 'Chi tiết giảng viên'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {lecturer.lecturer_id}
                            </Typography>
                            <Tooltip title="Sao chép mã giảng viên">
                                <IconButton
                                    onClick={handleCopyLecturerId}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip
                                label={getStatusText(lecturer.status)}
                                color={getStatusColor(lecturer.status)}
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
                <Grid container spacing={1.5} justifyContent={"center"}>
                    {/* Hàng 1: 2 cột - Thông tin cá nhân & Thông tin liên hệ */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin cá nhân" icon={<PersonIcon />} minHeight={220}>
                            <InfoItem
                                label="Mã giảng viên"
                                value={lecturer.lecturer_id}
                                icon={<BadgeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Giới tính"
                                value={lecturer.gender}
                                icon={<GenderIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Ngày sinh"
                                value={formatDateTime(lecturer.day_of_birth)}
                                icon={<CakeIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin liên hệ" icon={<EmailIcon />} minHeight={220}>
                            <InfoItem
                                label="Email"
                                value={lecturer.account.email}
                                icon={<EmailIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Số điện thoại"
                                value={lecturer.phone_number}
                                icon={<PhoneIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Địa chỉ"
                                value={lecturer.address}
                                icon={<LocationIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    {/* Hàng 2: 2 cột - Thông tin giảng dạy & Lịch sử hệ thống */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin giảng dạy" icon={<SchoolIcon />} minHeight={220}>
                            {/* Môn giảng dạy với popup chi tiết */}
                            <Box sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                    Môn giảng dạy
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <Box sx={{ color: 'text.secondary', mt: 0.5 }}>
                                        <SubjectIcon fontSize="small" />
                                    </Box>
                                    {lecturer.subjects && lecturer.subjects.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flexGrow: 1 }}>
                                            {/* Chuyển đổi object thành string để hiển thị */}
                                            {(() => {
                                                // Lấy danh sách tên môn học
                                                const subjectNames = lecturer.subjects.map(subject =>
                                                    typeof subject === 'object'
                                                        ? subject.subject_name || subject.subject_id
                                                        : subject
                                                );

                                                // Hiển thị môn đầu tiên
                                                const firstSubject = subjectNames[0];

                                                return (
                                                    <>
                                                        <Chip
                                                            label={firstSubject}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ mb: 0.5 }}
                                                        />

                                                        {/* Hiển thị số lượng môn còn lại */}
                                                        {subjectNames.length > 1 && (
                                                            <Tooltip
                                                                title={
                                                                    <Box sx={{ px: 1, py: 2 }}>
                                                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                            Tất cả môn giảng dạy
                                                                        </Typography>
                                                                        <List dense>
                                                                            {subjectNames.map((subject, index) => (
                                                                                <ListItem key={index} disablePadding>
                                                                                    <ListItemIcon sx={{ minWidth: 35 }}>
                                                                                        <Book color="primary" />
                                                                                    </ListItemIcon>
                                                                                    <ListItemText primary={subject} />
                                                                                </ListItem>
                                                                            ))}
                                                                        </List>
                                                                    </Box>
                                                                }
                                                                arrow
                                                                placement="top"
                                                            >
                                                                <Chip
                                                                    label={`+${subjectNames.length - 1}`}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="filled"
                                                                    sx={{
                                                                        mb: 0.5,
                                                                        cursor: 'pointer',
                                                                        '&:hover': {
                                                                            backgroundColor: 'primary.dark'
                                                                        }
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                            Chưa có dữ liệu
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            <InfoItem
                                label="Khoa/Bộ môn"
                                value={lecturer.department}
                                icon={<SchoolIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Chức vụ"
                                value={lecturer.position || 'Giảng viên'}
                                icon={<WorkIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />} minHeight={220}>
                            <InfoItem
                                label="Ngày tạo"
                                value={formatDateTime(lecturer.created_at)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cập nhật cuối"
                                value={formatDateTime(lecturer.updated_at)}
                                icon={<UpdateIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Trạng thái"
                                value={getStatusForLectuer(lecturer.status)}
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
                    color='primary'
                    startIcon={<PersonIcon />}
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