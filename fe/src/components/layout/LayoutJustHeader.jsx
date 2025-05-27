import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import './MainLayout.css';
import Header from './Header';
import MainContainer from './MainContainer';

const LayoutJustHeader = ({ children }) => {
    return (
        <MainContainer>
            <CssBaseline />
            <Header />
            <Box sx={{ mt: '64px', m: '0 auto' }}>
                {children} {/* Render children passed from DynamicRouter */}
            </Box>
        </MainContainer>
    );
};

export default LayoutJustHeader;
