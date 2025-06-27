
import React from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './ScheduleLayout.css';
import Header from '../Header';
import ScheduleSidebar from './ScheduleSidebar';
import MainContainer from '../MainContainer';

const ScheduleLayout = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(900)); // Màn hình < 700px

  return (
    <MainContainer>
      <CssBaseline />
      <Header />
      {!isSmallScreen && <ScheduleSidebar />} {/* Ẩn Sidebar khi màn hình < 700px */}
      <Box sx={{ mt: '64px', ml: isSmallScreen ? 0 : '350px', p: 2, flexGrow: 1 }}>
        {children} {/* Render children passed from DynamicRouter */}
      </Box>
    </MainContainer>
  );
};

export default ScheduleLayout;