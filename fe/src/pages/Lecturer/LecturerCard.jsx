import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    IconButton,
    Avatar,
    Stack,
} from '@mui/material';
import {
    Male as MaleIcon,
    Female as FemaleIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/system';


// Tạo một component styled cho trạng thái để dễ dàng tùy chỉnh màu sắc
const StatusChip = styled(Box)(({ theme, status }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 6px', // Giảm padding
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.65rem', // Giảm kích thước font
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: theme.palette.common.white,
    backgroundColor:
        status === 'Đang giảng dạy'
            ? theme.palette.success.main
            : status === 'Tạm nghỉ'
                ? theme.palette.warning.main
                : status === 'Đã nghỉ việc' || status === 'Nghỉ hưu'
                    ? theme.palette.error.main
                    : theme.palette.grey[500],
}));

const LecturerCard = ({ lecturer, onView, onEdit, onDelete }) => {
    const theme = useTheme();

    const getGenderIcon = (gender) => {
        if (gender === 'Nam') {
            return <MaleIcon sx={{ fontSize: '1.2rem', color: theme.palette.info.main }} />; // Giảm kích thước icon
        } else if (gender === 'Nữ') {
            return <FemaleIcon sx={{ fontSize: '1.2rem', color: theme.palette.error.light }} />; // Giảm kích thước icon
        }
        return <PersonIcon sx={{ fontSize: '1.2rem', color: theme.palette.text.secondary }} />; // Giảm kích thước icon
    };

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                boxShadow: 2, // Giảm đổ bóng nhẹ hơn
                borderRadius: '8px', // Giảm bo tròn góc
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-3px)', // Nâng card ít hơn khi hover
                    boxShadow: 4, // Đổ bóng nhẹ hơn khi hover
                },
            }}
        >
            <CardContent sx={{ p: 2 }}> {/* Giảm padding cho CardContent */}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}> {/* Giảm spacing */}
                    <Avatar sx={{
                        width: 48, // Giảm kích thước avatar
                        height: 48,
                        bgcolor: 'primary.light',
                        border: `1px solid ${theme.palette.divider}`, // Giảm độ dày border
                        flexShrink: 0,
                    }}>
                        {getGenderIcon(lecturer.gender)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" component="div" // Đổi variant thành body1 (nhỏ hơn h6)
                            sx={{
                                fontWeight: 'bold',
                                color: 'text.primary',
                                lineHeight: 1.2,
                                mb: 0.25, // Khoảng cách nhỏ hơn
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 1, // Giới hạn tên 1 dòng
                            }}
                        >
                            {lecturer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary"> {/* Đổi variant thành caption */}
                            {lecturer.department}
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={0.5} sx={{ mb: 1.5 }}> {/* Giảm spacing */}
                    <Typography variant="caption" color="text.secondary"> {/* Đổi variant thành caption */}
                        <Typography component="span" fontWeight="medium" color="text.primary">Mã GV:</Typography> {lecturer.lecturer_id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary"> {/* Đổi variant thành caption */}
                        <Typography component="span" fontWeight="medium" color="text.primary">Email:</Typography> {lecturer.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary"> {/* Đổi variant thành caption */}
                        <Typography component="span" fontWeight="medium" color="text.primary">SĐT:</Typography> {lecturer.phone_number}
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.5}> {/* Giảm spacing */}
                    <Typography component="span" variant="caption" fontWeight="medium" color="text.primary"> {/* Đổi variant thành caption */}
                        Trạng thái:
                    </Typography>
                    <StatusChip status={lecturer.status}>
                        {lecturer.status}
                    </StatusChip>
                </Stack>
            </CardContent>

            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 1, // Giảm padding cho phần nút
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.action.hover,
                borderRadius: '0 0 8px 8px', // Giảm bo tròn góc dưới
            }}>
                <IconButton aria-label="xem chi tiết" onClick={onView} color="info" size="small">
                    <VisibilityIcon fontSize="small" /> {/* Giảm kích thước icon */}
                </IconButton>
                <IconButton aria-label="chỉnh sửa" onClick={onEdit} color="primary" size="small">
                    <EditIcon fontSize="small" /> {/* Giảm kích thước icon */}
                </IconButton>
                <IconButton aria-label="xóa" onClick={onDelete} color="error" size="small">
                    <DeleteIcon fontSize="small" /> {/* Giảm kích thước icon */}
                </IconButton>
            </Box>
        </Card>
    );
};

export default LecturerCard;