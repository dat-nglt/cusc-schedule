import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    LinearProgress,
    Tooltip,
    useTheme,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Collapse
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    MeetingRoom as RoomIcon,
    MenuBook as CourseIcon,
    Warning as WarningIcon,
    Close as CloseIcon,
    Info as InfoIcon,
    MeetingRoom,
    Class,
    Chair,
    Construction,
    Computer,
    KeyboardArrowUp,
    KeyboardArrowDown
} from '@mui/icons-material';

const StatCard = ({ icon, title, value, maxValue, isAlert, tooltip, onClick }) => {
    const theme = useTheme();
    const percentage = maxValue ? Math.min(100, (value / maxValue) * 100) : 0;

    return (
        <Tooltip title={tooltip} arrow>
            <Card
                elevation={0}
                onClick={onClick}
                sx={{
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: theme.shadows[2],
                        borderColor: alpha(theme.palette.primary.main, 0.5)
                    }
                }}
            >
                <CardContent sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    '&:last-child': { pb: 1.5 }
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '10px',
                        backgroundColor: alpha(
                            isAlert ? theme.palette.error.main : theme.palette.primary.main,
                            0.1
                        ),
                        mr: 1.5,
                        color: isAlert ? theme.palette.error.main : theme.palette.primary.main
                    }}>
                        {React.cloneElement(icon, {
                            sx: { fontSize: 24 }
                        })}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.25 }}
                        >
                            {title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Typography
                                variant="h6"
                                fontWeight="600"
                                color={isAlert ? 'error' : 'text.primary'}
                                sx={{ lineHeight: 1 }}
                            >
                                {value}
                            </Typography>
                            {maxValue && (
                                <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ ml: 0.5, mb: 0.1 }}
                                >
                                    /{maxValue}
                                </Typography>
                            )}
                        </Box>

                        {maxValue && (
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                color={isAlert ? 'error' : 'primary'}
                                sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    mt: 1.5,
                                    backgroundColor: theme.palette.grey[200]
                                }}
                            />
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Tooltip>
    );
};

const DetailModal = ({ open, onClose, title, children }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="detail-modal-title"
            fullWidth={true} // Tùy chọn: Làm modal rộng hơn
            maxWidth="md"    // Tùy chọn: Kích thước tối đa
            sx={{
                // Các style tùy chỉnh cho Dialog container
                '& .MuiDialog-paper': {
                    borderRadius: '8px',
                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)', // Nổi bật hơn
                    background: (theme) => theme.palette.background.paper, // Nền phù hợp với theme
                },
                // Đây là phần quan trọng để làm mờ nền
                // MUI Dialog tạo một backdrop, nhưng để blur nội dung đằng sau
                // chúng ta sẽ áp dụng blur cho content chính của trang
                // thông qua một state hoặc class trên body/root element.
            }}
        >
            <DialogTitle id="detail-modal-title" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {title}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    );
};

const QuickStats = ({ stats, lecturers, classes, subjects, rooms }) => {
    const theme = useTheme();
    const [showStats, setShowStats] = useState(false);
    const [openModal, setOpenModal] = useState(null);

    // Sample data

    const DetailItem = ({ icon, label, value, color }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '6px',
                backgroundColor: alpha('#000000', 0.05),
                mr: 1.5,
                color: color ? theme.palette[color].main : 'text.secondary'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight="500">
                    {value}
                </Typography>
            </Box>
        </Box>
    );

    const renderModalContent = () => {
        switch (openModal) {
            case 'classes':
                return (
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                                    <TableCell>Mã lớp</TableCell>
                                    <TableCell>Tên môn học</TableCell>
                                    <TableCell>Sĩ số</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classes.map((cls) => (
                                    <TableRow key={cls.id}>
                                        <TableCell>{cls.class_id}</TableCell>
                                        <TableCell>{cls.class_name}</TableCell>
                                        <TableCell>{cls.class_size}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'teachers':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {lecturers.map((teacher) => (
                            <Paper key={teacher.lecturer_id} elevation={0} sx={{
                                p: 2,
                                borderRadius: '8px',
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box>
                                        <Typography fontWeight="600">{teacher.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {teacher.department}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={teacher.status === 'active' ? 'Đang giảng dạy' : 'Nghỉ phép'}
                                        size="small"
                                        color={teacher.status === 'active' ? 'success' : 'warning'}
                                        sx={{ ml: 'auto' }}
                                    />
                                </Box>
                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Môn giảng dạy:</strong>{' '}
                                    {teacher.subjects.map(subject => subject.subject_id).join(', ')}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Email:</strong> {teacher.email}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                );
            case 'rooms':
                return (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: 3,
                        mt: 2,
                        maxHeight: '500px',
                    }}>
                        {rooms.map((room) => (
                            <Paper
                                key={room.room_id}
                                elevation={0}
                                sx={{
                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[4],
                                        borderColor: alpha(theme.palette.primary.main, 0.3)
                                    }
                                }}
                            >
                                {/* Header with status indicator */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    backgroundColor: alpha(
                                        room.status === 'active'
                                            ? theme.palette.success.light
                                            : theme.palette.warning.light,
                                        0.2
                                    ),
                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                }}>
                                    <Box sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: room.status === 'active'
                                            ? theme.palette.success.main
                                            : theme.palette.warning.main,
                                        mr: 1.5
                                    }} />
                                    <Typography variant="subtitle2" fontWeight="600">
                                        {room.room_id}
                                    </Typography>
                                    <Chip
                                        label={room.status === 'active' ? 'Sẵn sàng' : 'Bảo trì'}
                                        size="small"
                                        sx={{
                                            ml: 'auto',
                                            backgroundColor: room.status === 'active'
                                                ? alpha(theme.palette.success.main, 0.1)
                                                : alpha(theme.palette.warning.main, 0.1),
                                            color: room.status === 'active'
                                                ? theme.palette.success.dark
                                                : theme.palette.warning.dark
                                        }}
                                    />
                                </Box>

                                {/* Room matrix visualization */}
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        {room.room_name}
                                    </Typography>

                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                        gap: 1,
                                        mb: 2,
                                        p: 1,
                                        backgroundColor: alpha(theme.palette.grey[100], 0.5),
                                        borderRadius: '8px'
                                    }}>
                                        {[...Array(room.capacity > 25 ? 25 : room.capacity)].map((_, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    aspectRatio: '1/1',
                                                    borderRadius: '4px',
                                                    backgroundColor: alpha(
                                                        room.status === 'active'
                                                            ? theme.palette.primary.main
                                                            : theme.palette.warning.main,
                                                        room.status === 'active' ? 0.2 : 0.1
                                                    ),
                                                    border: `1px solid ${alpha(
                                                        room.status === 'active'
                                                            ? theme.palette.primary.main
                                                            : theme.palette.warning.main,
                                                        0.3
                                                    )}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {i === 0 && room.type === 'Thực hành' && (
                                                    <Computer fontSize="small" sx={{
                                                        color: alpha(theme.palette.text.secondary, 0.6)
                                                    }} />
                                                )}
                                            </Box>
                                        ))}
                                        {room.capacity > 25 && (
                                            <Box
                                                sx={{
                                                    gridColumn: 'span 5',
                                                    textAlign: 'center',
                                                    py: 0.5,
                                                    color: 'text.secondary',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                +{room.capacity - 25} chỗ
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Room details */}
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 1.5,
                                        mb: 2
                                    }}>
                                        <DetailItem
                                            icon={<MeetingRoom fontSize="small" />}
                                            label="Tòa nhà"
                                            value={room.building}
                                        />
                                        <DetailItem
                                            icon={<Class fontSize="small" />}
                                            label="Loại phòng"
                                            value={room.type}
                                        />
                                        <DetailItem
                                            icon={<Chair fontSize="small" />}
                                            label="Sức chứa"
                                            value={`${room.capacity} chỗ`}
                                        />
                                        <DetailItem
                                            icon={<Construction fontSize="small" />}
                                            label="Tình trạng"
                                            value={room.status === 'active' ? 'Sẵn sàng' : 'Bảo trì'}
                                            color={room.status === 'active' ? 'success' : 'warning'}
                                        />
                                    </Box>

                                    {/* Equipment */}
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Box sx={{ mb: 1 }}>
                <Button
                    variant="text"
                    onClick={() => setShowStats(!showStats)}
                    endIcon={showStats ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        px: 2,
                    }}
                >
                    {showStats ? 'Ẩn thống kê' : 'Xem thống kê nhanh'}
                </Button>

                <Collapse in={showStats}>
                    <Grid container spacing={3} >
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                icon={<SchoolIcon />}
                                title="Lớp học"
                                value={stats.classes}
                                maxValue={50}
                                tooltip={`${stats.classes} lớp học đang hoạt động`}
                                onClick={() => setOpenModal('classes')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                icon={<PeopleIcon />}
                                title="Giảng viên"
                                value={stats.teachers}
                                maxValue={30}
                                tooltip={`${stats.teachers} giảng viên đang giảng dạy`}
                                onClick={() => setOpenModal('teachers')}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                icon={<RoomIcon />}
                                title="Phòng học"
                                value={stats.rooms}
                                maxValue={20}
                                tooltip={`${stats.rooms} phòng học đang sử dụng`}
                                onClick={() => setOpenModal('rooms')}
                            />
                        </Grid>
                    </Grid>
                </Collapse>
            </Box>

            <DetailModal
                open={openModal !== null}
                onClose={() => setOpenModal(null)}
                title={
                    openModal === 'classes' ? 'Danh sách lớp học' :
                        openModal === 'teachers' ? 'Danh sách giảng viên' :
                            openModal === 'rooms' ? 'Danh sách phòng học' :
                                openModal === 'conflicts' ? 'Xung đột lịch học' : ''
                }
            >
                {renderModalContent()}
            </DetailModal>
        </>
    );
};

export default QuickStats;