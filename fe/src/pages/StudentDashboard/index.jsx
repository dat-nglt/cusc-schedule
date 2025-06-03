import {
    Grid, Card, CardHeader, CardContent, Avatar, Typography,
    Button, Chip, Box, useTheme, alpha, IconButton
} from '@mui/material';
import {
    School, Notifications, CalendarToday, Assessment,
    Book, Assignment, BarChart, PieChart, Person, Edit, MoreVert
} from '@mui/icons-material';
import React from 'react';
import CreditProgress from './CreditProgress';
import AcademicPerformanceChart from './SubjectGPAChart';
import LearningSection from './LearningSection';
import SubjectGPAChart from './SubjectGPAChart';
import Features from './Features';
import StudentProfile from './StudentProfile';

const sampleData = [
    {
        subjectName: "Toán cao cấp",
        gpa: 3.2,
        credits: 3,
        semester: "2023-2024 HK1"
    },
    {
        subjectName: "Lập trình hướng đối tượng",
        gpa: 3.8,
        credits: 4,
        semester: "2023-2024 HK1"
    },
    {
        subjectName: "Cơ sở dữ liệu",
        gpa: 2.7,
        credits: 3,
        semester: "2023-2024 HK2"
    }
];


const StudentDashboard = () => {
    const theme = useTheme();

    const sampleStudentInfo = {
        name: "Nguyễn Lê Tấn Đạt",
        id: "SV20230001",
        class: "KTPM0121",
        major: "Kỹ thuật phần mềm",
        email: "nguyenvana@university.edu",
        gender: "Nam",
        dob: "15/03/2000",
        phone: "0987654321",
        ethnicity: "Kinh",
        religion: "Không",
        nationality: "Việt Nam",
        region: "Khu vực 1",
        cccd: "091203003164",
        issuedDate: "17/04/2021",
        issuedPlace: "Tỉnh An Giang",
        unionJoinDate: "26/03/2019",
        partyJoinDate: "", // chưa có
        contactAddress: "TT. Óc Eo, Thoại Sơn, An Giang",
        placeOfBirth: "Tỉnh An Giang",
        permanentAddress: "Óc Eo, Thoại Sơn, An Giang",
        bankName: "Vietcombank",
        bankBranch: "",
        bankAccountHolder: "",
        bankAccountNumber: "1025004053",
        trainingLevel: "Chính quy",
        unreadNotifications: 3,
        upcomingEvents: 2,
        currentCourses: 5,
        earnedCredits: 120,
        totalCredits: 150
    };



    const features = [
        { icon: <Assessment fontSize="small" />, name: 'Kết quả' },
        { icon: <Book fontSize="small" />, name: 'CTĐT' },
        { icon: <Assignment fontSize="small" />, name: 'Đăng ký' },
        { icon: <School fontSize="small" />, name: 'Lịch học' },
        { icon: <BarChart fontSize="small" />, name: 'Thống kê' },
        { icon: <PieChart fontSize="small" />, name: 'Tốt nghiệp' }
    ];

    return (
        <Box sx={{ p: 2, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 2, width: '70vw', mt: '20px' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    Hệ thống đào tạo
                </Typography>
                <Chip
                    label={new Date().toLocaleDateString('vi-VN')}
                    size="small"
                />
            </Box>

            {/* Profile and Notifications */}
            <StudentProfile studentInfo={sampleStudentInfo} />

            {/* Features */}
            <Features features={features} />

            {/* Charts */}
            <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={6} flex={1}>
                    <SubjectGPAChart data={sampleData} />

                </Grid>
                <Grid item xs={12} md={4}>
                    <CreditProgress progress={75} completed={120} total={160} />
                </Grid>
                <Grid item xs={12} md={4} flex={1}>
                    <LearningSection
                        semester="2024-2025 HK3"
                        data={[
                            {
                                subjectCode: "010100255801",
                                subjectName: "Thực tập tốt nghiệp Kỹ thuật phần mềm",
                                credits: 10,
                                semester: "2024-2025 HK3"
                            },
                            {
                                subjectCode: "CT173",
                                subjectName: "Phát triển phần mềm mã nguồn mở",
                                credits: 3,
                                semester: "2024-2025 HK3"
                            }
                        ]}
                        showTotal={true}
                    />                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentDashboard;