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
    Assignment as AssignmentIcon,
    Code as CodeIcon,
    AccessTime as TimeIcon, // Good for hours/credits
    CheckCircle as StatusIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';

// Reusing CompactDetailItem from StudentDetailModal's design
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

export default function SubjectDetailModal({ open, onClose, subject }) {
    if (!subject) return null;

    const handleCopyMaHocPhan = () => {
        navigator.clipboard.writeText(subject.subject_id);
        toast.success(`Đã sao chép mã học phần: ${subject.subject_id}`);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm" // Consistent max-width with StudentDetailModal
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                    maxWidth: 500 // Consistent max-width
                }
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: 'primary.main', // Consistent primary color
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
                        {subject.subject_name || 'Chi tiết học phần'}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {subject.subject_id}
                    </Typography>
                </Box>
                <Box>
                    <Tooltip title="Sao chép mã">
                        <IconButton onClick={handleCopyMaHocPhan} size="small" sx={{ color: 'white', p: 0.5 }}>
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
                            icon={<CodeIcon fontSize="small" />}
                            label="Mã học phần"
                            value={subject.subject_id}
                            color="primary"
                        />
                        <CompactDetailItem
                            icon={<AssignmentIcon fontSize="small" />}
                            label="Tên học phần"
                            value={subject.subject_name}
                            color="secondary"
                        />
                    </Box>

                    {/* Hours Info Row */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 1.5
                        }}
                    >
                        <CompactDetailItem
                            icon={<TimeIcon fontSize="small" />}
                            label="Số tiết lý thuyết"
                            value={subject.theory_hours ? `${subject.theory_hours} tiết` : 'Không có dữ liệu'}
                            color="warning"
                        />
                        <CompactDetailItem
                            icon={<TimeIcon fontSize="small" />}
                            label="Số tiết thực hành"
                            value={subject.practice_hours ? `${subject.practice_hours} tiết` : 'Không có dữ liệu'}
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
                            label={subject.status}
                            color={subject.status === 'Hoạt động' ? 'success' : 'error'}
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
                                        {formatDateTime(subject.created_at)}
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
                                        {formatDateTime(subject.updated_at)}
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