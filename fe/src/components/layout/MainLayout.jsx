import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import './MainLayout.css';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContainer from './MainContainer';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <MainContainer>
            <CssBaseline />
            <Header />
            <Sidebar />
            <Box sx={{ mt: '64px', ml: '350px' }}>
                {children} {/* Render children passed from DynamicRouter */}
            </Box>
        </MainContainer>
    );
};

export default MainLayout;
