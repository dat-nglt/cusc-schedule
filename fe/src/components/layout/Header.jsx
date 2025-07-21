import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Badge,
    Switch,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    FileDownload as ExportIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Warning,
    LightMode,
    DarkMode,
    WarningAmber,
    Construction,
    PersonAdd,
    ArrowForward
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(8px)',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
}));

const Header = ({ onMenuToggle }) => {
    const theme = useTheme();
    const { logout, userRole } = useAuth();
    const { isDarkMode, toggleTheme } = useThemeContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // State for dropdown menus
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const notificationsOpen = Boolean(notificationsAnchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationsClick = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setNotificationsAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            logout()
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    }

    return (
        <StyledAppBar position="fixed" sx={{ zIndex: 10000 }}>
            <Toolbar sx={{
                justifyContent: 'space-between',
                padding: theme.spacing(0, 2),
                backgroundColor: theme.palette.primary.main,
                minHeight: '64px',
            }}>
                {/* Left section - Logo and Menu Button */}
                <Box
                    component={Link}
                    to="/dashboard"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing(2)
                    }}>
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

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}>
                        <Avatar
                            src="https://arena.cusc.vn/logo_cusc.png"
                            alt="Logo"
                            sx={{
                                borderRadius: '0',
                                width: 'fit-content',
                                height: 36,
                                mr: 1,
                                backgroundColor: theme.palette.primary.main
                            }}
                        />
                        <Typography
                            variant="h6"
                            component="h1"
                            color="secondary"
                            sx={{
                                fontWeight: 700,
                                display: { xs: 'none', sm: 'block' },
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' // 👈 thêm bóng chữ
                            }}
                        >
                            TRUNG TÂM CÔNG NGHỆ PHẦN MỀM - ĐẠI HỌC CẦN THƠ
                        </Typography>

                    </Box>
                </Box>



                {/* Right section - Actions and User Menu */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1)
                }}>
                    <IconButton
                        size="large"
                        aria-label="show notifications"
                        color="inherit"
                        onClick={handleNotificationsClick}
                        sx={{ ml: 1 }}
                    >
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 1 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: theme.palette.primary.main
                            }}
                        >
                            <AccountIcon />
                        </Avatar>
                    </IconButton>
                </Box>

                {/* Notifications Menu */}
                <Menu
                    anchorEl={notificationsAnchorEl}
                    open={notificationsOpen}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 8,
                        sx: {
                            minWidth: 360,
                            maxHeight: 480,
                            overflow: 'hidden',
                            mt: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: theme.shadows[16],
                            '& .MuiMenuItem-root': {
                                py: 1.5,
                                px: 2,
                                mx: 1,
                                my: 0.25,
                                borderRadius: 1,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                                '&.Mui-selected': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                }
                            },
                            '& .MuiDivider-root': {
                                my: 1,
                                borderColor: alpha(theme.palette.divider, 0.08),
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {/* Header */}
                    <MenuItem dense sx={{
                        pointerEvents: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1.5,
                    }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Thông báo
                        </Typography>
                        <Chip
                            label="3 mới"
                            size="small"
                            color="primary"
                            sx={{
                                height: 20,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                            }}
                        />
                    </MenuItem>

                    <Divider />

                    {/* Notification Items */}
                    <MenuItem sx={{ alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{
                            minWidth: 40,
                            mt: 0.5
                        }}>
                            <WarningAmber
                                fontSize="small"
                                sx={{
                                    color: theme.palette.error.main,
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    borderRadius: '50%',
                                    p: 0.5,
                                }}
                            />
                        </ListItemIcon>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                                Xung đột lịch dạy
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                Môn Toán A1 trùng lịch với Lý B2
                            </Typography>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                mt: 0.5,
                                color: theme.palette.primary.main,
                            }}>
                                10 phút trước
                            </Typography>
                        </Box>
                    </MenuItem>

                    <MenuItem sx={{ alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{
                            minWidth: 40,
                            mt: 0.5
                        }}>
                            <Construction
                                fontSize="small"
                                sx={{
                                    color: theme.palette.warning.main,
                                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                    borderRadius: '50%',
                                    p: 0.5,
                                }}
                            />
                        </ListItemIcon>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                                Bảo trì phòng học
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                Phòng 301 sẽ đóng cửa để bảo trì từ 15/10
                            </Typography>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                mt: 0.5,
                                color: theme.palette.primary.main,
                            }}>
                                2 giờ trước
                            </Typography>
                        </Box>
                    </MenuItem>

                    <MenuItem sx={{ alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{
                            minWidth: 40,
                            mt: 0.5
                        }}>
                            <PersonAdd
                                fontSize="small"
                                sx={{
                                    color: theme.palette.info.main,
                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                    borderRadius: '50%',
                                    p: 0.5,
                                }}
                            />
                        </ListItemIcon>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                                Giảng viên mới
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                TS. Nguyễn Văn A đã đăng ký tài khoản
                            </Typography>
                            <Typography variant="caption" sx={{
                                display: 'block',
                                mt: 0.5,
                                color: theme.palette.primary.main,
                            }}>
                                Hôm qua
                            </Typography>
                        </Box>
                    </MenuItem>

                    <Divider />

                    {/* Footer */}
                    <MenuItem sx={{
                        justifyContent: 'center',
                        py: 1,
                        '&:hover': {
                            backgroundColor: 'transparent',
                        }
                    }}>
                        <Button
                            variant="text"
                            size="small"
                            color="primary"
                            endIcon={<ArrowForward fontSize="small" />}
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                textTransform: 'none',
                            }}
                        >
                            Xem tất cả thông báo
                        </Button>
                    </MenuItem>
                </Menu>

                {/* User Menu */}
                <UserMenu
                    anchorEl={anchorEl}
                    open={open}
                    handleClose={handleClose}
                    handleLogout={handleLogout}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    userRole={userRole}
                    // userEmail={userEmail}
                    userEmail={"Tài khoản người dùng"} // Thay thế bằng email thực tế nếu có
                />
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;