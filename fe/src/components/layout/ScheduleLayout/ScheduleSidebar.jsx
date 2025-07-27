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
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <FilterIcon
                  fontSize="small"
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 1
                  }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  color="text.primary"
                >
                  Bộ lọc dữ liệu
                </Typography>
              </Box>

              <FormControl fullWidth>
                <Select
                  value={filterValue}
                  onChange={handleFilterChange}
                  size="small"
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.divider,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.light,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '1px',
                    },
                    '& .MuiSelect-select': {
                      py: 1.25,
                      pl: 1.5,
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        mt: 1,
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1,
                          fontSize: '0.875rem',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          },
                          '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.16),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.24),
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem
                    value="all"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:before': {
                        content: '""',
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '2px',
                        backgroundColor: theme.palette.primary.main,
                        mr: 1.5
                      }
                    }}
                  >
                    Tất cả
                  </MenuItem>
                  <MenuItem
                    value="classes"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:before': {
                        content: '""',
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '2px',
                        backgroundColor: theme.palette.secondary.main,
                        mr: 1.5
                      }
                    }}
                  >
                    Theo lớp học
                  </MenuItem>
                  <MenuItem
                    value="teachers"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:before': {
                        content: '""',
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '2px',
                        backgroundColor: theme.palette.info.main,
                        mr: 1.5
                      }
                    }}
                  >
                    Theo giảng viên
                  </MenuItem>
                  <MenuItem
                    value="rooms"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:before': {
                        content: '""',
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '2px',
                        backgroundColor: theme.palette.warning.main,
                        mr: 1.5
                      }
                    }}
                  >
                    Theo phòng học
                  </MenuItem>
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