import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import './MainLayout.css';
import Header from './Header';
import Footer from './Footer';
import MainContainer from './MainContainer';
import SidebarForJustheader from './SidebarForJustheader';

const LayoutJustHeader = ({ children }) => {
    return (
        <MainContainer>
            <CssBaseline />
            <Header />
            <SidebarForJustheader />
            <Box
                sx={{
                    mt: '90px',
                    mb: '20px',
                    ml: { xs: 0, md: '240px' },
                    width: { xs: '100vw', md: 'calc(100vw - 240px)' },
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {children} {/* Render children passed from DynamicRouter */}
                <Footer />
            </Box>
        </MainContainer>
    );
};

export default LayoutJustHeader;
