// components/Header.js
import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar,
    useMediaQuery,
    Badge
} from '@mui/material';
import {
    AccountCircle as AccountIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';
import NotificationComponent from './NotificationComponent';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.default, 0.95)
        : alpha(theme.palette.background.paper, 0.98),
    color: theme.palette.text.primary,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    backdropFilter: 'blur(12px)',
}));

const Header = ({ onMenuToggle }) => {
    const theme = useTheme();
    const { userRole, userData, logout } = useAuth();
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const [notificationsAnchor, setNotificationsAnchor] = useState(null);
    const userMenuOpen = Boolean(userMenuAnchor);
    const notificationsOpen = Boolean(notificationsAnchor);
    const { isDarkMode, toggleTheme } = useThemeContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Giả lập dữ liệu thông báo
    const [unreadNotifications] = useState(3);

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleNotificationsOpen = (event) => {
        setNotificationsAnchor(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchor(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            handleUserMenuClose();
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    return (
        <StyledAppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{
                justifyContent: 'space-between',
                padding: theme.spacing(0, 2),
                minHeight: '70px',
            }}>
                {/* Left section - Logo and Menu Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open menu"
                            edge="start"
                            onClick={onMenuToggle}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Box
                        component={Link}
                        to="/dashboard"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing(1.5),
                            textDecoration: 'none',
                            color: 'inherit'
                        }}
                    >
                        <Avatar
                            src="https://arena.cusc.vn/logo_cusc.png"
                            alt="Logo"
                            sx={{
                                borderRadius: '8px',
                                width: 'auto',
                                height: 40,
                                backgroundColor: 'transparent'
                            }}
                        />
                        {!isMobile && (
                            <Box>
                                <Typography
                                    variant="h6"
                                    component="h1"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        background: theme.palette.mode === 'dark'
                                            ? 'linear-gradient(45deg, #90caf9, #42a5f5)'
                                            : 'linear-gradient(45deg, #1976d2, #0d47a1)',
                                        backgroundClip: 'text',
                                        textFillColor: 'transparent',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        lineHeight: 1.2
                                    }}
                                >
                                    TRUNG TÂM CÔNG NGHỆ PHẦN MỀM
                                </Typography>
                                {/* <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 500
                                    }}
                                >
                                    Hệ thống quản lý đào tạo
                                </Typography> */}
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Right section - Actions and User Menu */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(0.5)
                }}>
                    <NotificationComponent />
                    {/* User Avatar */}
                    <IconButton
                        onClick={handleUserMenuOpen}
                        size="medium"
                        sx={{
                            ml: 0.5,
                            p: 0.5,
                            border: `2px solid ${userMenuOpen ? theme.palette.primary.main : 'transparent'}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                        }}
                        aria-controls={userMenuOpen ? 'user-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={userMenuOpen ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                bgcolor: theme.palette.primary.main,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                boxShadow: theme.shadows[2]
                            }}
                            src={userData?.avatar}
                        >
                            {userData?.avatar ? null : (userData?.name?.[0]?.toUpperCase() || <AccountIcon />)}
                        </Avatar>
                    </IconButton>
                </Box>

                {/* User Menu */}
                <UserMenu
                    anchorEl={userMenuAnchor}
                    open={userMenuOpen}
                    handleClose={handleUserMenuClose}
                    handleLogout={handleLogout}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    userRole={userRole}
                    userEmail={userData?.email || ''}
                    userName={userData?.name || ''}
                    unreadNotifications={unreadNotifications}
                />

            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;