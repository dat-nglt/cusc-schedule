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
    Badge
} from '@mui/material';
import {
    Add as AddIcon,
    FileDownload as ExportIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Warning
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backdropFilter: 'blur(8px)',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
}));

const Header = ({ onMenuToggle, pageTitle = 'Quản Lý Thời Khoá Biều - CUSC' }) => {
    const theme = useTheme();
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

    return (
        <StyledAppBar position="fixed" sx={{ zIndex: 10000 }}>
            <Toolbar sx={{
                justifyContent: 'space-between',
                padding: theme.spacing(0, 2),
                backgroundColor: theme.palette.primary.main,
                minHeight: '64px',
            }}>
                {/* Left section - Logo and Menu Button */}
                <Box sx={{
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
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            EduSchedule - CUSC
                        </Typography>
                    </Box>
                </Box>

                {/* Right section - Actions and User Menu */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing(1)
                }}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2,
                            mr: 1,
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        Tạo lịch
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ExportIcon />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 2,
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        Xuất báo cáo
                    </Button>

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
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            minWidth: 300,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem dense sx={{ pointerEvents: 'none' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Thông báo mới (3)</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <Warning fontSize="small" color="error" />
                        </ListItemIcon>
                        Xung đột lịch dạy - Toán A1
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <Warning fontSize="small" color="warning" />
                        </ListItemIcon>
                        Phòng 301 bảo trì
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <AccountIcon fontSize="small" color="info" />
                        </ListItemIcon>
                        Giảng viên mới đăng ký
                    </MenuItem>
                    <Divider />
                    <MenuItem sx={{ justifyContent: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Xem tất cả thông báo
                        </Typography>
                    </MenuItem>
                </Menu>

                {/* User Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem dense sx={{ pointerEvents: 'none' }}>
                        <Typography variant="subtitle2" fontWeight="bold">admin@eduschedule.edu.vn</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <AccountIcon fontSize="small" />
                        </ListItemIcon>
                        Hồ sơ cá nhân
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        Cài đặt
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;