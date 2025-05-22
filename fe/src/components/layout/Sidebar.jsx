import React, { useState } from 'react';
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
  Select
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
  Add as AddIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import DateSelector from '../../pages/Dashboard/DateSelector';
import CalendarWithWeekHighlight from './CalendarWithWeekHighlight';

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

const Sidebar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterValue, setFilterValue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Hồ sơ', icon: <PersonIcon />, path: '/profile' },
    { text: 'Thời khóa biểu', icon: <TimetableIcon />, path: '/timetable' },
    { text: 'Đăng xuất', icon: <LogoutIcon />, path: '/logout' }
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleWeekChange = ({ start, end }) => {
    console.log('Tuần được chọn:', start, end);
    // Gọi API hoặc cập nhật dữ liệu theo tuần mới
  };

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
        {/* Tạo lịch button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            mb: 2,
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Tạo thời khóa biểu
        </Button>

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

        <Divider sx={{ my: 1 }} />

        {/* Navigation menu */}
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.text}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'action.hover'
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: '36px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 'medium'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;