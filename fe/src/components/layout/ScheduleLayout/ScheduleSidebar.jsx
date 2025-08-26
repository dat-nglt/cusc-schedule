import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Typography,
  IconButton,
  Paper,
  MenuItem,
  FormControl,
  Select,
  Switch,
  Menu,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Schedule as TimetableIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  MenuBook as MenuBookIcon,
  Class as ClassIcon,
  AccessTime as AccessTimeIcon,
  LibraryBooks as LibraryBooksIcon,
  Room as RoomIcon,
  AccountBalance as AccountBalanceIcon,
  Close,
} from '@mui/icons-material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import CalendarWithWeekHighlight from './CalendarWithWeekHighlight';
import NavigationDrawer from '../NavigationDrawer';
import FilterComponent from './FilterComponent';

const drawerWidth = 350;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  mt: '70px',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: 'none',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1]
  },
}));

const ScheduleSidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isDashboard = location.pathname === '/dashboard';

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterValue, setFilterValue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  // Handlers for drawer
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // const handleWeekChange = ({ start, end }) => {
  //   console.log('Tuần được chọn:', start, end);
  //   // Gọi API hoặc cập nhật dữ liệu theo tuần mới
  // };

  return (
    <StyledDrawer variant="permanent">
      <Toolbar />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: 2,
        gap: 2
      }}>
        {isDashboard && (
          <>
            {/* Tạo lịch button */}
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Tạo thời khóa biểu
            </Button> */}

            {/* Search component */}
            <TextField
              placeholder="Tìm kiếm lớp học, giảng viên..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: theme.palette.background.paper,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.background.paper,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '1px',
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }
                },
                '& .MuiOutlinedInput-input': {
                  py: '10px',
                  px: '12px',
                  fontSize: '0.875rem'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1, color: 'text.secondary' }}>
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => handleSearchChange({ target: { value: '' } })}
                    sx={{
                      mr: 0.5,
                      color: 'text.disabled',
                      '&:hover': {
                        color: 'text.secondary'
                      }
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )
              }}
            />

            {/* Filter component */}
            <FilterComponent />

            {/* Calendar component */}
            <CalendarWithWeekHighlight />
            <Button
              variant="contained"
              color="primary"
              startIcon={<DashboardIcon />}
              onClick={handleDrawerOpen} // Call the drawer open handler
              fullWidth
              sx={{
                mb: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Quản lý hệ thống
            </Button>
            <NavigationDrawer open={drawerOpen} onClose={handleDrawerClose} />
          </>
        )}

      </Box>
    </StyledDrawer>
  );
};

export default ScheduleSidebar;