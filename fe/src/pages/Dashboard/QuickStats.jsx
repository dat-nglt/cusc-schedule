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
import RoomDetailsModal from './QuickStart/RoomDetailsModal';
import TeacherDetailsModal from './QuickStart/TeacherDetailsModal';
import ClassDetailsModal from './QuickStart/ClassDetailsModal';
import ConflictDetailsModal from './QuickStart/ConflictDetailsModal';

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

const QuickStats = ({ stats }) => {
    const [openRooms, setOpenRooms] = useState(false);
    const [openTeachers, setOpenTeachers] = useState(false);
    const [openClasses, setOpenClasses] = useState(false);
    const [openConflicts, setOpenConflicts] = useState(false);

    // Sample data for demonstration
    const roomData = [
        {
            id: 1, code: 'A101', name: 'Phòng A101', type: 'Lý thuyết', capacity: 50,
            equipment: ['Máy chiếu', 'Điều hòa'], status: 'Hoạt động', building: 'Khu A'
        },
        {
            id: 2, code: 'B203', name: 'Phòng B203', type: 'Thực hành', capacity: 30,
            equipment: ['Máy chiếu', 'Bảng thông minh'], status: 'Bảo trì', building: 'Khu B'
        },
        // Add more rooms as needed
    ];

    const teacherData = [
        {
            id: 1, code: 'GV001', name: 'Nguyễn Văn A', department: 'Công nghệ thông tin',
            subjects: ['Lập trình Java', 'Cấu trúc dữ liệu', 'Toán rời rạc'],
            email: 'nguyenvana@university.edu.vn', phone: '0987654321', status: 'Đang dạy'
        },
        {
            id: 2, code: 'GV002', name: 'Trần Thị B', department: 'Kế toán',
            subjects: ['Kế toán tài chính', 'Kế toán quản trị'],
            email: 'tranthib@university.edu.vn', phone: '0912345678', status: 'Nghỉ phép'
        },
        // Add more teachers as needed
    ];

    const classData = [
        {
            id: 1, code: 'D20CQCN01-B', name: 'Công nghệ thông tin 01B',
            major: 'Công nghệ thông tin', course: '2020-2024',
            studentCount: 45, advisor: 'TS. Nguyễn Văn C'
        },
        {
            id: 2, code: 'D21KT01-A', name: 'Kế toán 01A',
            major: 'Kế toán', course: '2021-2025',
            studentCount: 50, advisor: 'ThS. Trần Thị D'
        },
        // Add more classes as needed
    ];

    const conflictData = [
        {
            id: 1, type: 'Trùng phòng', description: '2 lớp cùng sử dụng 1 phòng',
            time: 'Thứ 2, 13:00-15:00', teacher: 'Nguyễn Văn A', room: 'A101', status: 'Chưa giải quyết'
        },
        {
            id: 2, type: 'Trùng giảng viên', description: 'Giảng viên có 2 lớp cùng lúc',
            time: 'Thứ 3, 9:00-11:00', teacher: 'Trần Thị B', room: 'B203', status: 'Đã giải quyết'
        },
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
                        icon={<RoomIcon />}
                        title="Học phần"
                        value={stats.course}
                        maxValue={40}
                        tooltip={`Tổng số học phần: ${stats.rooms}`}
                        onClick={() => setOpenRooms(true)}
                    />
                </Grid>

                {/* <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<WarningIcon />}
                        title="Xung đột"
                        value={stats.conflicts}
                        isError={stats.conflicts > 0}
                        tooltip={`Số xung đột lịch chưa giải quyết: ${stats.conflicts}`}
                        onClick={() => setOpenConflicts(true)}
                    />
                </Grid> */}
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