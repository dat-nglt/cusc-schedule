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
    Assignment as AssignmentIcon,
    Code as CodeIcon,
    AccessTime as TimeIcon,
    School as SchoolIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
} from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';
// Hàm kiểm tra giá trị và trả về giá trị hoặc thông báo mặc định
const getValueOrDefault = (value) => value || 'Không có dữ liệu';

export default function SubjectDetailModal({ open, onClose, subject }) {
    if (!subject) return null;

    // Hàm sao chép mã học phần
    const handleCopyMaHocPhan = () => {
        navigator.clipboard.writeText(subject.subject_id);
        toast.success('Đã sao chép mã học phần: ' + subject.subject_id);
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
                    Chi tiết học phần {subject.subject_id}
                </Typography>
                <Tooltip title="Sao chép mã học phần">
                    <IconButton
                        onClick={handleCopyMaHocPhan}
                        sx={{ color: '#fff' }}
                    >
                        <CodeIcon />
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <DialogContent sx={{ mt: 2, px: 3 }}>
                <Grid container spacing={2}>
                    {/* Mã học phần */}
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
                                    Mã học phần
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(subject.subject_id)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Tên học phần */}
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
                            <AssignmentIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Tên học phần
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(subject.subject_name)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Số tiết lý thuyết */}
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
                                    Số tiết lý thuyết
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {subject.theory_hours ? `${subject.theory_hours} tiết` : 'Không có dữ liệu'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Số tiết thực hành */}
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
                            <TimeIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Số tiết thực hành
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {subject.practice_hours ? `${subject.practice_hours} tiết` : 'Không có dữ liệu'}
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
                                    {getStatusChip(subject.status)}
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
                                    {formatDateTime(subject.created_at)}
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
                                    {formatDateTime(subject.updated_at)}
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
