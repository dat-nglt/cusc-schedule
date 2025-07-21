import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    MeetingRoom as RoomIcon,
    Warning as WarningIcon,
    Add as AddIcon,
    FileDownload as FileDownloadIcon,
    ChevronRight
} from '@mui/icons-material';
import { BarChart, PieChart } from '@mui/x-charts';
import WeeklyCalendar from './WeeklyCalendar';
import QuickStats from './QuickStats';
import RecentConflicts from './RecentConflicts';

const Dashboard = () => {

    const [scheduleItems, setScheduleItems] = useState([
        {
            id: '3',
            course: 'Hóa học cơ bản',
            room: 'P.102',
            lecturer: 'TS. Nguyễn Văn A',
            type: 'Lý thuyết',
            startTime: '2025-06-09T09:00:00',
            endTime: '2025-06-09T11:00:00',
            checkInTime: '2025-06-09T08:50:00',
            checkOutTime: '2025-06-09T11:10:00'
        },
        {
            id: '4',
            course: 'Giải tích 1',
            room: 'P.204',
            lecturer: 'ThS. Trần Thị B',
            type: 'Lý thuyết',
            startTime: '2025-06-10T08:00:00',
            endTime: '2025-06-10T10:00:00',
            checkInTime: '2025-06-10T07:55:00',
            checkOutTime: '2025-06-10T10:05:00'
        },
        {
            id: '5',
            course: 'Tin học đại cương',
            room: 'P.105',
            lecturer: 'ThS. Lê Văn C',
            type: 'Thực hành',
            startTime: '2025-06-11T13:00:00',
            endTime: '2025-06-11T15:00:00',
            checkInTime: '2025-06-11T12:50:00',
            checkOutTime: '2025-06-11T15:10:00'
        },
        {
            id: '6',
            course: 'Kỹ thuật lập trình',
            room: 'P.306',
            lecturer: 'TS. Phạm Thị D',
            type: 'Thực hành',
            startTime: '2025-06-12T10:00:00',
            endTime: '2025-06-12T12:00:00',
            checkInTime: '2025-06-12T09:50:00',
            checkOutTime: '2025-06-12T12:10:00'
        },
        {
            id: '7',
            course: 'Xác suất thống kê',
            room: 'P.103',
            lecturer: 'ThS. Đỗ Văn E',
            type: 'Lý thuyết',
            startTime: '2025-06-13T14:00:00',
            endTime: '2025-06-13T16:00:00',
            checkInTime: '2025-06-13T13:55:00',
            checkOutTime: '2025-06-13T16:05:00'
        }
    ]);

    const handleItemMove = (itemId, newStartTime) => {
        setScheduleItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, startTime: newStartTime }
                    : item
            )
        );
    };

    const handleAddNew = () => {
        // Logic để thêm lịch học mới
        console.log('Thêm lịch học mới');
    };

    const stats = {
        classes: 42,
        teachers: 28,
        rooms: 15,
        course: 15,
        conflicts: 3
    };

    return (
        <Box sx={{ p: 3, zIndex: 10 }}>
            {/* Quick Stats */}
            <QuickStats stats={stats} />

            {/* Main Content */}
            <Box sx={
                {
                    width: 'calc(100vw - 400px)',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    mb: 3
                }
            }>
                {/* Chart Section */}
                <WeeklyCalendar
                    initialDate={new Date()}
                    scheduleItems={scheduleItems}
                    onItemMove={handleItemMove}
                    onAddNew={handleAddNew}
                />
                {/* Recent Conflicts */}
                {/* <RecentConflicts stats={stats} recentConflicts={recentConflicts} /> */}
            </Box>
        </Box>
    );
};

export default Dashboard;