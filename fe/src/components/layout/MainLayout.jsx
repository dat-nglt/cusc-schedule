
import React from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './MainLayout.css';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContainer from './MainContainer';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(700)); // Màn hình < 700px

  return (
    <MainContainer>
      <CssBaseline />
      <Header />
      {!isSmallScreen && <Sidebar />} {/* Ẩn Sidebar khi màn hình < 700px */}
      <Box sx={{ mt: '64px' }}>
        {children} {/* Render children passed from DynamicRouter */}
      </Box>
    </MainContainer>
  );
};

export default MainLayout;
