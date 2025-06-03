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
            id: '1',
            course: 'Toán cao cấp',
            room: 'P.301',
            startTime: '2025-05-22T08:00:00',
            endTime: '2025-05-22T10:00:00'
        },
        {
            id: '2',
            course: 'Vật lý đại cương',
            room: 'P.205',
            startTime: '2025-05-22T13:00:00',
            endTime: '2025-05-22T15:00:00'
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

    const recentConflicts = [
        { id: 1, type: 'Lớp học', name: 'Lớp Toán A1', time: '2023-10-15 08:00', conflictWith: 'Phòng 301 đã được đặt' },
        { id: 2, type: 'Giảng viên', name: 'TS. Nguyễn Văn A', time: '2023-10-15 09:00', conflictWith: 'Đã có lớp khác' },
        { id: 3, type: 'Phòng học', name: 'Phòng 202', time: '2023-10-14 14:00', conflictWith: 'Thiết bị đang bảo trì' },
    ];

    // Chart data
    const weeklyData = {
        labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
        values: [12, 8, 10, 9, 11, 2]
    };

    const monthlyData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
        values: [40, 35, 45, 38]
    };

    const teacherDistribution = [
        { id: 0, value: 8, label: 'Toán' },
        { id: 1, value: 5, label: 'Lý' },
        { id: 2, value: 7, label: 'Hóa' },
        { id: 3, value: 6, label: 'Văn' },
        { id: 4, value: 2, label: 'Sử' }
    ];

    const roomDistribution = [
        { id: 0, value: 6, label: 'Phòng 100-200' },
        { id: 1, value: 5, label: 'Phòng 300-400' },
        { id: 2, value: 4, label: 'Phòng Lab' }
    ];

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
                <RecentConflicts stats={stats} recentConflicts={recentConflicts} />
            </Box>
        </Box>
    );
};

export default Dashboard;