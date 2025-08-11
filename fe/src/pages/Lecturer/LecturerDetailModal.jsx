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
    Person as PersonIcon,
    Badge as BadgeIcon,
    School as SchoolIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';

const getDayInVietnamese = (day) => {
    const dayMap = {
        'Mon': 'Thứ 2',
        'Tue': 'Thứ 3',
        'Wed': 'Thứ 4',
        'Thu': 'Thứ 5',
        'Fri': 'Thứ 6',
        'Sat': 'Thứ 7',
        'Sun': 'Chủ nhật'
    };
    return dayMap[day] || day;
};

const CompactDetailItem = ({ icon, label, value, color = 'primary', chips }) => (
    <Paper
        elevation={0}
        sx={{
            p: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: chips ? 'flex-start' : 'center',
            gap: 1.5,
            flex: 1
        }}
    >
        <Box sx={{ color: `${color}.main`, mt: chips ? 0.5 : 0 }}>{icon}</Box>
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
                {label}
            </Typography>
            {chips ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                    {value && value.length > 0 ? (
                        Array.isArray(value) ? (
                            value.map((item, idx) => (
                                <Chip
                                    key={idx}
                                    label={item}
                                    size="small"
                                    sx={{ bgcolor: `${color}.light`, color: `${color}.dark` }}
                                />
                            ))
                        ) : (
                            <Chip
                                label={value}
                                size="small"
                                sx={{ bgcolor: `${color}.light`, color: `${color}.dark` }}
                            />
                        )
                    ) : (
                        <Typography variant="body2">Không có dữ liệu</Typography>
                    )}
                </Box>
            ) : (
                <Typography variant="body2" fontWeight="medium">
                    {value || 'Không có dữ liệu'}
                </Typography>
            )}
        </Box>
    </Paper>
);

export default function LecturerDetailModal({ open, onClose, lecturer }) {
    if (!lecturer) return null;
    console.log('LecturerDetailModal:', lecturer);
    const handleCopyLecturerId = () => {
        navigator.clipboard.writeText(lecturer.lecturer_id);
        toast.success(`Đã sao chép mã giảng viên: ${lecturer.lecturer_id}`);
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
                        {lecturer.name || 'Chi tiết giảng viên'}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {lecturer.lecturer_id}
                    </Typography>
                </Box>
                <Box>
                    <Tooltip title="Sao chép mã">
                        <IconButton onClick={handleCopyLecturerId} size="small" sx={{ color: 'white', p: 0.5 }}>
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
                    {/* Basic Info Row */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 1.5,
                            py: 2
                        }}
                    >
                        <CompactDetailItem
                            icon={<BadgeIcon fontSize="small" />}
                            label="Mã giảng viên"
                            value={lecturer.lecturer_id}
                            color="primary"
                        />
                        <CompactDetailItem
                            icon={<PersonIcon fontSize="small" />}
                            label="Họ tên"
                            value={lecturer.name}
                            color="secondary"
                        />
                    </Box>

                    {/* Contact Info Row */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 1.5
                        }}
                    >
                        <CompactDetailItem
                            icon={<EmailIcon fontSize="small" />}
                            label="Email"
                            value={lecturer.email}
                            color="info"
                        />
                        <CompactDetailItem
                            icon={<PhoneIcon fontSize="small" />}
                            label="Số điện thoại"
                            value={lecturer.phone_number}
                            color="warning"
                        />
                    </Box>

                    {/* Subjects Section */}
                    <CompactDetailItem
                        icon={<SchoolIcon fontSize="small" />}
                        label="Môn học"
                        value={lecturer.subjects?.map(subject => subject.subject_name) || []}
                        color="success"
                        chips
                    />

                    {/* Busy Slots Section */}
                    <CompactDetailItem
                        icon={<ScheduleIcon fontSize="small" />}
                        label="Lịch bận"
                        value={lecturer.busy_slots?.map(slot => `${getDayInVietnamese(slot.day)} - ${slot.slot_id}`) || []}
                        color="error"
                        chips
                    />

                    {/* Status Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <StatusIcon color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                            Trạng thái:
                        </Typography>
                        <Chip
                            label={lecturer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                            color={lecturer.status === 'active' ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                        />
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
                                        {formatDateTime(lecturer.created_at)}
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
                                        {formatDateTime(lecturer.updated_at)}
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