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

    // Test data for development - remove when API is working
    const testScheduleData = [
        {
            "class_schedule_id": 8,
            "semester_id": "HK1_CT01_2025",
            "class_id": "DH23CS",
            "program_id": "CT001",
            "date": "2025-08-20",
            "day": null,
            "slot_id": "S2",
            "subject_id": "MH002",
            "lecturer_id": "GV002",
            "room_id": "LT2",
            "status": "active",
            "notes": "Môn Cấu trúc dữ liệu và giải thuật",
            "lecturer": {
                "lecturer_id": "GV002",
                "name": "Trần Thị B"
            },
            "requestedRoom": {
                "room_id": "LT2",
                "room_name": "Phòng 2"
            },
            "semester": {
                "semester_id": "HK1_CT01_2025",
                "semester_name": "Học kỳ 1 năm học 2024-2025"
            },
            "class": {
                "class_id": "DH23CS",
                "class_name": "Đại học 23 Công nghệ Phần mềm"
            },
            "program": {
                "program_id": "CT001",
                "program_name": "Lập trình viên quốc tế"
            },
            "subject": {
                "subject_id": "MH002",
                "subject_name": "Foundations of Programming with C"
            }
        },
        {
            "class_schedule_id": 9,
            "semester_id": "HK1_CT02_2025",
            "class_id": "DH23CS",
            "program_id": "CT002",
            "date": "2025-08-20",
            "day": null,
            "slot_id": "C1",
            "subject_id": "MH009",
            "lecturer_id": "GV003",
            "room_id": "TH1",
            "status": "active",
            "notes": "Môn Toán rời rạc - Lý thuyết",
            "lecturer": {
                "lecturer_id": "GV003",
                "name": "Lê Minh C"
            },
            "requestedRoom": {
                "room_id": "TH1",
                "room_name": "Lab 1"
            },
            "semester": {
                "semester_id": "HK1_CT02_2025",
                "semester_name": "Học kỳ 1 năm học 2024-2025"
            },
            "class": {
                "class_id": "DH23CS",
                "class_name": "Đại học 23 Công nghệ Phần mềm"
            },
            "program": {
                "program_id": "CT002",
                "program_name": "Mỹ thuật đa phương tiện"
            },
            "subject": {
                "subject_id": "MH009",
                "subject_name": "Xử lý ảnh với Adobe Photoshop"
            }
        },
        {
            "class_schedule_id": 7,
            "semester_id": "HK1_CT01_2025",
            "class_id": "DH23CS",
            "program_id": "CT001",
            "date": "2025-08-25",
            "day": null,
            "slot_id": "S1",
            "subject_id": "MH001",
            "lecturer_id": "GV001",
            "room_id": "LT2",
            "status": "active",
            "notes": "Môn Lập trình cơ bản - Tiết đầu tuần",
            "lecturer": {
                "lecturer_id": "GV001",
                "name": "Nguyễn Văn A"
            },
            "requestedRoom": {
                "room_id": "LT2",
                "room_name": "Phòng 2"
            },
            "semester": {
                "semester_id": "HK1_CT01_2025",
                "semester_name": "Học kỳ 1 năm học 2024-2025"
            },
            "class": {
                "class_id": "DH23CS",
                "class_name": "Đại học 23 Công nghệ Phần mềm"
            },
            "program": {
                "program_id": "CT001",
                "program_name": "Lập trình viên quốc tế"
            },
            "subject": {
                "subject_id": "MH001",
                "subject_name": "Computer Fundamentals"
            }
        }
    ];

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
            setScheduleItems(testScheduleData);
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