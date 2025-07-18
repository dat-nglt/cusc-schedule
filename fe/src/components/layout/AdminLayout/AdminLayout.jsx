import React from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import '../ScheduleLayout/ScheduleLayout.css';
import Header from '../Header';
import MainContainer from '../MainContainer';
import SidebarForJustAdmin from './SidebarForJustAdmin';


const AdminLayout = ({ children }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down(900)); // Màn hình < 700px

    return (
        <MainContainer>
            <CssBaseline />
            <Header />
            {!isSmallScreen && <SidebarForJustAdmin />} {/* Ẩn Sidebar khi màn hình < 700px */}
            <Box sx={{ mt: '64px', ml: isSmallScreen ? 0 : '350px', p: 2, flexGrow: 1 }}>
                {children} {/* Render children passed from DynamicRouter */}
            </Box>
        </MainContainer>
    );
};

export default AdminLayout;