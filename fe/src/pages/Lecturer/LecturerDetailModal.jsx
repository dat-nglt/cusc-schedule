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
    School as SchoolIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
    Work as WorkIcon,
    MenuBook as DegreeIcon,
    Star as RankIcon,
    Wc as GenderIcon,
    Home as AddressIcon,
    Cake as BirthdayIcon,
    Class as SubjectIcon,
} from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';
import { formatDateTime } from '../../utils/formatDateTime';
import { toast } from 'react-toastify';
// Hàm kiểm tra giá trị và trả về giá trị hoặc thông báo mặc định
const getValueOrDefault = (value) => value || 'Chưa có dữ liệu';

export default function LecturerDetailModal({ open, onClose, lecturer }) {
    if (!lecturer) return null;

    // Hàm sao chép mã giảng viên
    const handleCopyMaGiangVien = () => {
        navigator.clipboard.writeText(lecturer.lecturer_id);
        toast.success('Đã sao chép mã giảng viên: ' + lecturer.lecturer_id);
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
                    Chi tiết giảng viên {lecturer.name || lecturer.lecturer_id}
                </Typography>
                <Tooltip title="Sao chép mã giảng viên">
                    <IconButton
                        onClick={handleCopyMaGiangVien}
                        sx={{ color: '#fff' }}
                    >
                        <BadgeIcon />
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <DialogContent sx={{ mt: 2, px: 3 }}>
                <Grid container spacing={2}>
                    {/* Mã giảng viên */}
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
                                    Mã giảng viên
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.lecturer_id)}
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
                                    {getValueOrDefault(lecturer.name)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Giới tính */}
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
                            <GenderIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Giới tính
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.gender)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Ngày sinh */}
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
                            <BirthdayIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Ngày sinh
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {lecturer.day_of_birth ? formatDateTime(lecturer.day_of_birth, 'date') : 'Chưa có dữ liệu'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Khoa */}
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
                                    Khoa
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.department)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Bằng cấp */}
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
                            <DegreeIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Bằng cấp
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.degree)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Học hàm */}
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
                            <RankIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Học hàm
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.academic_rank)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Ngày vào làm */}
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
                            <WorkIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Ngày vào làm
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {lecturer.hire_date ? formatDateTime(lecturer.hire_date, 'date') : 'Chưa có dữ liệu'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Môn giảng dạy */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                bgcolor: '#f9f9f9',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                            }}
                        >
                            <SubjectIcon sx={{ mr: 1, color: '#1976d2', mt: 0.5 }} />
                            <Box sx={{ width: '100%' }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}
                                >
                                    Môn giảng dạy
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {lecturer.subjects && lecturer.subjects.length > 0 ? (
                                        lecturer.subjects.map((s) => (
                                            <Chip
                                                key={s.subjects_id}
                                                label={s.subject_name}
                                                sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body1" sx={{ color: '#666' }}>
                                            Chưa có dữ liệu
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Địa chỉ */}
                    <Grid item xs={12}>
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
                            <AddressIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Địa chỉ
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.address)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Email */}
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
                            <EmailIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Email
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.email)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Số điện thoại */}
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
                            <PhoneIcon sx={{ mr: 1, color: '#1976d2' }} />
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', color: '#333' }}
                                >
                                    Số điện thoại
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666' }}>
                                    {getValueOrDefault(lecturer.phone_number)}
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
                                    {getStatusChip(lecturer.status)}
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
                                    {formatDateTime(lecturer.created_at)}
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
                                    {formatDateTime(lecturer.updated_at)}
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
