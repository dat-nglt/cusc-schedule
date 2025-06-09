import {
    Grid, Card, CardHeader, CardContent, Avatar, Typography,
    Button, Chip, Box,
    Divider,
} from '@mui/material';
import {
    School, Assessment,
    Book, Assignment, BarChart, PieChart,
} from '@mui/icons-material';
import CreditProgress from './CreditProgress';
import LearningSection from './LearningSection';
import SubjectGPAChart from './SubjectGPAChart';
import Features from './Features';
import StudentProfile from './StudentProfile';
import DashboardGrid from './DashboardGrid';
import StudentSidebar from '../../components/layout/SidebarForJustheader';




const StudentDashboard = () => {
    // const theme = useTheme();

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
        { icon: <Assessment fontSize="small" />, name: 'Kết quả', path: '/student/results' },
        { icon: <Book fontSize="small" />, name: 'CTĐT', path: '/student/curriculum' },
        { icon: <Assignment fontSize="small" />, name: 'Đăng ký', path: '/student/registration' },
        { icon: <School fontSize="small" />, name: 'Lịch học', path: '/student/schedule' },
        { icon: <BarChart fontSize="small" />, name: 'Thống kê', path: '/student/statistics' },
        { icon: <PieChart fontSize="small" />, name: 'Tốt nghiệp', path: '/student/graduation' }
    ];

    return (
        <>
            <Box sx={{
                p: 2,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                gap: 2,
                width: '97%'

            }}>
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
                            THÔNG TIN SINH VIÊN
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Profile and Notifications */}
                <StudentProfile studentInfo={sampleStudentInfo} />

                {/* Features */}
                <Features features={features} />

                {/* Charts */}
                <DashboardGrid />
            </Box>
        </>

    );
};

export default StudentDashboard;