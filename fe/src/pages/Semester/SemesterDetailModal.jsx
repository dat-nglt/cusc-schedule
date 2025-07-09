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
    School as SchoolIcon,
    Code as CodeIcon,
    Schedule as ScheduleIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
} from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';
// Hàm kiểm tra giá trị và trả về giá trị hoặc thông báo mặc định
const getValueOrDefault = (value) => value || 'Không có dữ liệu';

export default function SemesterDetailModal({ open, onClose, semester }) {
    if (!semester) return null;

    // Hàm sao chép 
    const handleCopysemester_id = () => {
        navigator.clipboard.writeText(semester.semester_id);
        toast.success('Đã sao chép mã học kỳ: ' + semester.semester_id, {
            position: 'bottom-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
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
                    Chi tiết học kỳ {semester.semester_id}
                </Typography>
                <Tooltip title="Sao chép mã chương trình">
                    <IconButton
                        onClick={handleCopysemester_id}
                        sx={{ color: '#fff' }}
                    >
                        <CodeIcon />
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <DialogContent sx={{ mt: 2, px: 3 }}>
                <Grid container spacing={2}>
                    {/* Mã chương trình */}
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
                            <CodeIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Mã học kỳ
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(semester.semester_id)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Tên chương trình */}
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
                                    Tên học kỳ
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(semester.semester_name)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Thời bắt đầu */}
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
                            <ScheduleIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Thời gian bắt đầu
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {formatDateTime(semester.start_date)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Thời kết thúc */}
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
                            <ScheduleIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Thời gian kết thúc
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {formatDateTime(semester.end_date)}
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
                                    {getStatusChip(semester.status)}
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
                                    {formatDateTime(semester.created_at)}
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
                                    {formatDateTime(semester.updated_at)}
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
    )
}
