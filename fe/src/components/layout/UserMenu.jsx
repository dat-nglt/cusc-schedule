import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Menu, MenuItem, ListItemIcon, Avatar, Typography, Divider, Box, Switch,
    ListItemText, useTheme, alpha, Chip, IconButton, Tooltip, Badge
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
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Edit as EditIcon,
    AdminPanelSettings as AdminIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

// Menu items configuration với phân loại rõ ràng
const menuSections = {
    admin: [
        {
            section: 'Quản trị hệ thống',
            items: [
                { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
                { label: 'Quản lý Giảng viên', path: '/admin/teachers', icon: <GroupIcon /> },
                { label: 'Quản lý Học viên', path: '/admin/students', icon: <SchoolIcon /> },
                { label: 'Quản lý Khóa học', path: '/admin/courses', icon: <BookIcon /> },
                { label: 'Quản lý Phòng học', path: '/admin/rooms', icon: <HomeIcon /> },
            ]
        },
        {
            section: 'Công cụ',
            items: [
                { label: 'Tạo Thời khóa biểu', path: '/admin/generate-schedule', icon: <ScheduleIcon /> },
                { label: 'Cài đặt hệ thống', path: '/admin/settings', icon: <SettingsIcon /> },
            ]
        }
    ],
    lecturer: [
        {
            section: 'Giảng dạy',
            items: [
                { label: 'Thời khóa biểu', path: '/teacher/my-schedule', icon: <ScheduleIcon /> },
                { label: 'Lớp học của tôi', path: '/teacher/my-classes', icon: <BookIcon /> },
            ]
        },
        {
            section: 'Cá nhân',
            items: [
                { label: 'Hồ sơ giảng viên', path: '/teacher/profile', icon: <PersonIcon /> },
            ]
        }
    ],
    trainingofficer: [
        {
            section: 'Đào tạo',
            items: [
                { label: 'Dashboard', path: '/training/dashboard', icon: <DashboardIcon /> },
                { label: 'Quản lý Khóa học', path: '/training/courses', icon: <BookIcon /> },
                { label: 'Xây dựng TKB', path: '/training/build-schedule', icon: <ScheduleIcon /> },
                { label: 'Quản lý Đăng ký', path: '/training/enrollments', icon: <GroupIcon /> },
            ]
        }
    ],
    student: [
        {
            section: 'Học tập',
            items: [
                { label: 'Thời khóa biểu', path: '/student/my-schedule', icon: <ScheduleIcon /> },
                { label: 'Khóa học của tôi', path: '/student/my-courses', icon: <BookIcon /> },
            ]
        },
        {
            section: 'Cá nhân',
            items: [
                { label: 'Hồ sơ sinh viên', path: '/student/profile', icon: <PersonIcon /> },
            ]
        }
    ]
};

const UserMenu = ({
    anchorEl,
    open,
    handleClose,
    handleLogout,
    isDarkMode,
    toggleTheme,
    userRole,
    userEmail,
    userName,
    unreadNotifications = 0
}) => {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const currentMenu = menuSections[userRole] || [];
    const isCollapsed = activeSection !== null;

    // Xử lý chuyển đổi theme
    const handleThemeToggle = () => {
        // Lưu preference vào localStorage
        localStorage.setItem('darkMode', !isDarkMode);
        toggleTheme();
    };

    const getRoleInfo = () => {
        switch (userRole) {
            case 'admin': return { label: 'Quản trị viên', icon: <AdminIcon sx={{ fontSize: 14 }} />, color: 'error' };
            case 'lecturer': return { label: 'Giảng viên', icon: <SchoolIcon sx={{ fontSize: 14 }} />, color: 'primary' };
            case 'trainingofficer': return { label: 'Nhân viên đào tạo', icon: <GroupIcon sx={{ fontSize: 14 }} />, color: 'secondary' };
            case 'student': return { label: 'Học viên', icon: <PersonIcon sx={{ fontSize: 14 }} />, color: 'success' };
            default: return { label: 'Người dùng', icon: null, color: 'default' };
        }
    };

    const roleInfo = getRoleInfo();

    const handleSectionClick = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleBackToMain = () => {
        setActiveSection(null);
    };

    const isItemActive = (path) => {
        return location.pathname === path;
    };

    const renderMainMenu = () => (
        <>
            {/* User Profile Header */}
            <MenuItem dense sx={{
                pointerEvents: 'none',
                py: 2,
                px: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                borderRadius: '12px',
                mx: 1,
                mb: 1
            }}>
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        mr: 2
                    }}
                >
                    {userName?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                        {userName || 'Người dùng'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {userEmail}
                    </Typography>
                    <Chip
                        icon={roleInfo.icon}
                        label={roleInfo.label}
                        size="small"
                        color={roleInfo.color}
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                </Box>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {/* Quick Actions */}
            <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Truy cập nhanh
                </Typography>
            </Box>

            <MenuItem
                component={Link}
                to="/notifications"
                onClick={handleClose}
                sx={{
                    py: 1.5,
                    mx: 1,
                    borderRadius: '8px',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                    }
                }}
            >
                <Badge badgeContent={unreadNotifications} color="error" sx={{ mr: 2 }}>
                    <NotificationsIcon />
                </Badge>
                <ListItemText
                    primary="Thông báo"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
                <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </MenuItem>

            <MenuItem
                component={Link}
                to="/profile"
                onClick={handleClose}
                sx={{
                    py: 1.5,
                    mx: 1,
                    borderRadius: '8px',
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                }}
            >
                <PersonIcon sx={{ mr: 2 }} />
                <ListItemText
                    primary="Chỉnh sửa hồ sơ"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                />
                <EditIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            {/* Menu Sections */}
            {currentMenu.map((section, index) => (
                <Box key={index}>
                    <MenuItem
                        onClick={() => handleSectionClick(section.section)}
                        sx={{
                            py: 1.5,
                            mx: 1,
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            }
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                                {section.section}
                            </Typography>
                        </Box>
                        <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </MenuItem>
                    {index < currentMenu.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
            ))}
        </>
    );

    const renderSectionMenu = () => {
        const section = currentMenu.find(s => s.section === activeSection);
        if (!section) return null;

        return (
            <>
                <MenuItem
                    onClick={handleBackToMain}
                    sx={{
                        py: 1.5,
                        mx: 1,
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        }
                    }}
                >
                    <ChevronRightIcon sx={{ transform: 'rotate(180deg)', mr: 1 }} />
                    <ListItemText
                        primary="Quay lại"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    />
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {activeSection}
                    </Typography>
                </Box>

                {section.items.map((item, index) => (
                    <MenuItem
                        key={index}
                        component={Link}
                        to={item.path}
                        onClick={handleClose}
                        selected={isItemActive(item.path)}
                        sx={{
                            py: 1.5,
                            mx: 1,
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                            '&.Mui-selected': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                            {React.cloneElement(item.icon, {
                                sx: { fontSize: 20 }
                            })}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                        />
                    </MenuItem>
                ))}
            </>
        );
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
                elevation: 8,
                sx: {
                    width: 320,
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    mt: 1.5,
                    py: 1,
                    borderRadius: '12px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: theme.shadows[16],
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                    '& .MuiMenuItem-root': {
                        transition: 'all 0.2s ease',
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {isCollapsed ? renderSectionMenu() : renderMainMenu()}

            <Divider sx={{ my: 1 }} />

            {/* Theme Toggle và Logout */}
            <Box sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                        Giao diện
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LightModeIcon sx={{ fontSize: 18, color: isDarkMode ? 'text.secondary' : 'primary.main', mr: 1 }} />
                        <Switch
                            checked={isDarkMode}
                            onChange={handleThemeToggle}
                            size="small"
                            color="primary"
                            disabled={isLoading}
                        />
                        <DarkModeIcon sx={{ fontSize: 18, color: isDarkMode ? 'primary.main' : 'text.secondary', ml: 1 }} />
                    </Box>
                </Box>

                <MenuItem
                    onClick={handleLogout}
                    disabled={isLoading}
                    sx={{
                        py: 1.5,
                        borderRadius: '8px',
                        color: theme.palette.error.main,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    />
                </MenuItem>
            </Box>
        </Menu>
    );
};

export default UserMenu;