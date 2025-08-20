import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import '../ScheduleLayout/ScheduleLayout.css';
import Header from '../Header';
import Footer from '../Footer';
import MainContainer from '../MainContainer';
import SidebarJustForStudent from './SidebarJustForStudent';

const StudentLayout = ({ children }) => {
    return (
        <MainContainer>
            <CssBaseline />
            <Header />
            <SidebarJustForStudent />
            <Box
                sx={{
                    mt: '90px',
                    mb: '20px',
                    ml: { xs: 0, md: '300px' },
                    width: { xs: '100vw', md: 'calc(100vw - 300px)' },
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

export default StudentLayout;
