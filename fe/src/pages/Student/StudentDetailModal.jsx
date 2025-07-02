import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Box,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    Person as PersonIcon,
    Badge as BadgeIcon,
    Class as ClassIcon,
    School as SchoolIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
} from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';

// Hàm định dạng thời gian từ YYYY-MM-DD HH:mm thành DD/MM/YYYY HH:mm
const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Không có dữ liệu';
    try {
        const date = new Date(dateTime);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Không hợp lệ';
    }
};

// Hàm kiểm tra giá trị và trả về giá trị hoặc thông báo mặc định
const getValueOrDefault = (value) => value || 'Không có dữ liệu';

export default function StudentDetailModal({ open, onClose, student }) {
    if (!student) return null;

    // Hàm sao chép mã học viên
    const handleCopyStudentId = () => {
        navigator.clipboard.writeText(student.student_id);
        alert('Đã sao chép mã học viên!');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: '#1976d2',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                }}
            >
                <Typography variant="h6">
                    Chi tiết sinh viên {student.student_id}
                </Typography>
                <Tooltip title="Sao chép mã học viên">
                    <IconButton
                        onClick={handleCopyStudentId}
                        sx={{ color: '#fff' }}
                    >
                        <BadgeIcon />
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <DialogContent sx={{ mt: 2, px: 3 }}>
                <Grid container spacing={2}>
                    {/* Mã học viên */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <BadgeIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Mã học viên
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(student.student_id)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Họ tên */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Họ tên
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(student.name)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Mã lớp */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <ClassIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Mã lớp
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(student.class)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Năm nhập học */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Năm nhập học
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(student.admission_year)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Trạng thái */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <StatusIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Trạng thái
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    {getStatusChip(student.status)}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Thời gian tạo */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <EventIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Thời gian tạo
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {formatDateTime(student.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Thời gian cập nhật */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <UpdateIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Thời gian cập nhật
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {formatDateTime(student.updated_at)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="primary"
                    sx={{
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#115293' },
                        borderRadius: 1,
                        px: 3,
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}
