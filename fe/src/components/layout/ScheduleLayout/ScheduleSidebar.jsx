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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CalendarWithWeekHighlight from './CalendarWithWeekHighlight';
import NavigationDrawer from '../NavigationDrawer';

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
  const isDashboard = location.pathname === '/dashboard';

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterValue, setFilterValue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

<<<<<<< HEAD:fe/src/components/layout/ScheduleLayout/ScheduleSidebar.jsx
  const [drawerOpen, setDrawerOpen] = useState(false);
=======
  const navItems = [
    { text: 'Quản lý thời khóa biểu', icon: <TimetableIcon />, path: '/dashboard' },
    { text: 'Quản lý giảng viên', icon: <PersonIcon />, path: '/lecturers' },
    { text: 'Quản lý học viên', icon: <SchoolIcon />, path: '/students' },
    { text: 'Quản lý chương trình đào tạo', icon: <LibraryBooksIcon />, path: '/programs' },
    { text: 'Quản lý học phần', icon: <MenuBookIcon />, path: '/subjects' },
    { text: 'Quản lý khóa học', icon: <ClassIcon />, path: '/courses' },
    { text: 'Quản lý lớp', icon: <GroupsIcon />, path: '/class' },
    { text: 'Quản lý lớp học phần', icon: <AccountBalanceIcon />, path: '/classsection' },
    { text: 'Quản lý phòng', icon: <RoomIcon />, path: '/room' },
    { text: 'Quản lý khung giờ', icon: <AccessTimeIcon />, path: '/slottime' },
    { text: 'Quản lý thông báo', icon: <CalendarIcon />, path: '/notification' },
    { text: 'Đăng xuất', icon: <LogoutIcon />, path: '/logout' },
  ];
>>>>>>> 66a1362a00eaa404f4e3cf74422769c8c72a256a:fe/src/components/layout/Sidebar.jsx

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
              placeholder="Tìm kiếm lớp, giảng viên..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filter component */}
            <Paper elevation={0} sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Bộ lọc
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filterValue}
                  onChange={handleFilterChange}
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <FilterIcon fontSize="small" />
                    </InputAdornment>
                  }
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="classes">Theo lớp học</MenuItem>
                  <MenuItem value="teachers">Theo giảng viên</MenuItem>
                  <MenuItem value="rooms">Theo phòng học</MenuItem>
                </Select>
              </FormControl>
            </Paper>

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