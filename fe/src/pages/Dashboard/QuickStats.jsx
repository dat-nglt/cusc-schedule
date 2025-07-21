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

const QuickStats = ({ stats }) => {
    const theme = useTheme();
    const [showStats, setShowStats] = useState(false);
    const [openModal, setOpenModal] = useState(null);

    // Sample data
    const roomData = [
        {
            id: 1,
            code: 'A101',
            name: 'Phòng học A101',
            type: 'Lý thuyết',
            capacity: 50,
            equipment: ['Máy chiếu', 'Điều hòa', 'Loa'],
            status: 'available',
            building: 'Tòa nhà A'
        },
        {
            id: 2,
            code: 'B202',
            name: 'Phòng thực hành B202',
            type: 'Thực hành',
            capacity: 30,
            equipment: ['Máy tính', 'Bảng tương tác', 'Microscope'],
            status: 'maintenance',
            building: 'Tòa nhà B'
        },
        {
            id: 3,
            code: 'A102',
            name: 'Phòng học A102',
            type: 'Lý thuyết',
            capacity: 40,
            equipment: ['Máy chiếu', 'Điều hòa'],
            status: 'available',
            building: 'Tòa nhà A'
        },
        {
            id: 4,
            code: 'C301',
            name: 'Phòng Lab C301',
            type: 'Thực hành',
            capacity: 25,
            equipment: ['Máy tính', 'Màn hình tương tác', 'Kính hiển vi'],
            status: 'available',
            building: 'Tòa nhà C'
        },
        {
            id: 5,
            code: 'B201',
            name: 'Phòng học B201',
            type: 'Lý thuyết',
            capacity: 60,
            equipment: ['Máy chiếu', 'Điều hòa', 'Bảng trắng'],
            status: 'available',
            building: 'Tòa nhà B'
        },
        {
            id: 6,
            code: 'D401',
            name: 'Hội trường D401',
            type: 'Đa năng',
            capacity: 150,
            equipment: ['Hệ thống âm thanh', 'Màn hình lớn', 'Điều hòa', 'Micro'],
            status: 'booked',
            building: 'Tòa nhà D'
        },
        {
            id: 7,
            code: 'C302',
            name: 'Phòng thực hành C302',
            type: 'Thực hành',
            capacity: 35,
            equipment: ['Máy tính', 'Bảng tương tác'],
            status: 'available',
            building: 'Tòa nhà C'
        },
        {
            id: 8,
            code: 'A103',
            name: 'Phòng học A103',
            type: 'Lý thuyết',
            capacity: 45,
            equipment: ['Máy chiếu', 'Điều hòa', 'Loa'],
            status: 'available',
            building: 'Tòa nhà A'
        }
    ];

    const teacherData = [
        {
            id: 1,
            code: 'GV001',
            name: 'TS. Nguyễn Văn A',
            department: 'Công nghệ thông tin',
            subjects: ['Lập trình Java', 'Cấu trúc dữ liệu'],
            status: 'active',
            email: 'nguyenvana@university.edu.vn'
        },
        {
            id: 2,
            code: 'GV002',
            name: 'ThS. Trần Thị B',
            department: 'Kế toán',
            subjects: ['Kế toán tài chính', 'Kế toán quản trị'],
            status: 'on_leave',
            email: 'tranthib@university.edu.vn'
        }
    ];

    const classData = [
        {
            id: 1,
            code: 'IT101',
            name: 'Lập trình hướng đối tượng',
            students: 45,
            teacher: 'TS. Nguyễn Văn A',
            schedule: 'Thứ 2, 7:30-9:30'
        },
        {
            id: 2,
            code: 'ACC201',
            name: 'Kế toán tài chính',
            students: 50,
            teacher: 'ThS. Trần Thị B',
            schedule: 'Thứ 3, 9:30-11:30'
        }
    ];

    const conflictData = [
        {
            id: 1,
            type: 'Trùng giảng viên',
            description: 'Giảng viên có 2 lớp cùng giờ',
            teacher: 'TS. Nguyễn Văn A',
            time: 'Thứ 2, 7:30-9:30'
        },
        {
            id: 2,
            type: 'Trùng phòng học',
            description: '2 lớp cùng phòng cùng giờ',
            room: 'A101',
            time: 'Thứ 3, 13:30-15:30'
        }
    ];

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
                                    <TableCell>Số SV</TableCell>
                                    <TableCell>Giảng viên</TableCell>
                                    <TableCell>Lịch học</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classData.map((cls) => (
                                    <TableRow key={cls.id}>
                                        <TableCell>{cls.code}</TableCell>
                                        <TableCell>{cls.name}</TableCell>
                                        <TableCell>{cls.students}</TableCell>
                                        <TableCell>{cls.teacher}</TableCell>
                                        <TableCell>{cls.schedule}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 'teachers':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {teacherData.map((teacher) => (
                            <Paper key={teacher.id} elevation={0} sx={{
                                p: 2,
                                borderRadius: '8px',
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ mr: 2 }}>{teacher.name.charAt(0)}</Avatar>
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
                                    <strong>Môn giảng dạy:</strong> {teacher.subjects.join(', ')}
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
                        {roomData.map((room) => (
                            <Paper
                                key={room.id}
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
                                        room.status === 'available'
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
                                        backgroundColor: room.status === 'available'
                                            ? theme.palette.success.main
                                            : theme.palette.warning.main,
                                        mr: 1.5
                                    }} />
                                    <Typography variant="subtitle2" fontWeight="600">
                                        {room.code}
                                    </Typography>
                                    <Chip
                                        label={room.status === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
                                        size="small"
                                        sx={{
                                            ml: 'auto',
                                            backgroundColor: room.status === 'available'
                                                ? alpha(theme.palette.success.main, 0.1)
                                                : alpha(theme.palette.warning.main, 0.1),
                                            color: room.status === 'available'
                                                ? theme.palette.success.dark
                                                : theme.palette.warning.dark
                                        }}
                                    />
                                </Box>

                                {/* Room matrix visualization */}
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        {room.name}
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
                                                        room.status === 'available'
                                                            ? theme.palette.primary.main
                                                            : theme.palette.warning.main,
                                                        room.status === 'available' ? 0.2 : 0.1
                                                    ),
                                                    border: `1px solid ${alpha(
                                                        room.status === 'available'
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
                                            value={room.status === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
                                            color={room.status === 'available' ? 'success' : 'warning'}
                                        />
                                    </Box>

                                    {/* Equipment */}
                                    <Typography variant="caption" color="text.secondary">
                                        Thiết bị:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        {room.equipment.map((item, index) => (
                                            <Chip
                                                key={index}
                                                label={item}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '4px',
                                                    backgroundColor: alpha(theme.palette.grey[100], 0.5)
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                );
            case 'conflicts':
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {conflictData.map((conflict) => (
                            <Paper key={conflict.id} elevation={0} sx={{
                                p: 2,
                                borderRadius: '8px',
                                borderLeft: `4px solid ${theme.palette.error.main}`
                            }}>
                                <Typography fontWeight="600" color="error" sx={{ mb: 0.5 }}>
                                    {conflict.type}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {conflict.description}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                        {conflict.teacher || conflict.room}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                        {conflict.time}
                                    </Typography>
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

                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                icon={<CourseIcon />}
                                title="Học phần"
                                value={stats.course}
                                maxValue={40}
                                tooltip={`${stats.course} học phần đang mở`}
                                onClick={() => setOpenModal('classes')}
                            />
                        </Grid>

                        {stats.conflicts > 0 && (
                            <Grid item xs={12} sm={6} lg={3}>
                                <StatCard
                                    icon={<WarningIcon color="warning" />}
                                    title="Xung đột"
                                    value={stats.conflicts}
                                    maxValue={10}
                                    tooltip={`${stats.conflicts} xung đột lịch chưa giải quyết`}
                                    onClick={() => setOpenModal('conflicts')}
                                    sx={{
                                        backgroundColor: theme => theme.palette.warning.light,
                                        '&:hover': {
                                            backgroundColor: theme => theme.palette.warning.lighter,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                />
                            </Grid>
                        )}
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