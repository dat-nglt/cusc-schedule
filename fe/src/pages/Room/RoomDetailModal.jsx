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
    MeetingRoom as RoomIcon,
    Groups as CapacityIcon,
    Place as LocationIcon,
    Category as TypeIcon,
    Power as StatusIcon,
    Notes as NoteIcon,
    Schedule as TimeIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    Update as UpdateIcon,
    Event as EventIcon
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

export default function RoomDetailModal({ open, onClose, room }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!room) return null;

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(room.room_id);
        toast.success(`Đã sao chép mã phòng: ${room.room_id}`);
    };

    const getTypeText = (type) => {
        switch (type?.toLowerCase()) {
            case 'theory': return 'Lý thuyết';
            case 'practice': return 'Thực hành';
            case 'lab': return 'Phòng lab';
            case 'conference': return 'Hội nghị';
            default: return type || 'Chưa xác định';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'maintenance': return 'warning';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'Hoạt động';
            case 'inactive': return 'Không hoạt động';
            case 'maintenance': return 'Bảo trì';
            default: return status || 'Không xác định';
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
                        {room.room_name?.[0]?.toUpperCase() || 'P'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {room.room_name || 'Chi tiết phòng học'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {room.room_id}
                            </Typography>
                            <Tooltip title="Sao chép mã phòng">
                                <IconButton
                                    onClick={handleCopyRoomId}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip
                                label={getStatusText(room.status)}
                                color={getStatusColor(room.status)}
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
                    {/* Hàng 1: 2 cột - Thông tin cơ bản & Thông tin bổ sung */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin cơ bản" icon={<RoomIcon />}>
                            <InfoItem
                                label="Mã phòng"
                                value={room.room_id}
                                icon={<RoomIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Loại phòng"
                                value={getTypeText(room.type)}
                                icon={<TypeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Sức chứa"
                                value={room.capacity ? `${room.capacity} người` : 'Chưa xác định'}
                                icon={<CapacityIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin bổ sung" icon={<LocationIcon />}>
                            <InfoItem
                                label="Vị trí"
                                value={room.location}
                                icon={<LocationIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Trạng thái"
                                value={getStatusText(room.status)}
                                icon={<StatusIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Thiết bị"
                                value={room.equipment || 'Chưa cập nhật'}
                                icon={<NoteIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    {/* Hàng 2: 1 cột rộng - Ghi chú */}
                    <Grid item xs={12}>
                        <InfoCard title="Ghi chú" icon={<NoteIcon />} span={2}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    p: 1.5, 
                                    bgcolor: 'grey.50', 
                                    borderRadius: 1,
                                    minHeight: 100
                                }}
                            >
                                {room.note || 'Không có ghi chú'}
                            </Typography>
                        </InfoCard>
                    </Grid>

                    {/* Hàng 3: 2 cột - Lịch sử hệ thống */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
                            <InfoItem
                                label="Ngày tạo"
                                value={formatDateTime(room.created_at)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cập nhật cuối"
                                value={formatDateTime(room.updated_at)}
                                icon={<UpdateIcon fontSize="small" />}
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