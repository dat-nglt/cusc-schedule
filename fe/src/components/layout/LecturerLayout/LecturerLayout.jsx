import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
import MainContainer from '../MainContainer';
import SidebarJustForLecturer from './SidebarJustForLecturer';

const LecturerLayout = ({ children }) => {
  return (
    <MainContainer>
      <CssBaseline />
      <Header />
      <SidebarJustForLecturer />
      <Box
        sx={{
          mt: '90px',
          mb: '20px',
          ml: { xs: 0, md: '350px' },
          width: { xs: '100vw', md: 'calc(100vw - 350px)' },
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
        <Footer />
      </Box>
    </MainContainer>
  );
};

export default LecturerLayout;