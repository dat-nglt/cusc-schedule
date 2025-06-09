import React, { useState } from 'react';
import {
    Grid,
    Box,
    Tabs,
    Tab,
    useMediaQuery,
    useTheme,
    IconButton,
    Menu,
    MenuItem,
    Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SubjectGPAChart from './SubjectGPAChart';
import CreditProgress from './CreditProgress';
import LearningSection from './LearningSection';

const DashboardGrid = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // const handleMenuClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleMenuClose = () => {
    //     setAnchorEl(null);
    // };

    // const handleMenuItemClick = (index) => {
    //     setActiveTab(index);
    //     handleMenuClose();
    // };

    // Sample data
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

    const learningData = [
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
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Desktop Tabs - only shows on larger screens */}
            {isMobile && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 4,
                            }
                        }}
                    >
                        <Tab label="GPA Chart" />
                        <Tab label="Credit Progress" />
                        <Tab label="Learning Section" />
                    </Tabs>
                </Box>
            )}

            {/* Grid Content */}
            <Grid container spacing={4} >
                {/* Always show on desktop, conditionally on mobile */}
                <Grid item xs={12} md={6} sx={{
                    display: isMobile ? (activeTab === 0 ? 'block' : 'none') : 'block', flex: 1
                }}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <SubjectGPAChart data={sampleData} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4} sx={{
                    display: isMobile ? (activeTab === 1 ? 'block' : 'none') : 'block',
                    flex: isMobile ? (activeTab === 1 ? 1 : 'none') : 'none',
                }}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <CreditProgress progress={75} completed={120} total={160} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4} sx={{
                    display: isMobile ? (activeTab === 2 ? 'block' : 'none') : 'block', flex: 1
                }}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <LearningSection
                            semester="2024-2025 HK3"
                            data={learningData}
                            showTotal={true}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardGrid;