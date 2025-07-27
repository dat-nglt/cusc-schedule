import React from 'react';
import { Link } from 'react-router-dom';
import {
    Menu, MenuItem, ListItemIcon, Avatar, Typography, Divider, Box, Switch,
    ListItemText, useTheme, alpha
} from '@mui/material';
import {
    Logout as LogoutIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Home as HomeIcon,
    Dashboard as DashboardIcon,
    School as SchoolIcon,
    Group as GroupIcon,
    Schedule as ScheduleIcon,
    Book as BookIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';

// Menu items configuration (same as before)
const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Quản lý Giảng viên', path: '/admin/teachers', icon: <GroupIcon fontSize="small" /> },
    { label: 'Quản lý Học viên', path: '/admin/students', icon: <SchoolIcon fontSize="small" /> },
    { label: 'Quản lý Khóa học', path: '/admin/courses', icon: <BookIcon fontSize="small" /> },
    { label: 'Quản lý Phòng học', path: '/admin/rooms', icon: <HomeIcon fontSize="small" /> },
    { label: 'Tạo Thời khóa biểu', path: '/admin/generate-schedule', icon: <ScheduleIcon fontSize="small" /> },
    { label: 'Cài đặt hệ thống', path: '/admin/settings', icon: <SettingsIcon fontSize="small" /> },
];

const teacherMenuItems = [
    { label: 'Thời khóa biểu của tôi', path: '/teacher/my-schedule', icon: <ScheduleIcon fontSize="small" /> },
    { label: 'Lớp học của tôi', path: '/teacher/my-classes', icon: <BookIcon fontSize="small" /> },
    { label: 'Thông tin cá nhân', path: '/teacher/profile', icon: <PersonIcon fontSize="small" /> },
];

const trainingStaffMenuItems = [
    { label: 'Dashboard Đào tạo', path: '/training/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Quản lý Khóa học', path: '/training/courses', icon: <BookIcon fontSize="small" /> },
    { label: 'Xây dựng Thời khóa biểu', path: '/training/build-schedule', icon: <ScheduleIcon fontSize="small" /> },
    { label: 'Quản lý Đăng ký', path: '/training/enrollments', icon: <GroupIcon fontSize="small" /> },
];

const studentMenuItems = [
    { label: 'Thời khóa biểu của tôi', path: '/student/my-schedule', icon: <ScheduleIcon fontSize="small" /> },
    { label: 'Khóa học của tôi', path: '/student/my-courses', icon: <BookIcon fontSize="small" /> },
    { label: 'Thông tin cá nhân', path: '/student/profile', icon: <PersonIcon fontSize="small" /> },
];

const UserMenu = ({ anchorEl, open, handleClose, handleLogout, isDarkMode, toggleTheme, userRole, userEmail }) => {
    const theme = useTheme();

    // Select menu items based on user role
    let currentMenuItems = [];
    switch (userRole) {
        case 'admin': currentMenuItems = adminMenuItems; break;
        case 'lecturer': currentMenuItems = teacherMenuItems; break;
        case 'trainingofficer': currentMenuItems = trainingStaffMenuItems; break;
        case 'student': currentMenuItems = studentMenuItems; break;
        default: currentMenuItems = [];
    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 8,
                sx: {
                    minWidth: 250,
                    overflow: 'visible',
                    mt: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: theme.shadows[16],
                    '& .MuiMenuItem-root': {
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        mx: 1,
                        my: 0.25,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiListItemIcon-root': {
                                color: theme.palette.primary.main,
                            }
                        },
                        '&.Mui-selected': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        }
                    },
                    '& .MuiDivider-root': {
                        my: 1,
                    },
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        mr: 1.5,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {/* User Profile Section */}
            <MenuItem dense sx={{ pointerEvents: 'none', py: 1.5 }}>
                <Avatar
                    alt="User Avatar"
                    src="/static/images/avatar/1.jpg"
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText
                    }}
                />
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                        {userEmail || 'Tài khoản người dùng'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {userRole === 'admin' && 'Quản trị viên'}
                        {userRole === 'lecturer' && 'Giảng viên'}
                        {userRole === 'trainingofficer' && 'Nhân viên đào tạo'}
                        {userRole === 'student' && 'Học viên'}
                    </Typography>
                </Box>
            </MenuItem>

            <Divider variant="middle" sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />

            {/* Menu Items */}
            {currentMenuItems.map((item, index) => (
                <MenuItem
                    key={index}
                    component={Link}
                    to={item.path}
                    sx={{
                        '&:active': {
                            transform: 'scale(0.98)',
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        {React.cloneElement(item.icon, {
                            sx: { color: theme.palette.text.secondary }
                        })}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ variant: 'body2' }}
                    />
                </MenuItem>
            ))}

            <Divider variant="middle" sx={{ borderColor: alpha(theme.palette.divider, 0.05) }} />

            {/* Theme Toggle */}
            <MenuItem dense sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                    {isDarkMode ? (
                        <LightModeIcon fontSize="small" sx={{ color: theme.palette.warning.light }} />
                    ) : (
                        <DarkModeIcon fontSize="small" />
                    )}
                </ListItemIcon>
                <ListItemText
                    primary={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                    primaryTypographyProps={{ variant: 'body2' }}
                />
                <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    size="small"
                    color={isDarkMode ? 'warning' : 'default'}
                    sx={{
                        ml: 1,
                        '& .MuiSwitch-thumb': {
                            boxShadow: theme.shadows[1],
                        },
                    }}
                />
            </MenuItem>

            {/* Logout */}
            <MenuItem
                onClick={handleLogout}
                sx={{
                    color: theme.palette.error.main,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                    }
                }}
            >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                    primary="Đăng xuất"
                    primaryTypographyProps={{ variant: 'body2' }}
                />
            </MenuItem>
        </Menu>
    );
}

export default UserMenu;