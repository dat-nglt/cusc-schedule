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
    Class as ClassIcon,
    School as SchoolIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';

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

export default function StudentDetailModal({ open, onClose, student }) {
    if (!student) return null;

    const handleCopyStudentId = () => {
        navigator.clipboard.writeText(student.student_id);
        toast.success(`Đã sao chép mã học viên: ${student.student_id}`);
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
                        {student.name || 'Chi tiết sinh viên'}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {student.student_id}
                    </Typography>
                </Box>
                <Box>
                    <Tooltip title="Sao chép mã">
                        <IconButton onClick={handleCopyStudentId} size="small" sx={{ color: 'white', p: 0.5 }}>
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
                            label="Mã học viên"
                            value={student.student_id}
                            color="primary"
                        />
                        <CompactDetailItem
                            icon={<PersonIcon fontSize="small" />}
                            label="Họ tên"
                            value={student.name}
                            color="secondary"
                        />
                    </Box>

                    {/* Class Info Row */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 1.5
                        }}
                    >
                        <CompactDetailItem
                            icon={<ClassIcon fontSize="small" />}
                            label="Mã lớp"
                            value={student.class_id}
                            color="warning"
                        />
                        <CompactDetailItem
                            icon={<SchoolIcon fontSize="small" />}
                            label="Năm nhập học"
                            value={student.admission_year}
                            color="info"
                        />
                    </Box>

                    {/* Status Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                        <StatusIcon color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">
                            Trạng thái:
                        </Typography>
                        <Chip
                            label={student.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                            color={student.status === 'active' ? 'success' : 'error'}
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
                                        {formatDateTime(student.created_at)}
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
                                        {formatDateTime(student.updated_at)}
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