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
    School as SchoolIcon,
    Code as CodeIcon,
    Schedule as ScheduleIcon,
    Event as EventIcon,
    Update as UpdateIcon,
    CheckCircle as StatusIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    Description as DescriptionIcon
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

const InfoItem = ({ label, value, icon }) => (
    <Box sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon && (
                <Box sx={{ color: 'text.secondary', mt: 1 }}>
                    {icon}
                </Box>
            )}
            <Typography variant="body2" fontWeight="500">
                {value || (
                    <Typography component="span" variant="body2" color="text.secondary" fontStyle="italic">
                        Chưa cập nhật
                    </Typography>
                )}
            </Typography>
        </Box>
    </Box>
);

export default function ProgramDetailModal({ open, onClose, program }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!program) return null;

    const handleCopyProgramId = () => {
        navigator.clipboard.writeText(program.program_id);
        toast.success(`Đã sao chép mã chương trình: ${program.program_id}`);
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
            case 'active': return 'Đang hoạt động';
            case 'inactive': return 'Ngừng hoạt động';
            case 'pending': return 'Chờ xử lý';
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
                        <SchoolIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {program.program_name || 'Chi tiết chương trình'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                {program.program_id}
                            </Typography>
                            <Tooltip title="Sao chép mã chương trình">
                                <IconButton
                                    onClick={handleCopyProgramId}
                                    size="small"
                                    sx={{ p: 0.5 }}
                                >
                                    <CopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip
                                label={getStatusText(program.status)}
                                color={getStatusColor(program.status)}
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
                    {/* Hàng 1: 2 cột - Thông tin cơ bản & Thời gian đào tạo */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin cơ bản" icon={<SchoolIcon />}>
                            <InfoItem
                                label="Mã chương trình"
                                value={program.program_id}
                                icon={<CodeIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Tên chương trình"
                                value={program.program_name}
                                icon={<SchoolIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Mô tả"
                                value={program.description}
                                icon={<DescriptionIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin đào tạo" icon={<ScheduleIcon />}>
                            <InfoItem
                                label="Thời gian đào tạo"
                                value={program.training_duration ? `${program.training_duration} năm` : null}
                                icon={<ScheduleIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Số tín chỉ"
                                value={program.credits}
                                icon={<SchoolIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cấp độ"
                                value={program.level}
                                icon={<SchoolIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    {/* Hàng 2: 2 cột - Lịch sử hệ thống & Thông tin bổ sung */}
                    <Grid item xs={12} md={6}>
                        <InfoCard title="Lịch sử hệ thống" icon={<EventIcon />}>
                            <InfoItem
                                label="Ngày tạo"
                                value={formatDateTime(program.created_at)}
                                icon={<EventIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Cập nhật cuối"
                                value={formatDateTime(program.updated_at)}
                                icon={<UpdateIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Người tạo"
                                value={program.created_by}
                                icon={<EventIcon fontSize="small" />}
                            />
                        </InfoCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InfoCard title="Thông tin bổ sung" icon={<DescriptionIcon />}>
                            <InfoItem
                                label="Trạng thái"
                                value={getStatusText(program.status)}
                                icon={<StatusIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Ghi chú"
                                value={program.notes}
                                icon={<DescriptionIcon fontSize="small" />}
                            />
                            <InfoItem
                                label="Yêu cầu đầu vào"
                                value={program.requirements}
                                icon={<SchoolIcon fontSize="small" />}
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