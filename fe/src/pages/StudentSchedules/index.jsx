import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, Paper, useTheme, useMediaQuery, Divider } from '@mui/material';
import WeeklyCalendarForStudent from './WeeklyCalendarForStudent';
import ScheduleFilterBar from './ScheduleFilterBar';
import StudentDashboardSidebar from './StudentDashboardSidebar';
import { getClassScheduleForStudentService } from '../../api/classschedule';
import { useAuth } from '../../contexts/AuthContext';
import { set } from 'date-fns';

function StudentSchedules() {
    const { userData } = useAuth();
    const [scheduleItems, setScheduleItems] = useState([]);

    const fetchClassScheduleForStudent = useCallback(async () => {
        try {
            const studentId = userData.code;
            const response = await getClassScheduleForStudentService(studentId);
            if (!response) {
                throw new Error("Không có dữ liệu thời khóa biểu");
            }
            console.log("Raw API response:", response.data);
            setScheduleItems(response.data || []);
        } catch (error) {
            console.error("Error fetching class schedule for student:", error);
            // For development - use test data when API fails
            console.log("Using test data for development");
            setScheduleItems([]);
        }
    }, [userData.code]);
    useEffect(() => {
        if (userData?.code) {
            fetchClassScheduleForStudent();
        }
    }, [userData?.code, fetchClassScheduleForStudent]); // Fix dependency
    console.log("Schedule Items:", scheduleItems);

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