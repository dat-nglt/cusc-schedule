import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    CircularProgress,
    Divider,
} from '@mui/material';
import StudentInfo from './StudentInfo';
import AcademicFilter from './AcademicFilter';
import ResultsTable from './ResultsTable';
import PerformanceComparison from './PerformanceComparison';
import AcademicFilterAndActions from './AcademicFilter';
import { useAuth } from '../../contexts/AuthContext';
const StudentLearningResults = () => {
    const [semester, setSemester] = useState('');
    const [academicYear, setAcademicYear] = useState('');
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [results, setResults] = useState([]);
    const { userData } = useAuth();

    const handleViewResults = () => {
        console.log('cần thiết kế logic để lấy kết quả học tập theo năm học và học kỳ');
    }

    // Mock data - Thay thế bằng API thực tế
    useEffect(() => {
        const fetchData = async () => {
            // Giả lập thời gian load API
            const mockStudentData = {
                id: userData.code,
                name: userData.name,
                avatar: '/path/to/avatar.jpg',
                program: 'Lập trình viên Quốc tế',
                birthday: userData.day_of_birth,
                class: userData.class,
                faculty: "Công nghệ thông tin",
                enrollmentYear: 2021,
                gpa: 3.2,
                creditsCompleted: 45,
                creditsTotal: 120
            };

            const mockResults = [
                { code: 'CT101', name: 'Lập trình Cơ bản', credit: 3, midterm: 8.5, final: 7.5, average: 7.8, status: 'Đạt' },
                { code: 'CT102', name: 'Cấu trúc dữ liệu', credit: 4, midterm: 7.0, final: 8.0, average: 7.6, status: 'Đạt' },
                { code: 'CT103', name: 'Cơ sở dữ liệu', credit: 3, midterm: 6.5, final: 7.0, average: 6.8, status: 'Đạt' },
                { code: 'CT104', name: 'Lập trình Web', credit: 4, midterm: 8.0, final: 8.5, average: 8.3, status: 'Đạt' },
            ];

            setStudentData(mockStudentData);
            setResults(mockResults);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

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
                {/* Header */}
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
                            KẾT QUẢ HỌC TẬP
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Student Info */}
                <StudentInfo studentData={studentData} />

                {/* Summary */}
                <PerformanceComparison
                    studentStats={{
                        coursesTaken: 12,
                        creditsCompleted: 45,
                        creditsTotal: 120,
                        gpa: 3.2,
                        ranking: 'Khá'
                    }}
                    classAverages={[
                        { name: 'Toán cao cấp', credits: 3, studentScore: 7.5, classAverage: 6.8 },
                        { name: 'Vật lý đại cương', credits: 4, studentScore: 6.2, classAverage: 6.5 },
                        { name: 'Hóa học cơ bản', credits: 2, studentScore: 8.1, classAverage: 7.3 }
                    ]}
                />

                {/* Filter Controls */}
                <AcademicFilterAndActions
                    academicYear={academicYear}
                    setAcademicYear={setAcademicYear}
                    semester={semester}
                    setSemester={setSemester}
                    onViewResults={handleViewResults}
                />
                {/* Results Table */}
                <ResultsTable data={results} />

            </Box >
        </>

    );
};

export default StudentLearningResults;