import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, useTheme, useMediaQuery, Divider } from '@mui/material';
import WeeklyCalendarForStudent from './WeeklyCalendarForStudent';
import ScheduleFilterBar from './ScheduleFilterBar';
import StudentDashboardSidebar from './StudentDashboardSidebar';



function StudentSchedules() {

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


    const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Dùng để điều chỉnh layout trên mobile/tablet
    const handleAddNew = () => {
        // Logic để thêm lịch học mới
        console.log('Thêm lịch học mới');
    };

    return (
        <Box sx={{
            p: 2,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 1,
            gap: 2,
            width: '97%'
        }}>
            {/* Header Section: Title and Current Date */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                borderRadius: 2,
                bgcolor: 'background.default',
                mb: 1,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        width: 6,
                        height: 32,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        mr: 1
                    }} />
                    <Typography color='primary' variant="h5" fontWeight="bold" textTransform="uppercase" sx={{ letterSpacing: 1 }}>
                        LỊCH HỌC CÁ NHÂN
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Main Content Grid */}
            <Box sx={{
                p: { xs: 1, sm: 2 },
                pb: 4,
                bgcolor: theme.palette.background.default,
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'column' },
                        gap: { xs: 2, md: 3 },
                        alignItems: 'flex-start',
                    }}
                >
                    {/* Left Sidebar for Filters and Overview */}
                    <StudentDashboardSidebar />

                    {/* Main Calendar Area */}
                    <Box
                        sx={{
                            width: '100%'

                        }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <ScheduleFilterBar />
                        </Box>
                        <Paper elevation={2} sx={{ p: { xs: 1, sm: 2 }, borderRadius: 2 }}>
                            <WeeklyCalendarForStudent
                                initialDate={new Date()}
                                scheduleItems={scheduleItems}
                                onAddNew={handleAddNew}
                            />
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default StudentSchedules;