import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    LinearProgress,
    Tooltip,
    Modal,
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
    Tabs,
    Tab,
    IconButton
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    MeetingRoom as RoomIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Close as CloseIcon,
    Person as PersonIcon,
    Class as ClassIcon,
    Book as BookIcon,
    Schedule as ScheduleIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Computer as ComputerIcon,
    Air as AirIcon,
    Construction as ConstructionIcon,
    CheckCircle as CheckCircleIcon,
    Block as BlockIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const StatCard = ({ icon, title, value, maxValue, isError, tooltip, onClick }) => {
    const percentage = maxValue ? Math.min(100, (value / maxValue) * 100) : 0;
    const color = isError ? 'error' : 'primary';

    return (
        <Tooltip title={tooltip} arrow>
            <Card 
                elevation={2} 
                onClick={onClick}
                sx={{
                    border: isError ? '1px solid red' : 'none',
                    position: 'relative',
                    overflow: 'visible',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                    }
                }}
            >
                <CardContent sx={{
                    display: 'flex',
                    alignItems: 'center',
                    pb: '16px !important'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: theme => isError ? theme.palette.error.main : 'transparent',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'
                    }}>
                        {isError && <InfoIcon fontSize="small" />}
                    </Box>

                    {React.cloneElement(icon, {
                        color: color,
                        sx: { fontSize: 40, mr: 2 }
                    })}

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color={color}
                        >
                            {value}
                            {maxValue && (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 1 }}
                                >
                                    /{maxValue}
                                </Typography>
                            )}
                        </Typography>

                        {maxValue && (
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                color={color}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    mt: 1,
                                    backgroundColor: theme => theme.palette.grey[200]
                                }}
                            />
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Tooltip>
    );
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const RoomDetailsModal = ({ open, onClose, rooms }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RoomIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Chi tiết phòng học</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="room tabs">
                    <Tab label="Danh sách phòng" {...a11yProps(0)} />
                    <Tab label="Thống kê sử dụng" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã phòng</TableCell>
                                    <TableCell>Tên phòng</TableCell>
                                    <TableCell>Loại phòng</TableCell>
                                    <TableCell>Sức chứa</TableCell>
                                    <TableCell>Thiết bị</TableCell>
                                    <TableCell>Tình trạng</TableCell>
                                    <TableCell>Tòa nhà</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>{room.code}</TableCell>
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={room.type} 
                                                size="small" 
                                                color={
                                                    room.type === 'Thực hành' ? 'primary' : 
                                                    room.type === 'Lý thuyết' ? 'secondary' : 
                                                    'info'
                                                } 
                                            />
                                        </TableCell>
                                        <TableCell>{room.capacity}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {room.equipment.includes('Máy chiếu') && <ComputerIcon color="action" />}
                                                {room.equipment.includes('Điều hòa') && <AirIcon color="action" />}
                                                {room.equipment.includes('Bảng thông minh') && <RoomIcon color="action" />}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                icon={room.status === 'Hoạt động' ? <CheckCircleIcon /> : <ConstructionIcon />}
                                                label={room.status}
                                                color={room.status === 'Hoạt động' ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{room.building}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="body1" paragraph>
                        Biểu đồ và thống kê sử dụng phòng sẽ được hiển thị tại đây.
                    </Typography>
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const TeacherDetailsModal = ({ open, onClose, teachers }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Chi tiết giảng viên</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="teacher tabs">
                    <Tab label="Danh sách giảng viên" {...a11yProps(0)} />
                    <Tab label="Lịch giảng dạy" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã GV</TableCell>
                                    <TableCell>Họ và tên</TableCell>
                                    <TableCell>Bộ môn/Khoa</TableCell>
                                    <TableCell>Môn giảng dạy</TableCell>
                                    <TableCell>Liên hệ</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {teachers.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>{teacher.code}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                                    {teacher.name.charAt(0)}
                                                </Avatar>
                                                {teacher.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{teacher.department}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {teacher.subjects.slice(0, 3).map(subject => (
                                                    <Chip key={subject} label={subject} size="small" />
                                                ))}
                                                {teacher.subjects.length > 3 && (
                                                    <Chip 
                                                        label={`+${teacher.subjects.length - 3}`} 
                                                        size="small" 
                                                        variant="outlined" 
                                                    />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                    <Typography variant="body2">{teacher.email}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                    <Typography variant="body2">{teacher.phone}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                icon={teacher.status === 'Đang dạy' ? <CheckCircleIcon /> : <BlockIcon />}
                                                label={teacher.status}
                                                color={teacher.status === 'Đang dạy' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="body1" paragraph>
                        Lịch giảng dạy của các giảng viên sẽ được hiển thị tại đây.
                    </Typography>
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ClassDetailsModal = ({ open, onClose, classes }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Chi tiết lớp học</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="class tabs">
                    <Tab label="Danh sách lớp" {...a11yProps(0)} />
                    <Tab label="Lịch học" {...a11yProps(1)} />
                    <Tab label="Môn học" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã lớp</TableCell>
                                    <TableCell>Tên lớp</TableCell>
                                    <TableCell>Chuyên ngành</TableCell>
                                    <TableCell>Khóa học</TableCell>
                                    <TableCell>Sĩ số</TableCell>
                                    <TableCell>Cố vấn học tập</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classes.map((classItem) => (
                                    <TableRow key={classItem.id}>
                                        <TableCell>{classItem.code}</TableCell>
                                        <TableCell>{classItem.name}</TableCell>
                                        <TableCell>{classItem.major}</TableCell>
                                        <TableCell>{classItem.course}</TableCell>
                                        <TableCell>{classItem.studentCount}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                {classItem.advisor}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Typography variant="body1" paragraph>
                        Lịch học của các lớp sẽ được hiển thị tại đây.
                    </Typography>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Typography variant="body1" paragraph>
                        Danh sách môn học của các lớp sẽ được hiển thị tại đây.
                    </Typography>
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ConflictDetailsModal = ({ open, onClose, conflicts }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="h6">Chi tiết xung đột</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Loại xung đột</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Giảng viên</TableCell>
                                <TableCell>Phòng học</TableCell>
                                <TableCell>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {conflicts.map((conflict) => (
                                <TableRow key={conflict.id} sx={{ 
                                    backgroundColor: conflict.status === 'Chưa giải quyết' ? 'rgba(255, 0, 0, 0.05)' : 'inherit'
                                }}>
                                    <TableCell>{conflict.type}</TableCell>
                                    <TableCell>{conflict.description}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                                            {conflict.time}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{conflict.teacher}</TableCell>
                                    <TableCell>{conflict.room}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={conflict.status}
                                            color={conflict.status === 'Chưa giải quyết' ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
                <Button 
                    onClick={() => alert('Chức năng giải quyết xung đột')} 
                    variant="contained" 
                    color="error"
                >
                    Giải quyết xung đột
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const QuickStats = ({ stats }) => {
    const [openRooms, setOpenRooms] = useState(false);
    const [openTeachers, setOpenTeachers] = useState(false);
    const [openClasses, setOpenClasses] = useState(false);
    const [openConflicts, setOpenConflicts] = useState(false);

    // Sample data for demonstration
    const roomData = [
        { id: 1, code: 'A101', name: 'Phòng A101', type: 'Lý thuyết', capacity: 50, 
          equipment: ['Máy chiếu', 'Điều hòa'], status: 'Hoạt động', building: 'Khu A' },
        { id: 2, code: 'B203', name: 'Phòng B203', type: 'Thực hành', capacity: 30, 
          equipment: ['Máy chiếu', 'Bảng thông minh'], status: 'Bảo trì', building: 'Khu B' },
        // Add more rooms as needed
    ];

    const teacherData = [
        { id: 1, code: 'GV001', name: 'Nguyễn Văn A', department: 'Công nghệ thông tin', 
          subjects: ['Lập trình Java', 'Cấu trúc dữ liệu', 'Toán rời rạc'], 
          email: 'nguyenvana@university.edu.vn', phone: '0987654321', status: 'Đang dạy' },
        { id: 2, code: 'GV002', name: 'Trần Thị B', department: 'Kế toán', 
          subjects: ['Kế toán tài chính', 'Kế toán quản trị'], 
          email: 'tranthib@university.edu.vn', phone: '0912345678', status: 'Nghỉ phép' },
        // Add more teachers as needed
    ];

    const classData = [
        { id: 1, code: 'D20CQCN01-B', name: 'Công nghệ thông tin 01B', 
          major: 'Công nghệ thông tin', course: '2020-2024', 
          studentCount: 45, advisor: 'TS. Nguyễn Văn C' },
        { id: 2, code: 'D21KT01-A', name: 'Kế toán 01A', 
          major: 'Kế toán', course: '2021-2025', 
          studentCount: 50, advisor: 'ThS. Trần Thị D' },
        // Add more classes as needed
    ];

    const conflictData = [
        { id: 1, type: 'Trùng phòng', description: '2 lớp cùng sử dụng 1 phòng', 
          time: 'Thứ 2, 13:00-15:00', teacher: 'Nguyễn Văn A', room: 'A101', status: 'Chưa giải quyết' },
        { id: 2, type: 'Trùng giảng viên', description: 'Giảng viên có 2 lớp cùng lúc', 
          time: 'Thứ 3, 9:00-11:00', teacher: 'Trần Thị B', room: 'B203', status: 'Đã giải quyết' },
        // Add more conflicts as needed
    ];

    return (
        <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<SchoolIcon />}
                        title="Lớp học"
                        value={stats.classes}
                        maxValue={50}
                        tooltip={`Tổng số lớp học: ${stats.classes}`}
                        onClick={() => setOpenClasses(true)}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<PeopleIcon />}
                        title="Giảng viên"
                        value={stats.teachers}
                        maxValue={30}
                        tooltip={`Tổng số giảng viên: ${stats.teachers}`}
                        onClick={() => setOpenTeachers(true)}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<RoomIcon />}
                        title="Phòng học"
                        value={stats.rooms}
                        maxValue={20}
                        tooltip={`Tổng số phòng học: ${stats.rooms}`}
                        onClick={() => setOpenRooms(true)}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<WarningIcon />}
                        title="Xung đột"
                        value={stats.conflicts}
                        isError={stats.conflicts > 0}
                        tooltip={`Số xung đột lịch chưa giải quyết: ${stats.conflicts}`}
                        onClick={() => setOpenConflicts(true)}
                    />
                </Grid>
            </Grid>

            <RoomDetailsModal 
                open={openRooms} 
                onClose={() => setOpenRooms(false)} 
                rooms={roomData} 
            />
            
            <TeacherDetailsModal 
                open={openTeachers} 
                onClose={() => setOpenTeachers(false)} 
                teachers={teacherData} 
            />
            
            <ClassDetailsModal 
                open={openClasses} 
                onClose={() => setOpenClasses(false)} 
                classes={classData} 
            />
            
            <ConflictDetailsModal 
                open={openConflicts} 
                onClose={() => setOpenConflicts(false)} 
                conflicts={conflictData} 
            />
        </>
    );
};

export default QuickStats;