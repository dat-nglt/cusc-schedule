import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './ScheduleLayout.css';
import Header from '../Header';
import ScheduleSidebar from './ScheduleSidebar';
import MainContainer from '../MainContainer';
import { ScheduleContext } from '../../../contexts/ScheduleContext';

const ScheduleLayout = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(900));

  // State muốn truyền xuống
  const [filterOption, setFilterOption] = useState("classes");
  const [filterValue, setFilterValue] = useState();

  return (
    <ScheduleContext.Provider value={{ filterOption, filterValue, setFilterValue, setFilterOption }}>
      <MainContainer>
        <CssBaseline />
        <Header />
        {!isSmallScreen && <ScheduleSidebar />}
        <Box
          sx={{
            mt: '64px',
            ml: isSmallScreen ? 0 : '350px',
            p: 2,
            flexGrow: 1
          }}
        >
          {children}
        </Box>
      </MainContainer>
    </ScheduleContext.Provider>
  );
};

export default ScheduleLayout;
