import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Divider,
    Typography,
    ListItemButton,
    useTheme,
    alpha
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    LibraryBooks as LibraryBooksIcon,
    MenuBook as MenuBookIcon,
    Class as ClassIcon,
    Groups as GroupsIcon,
    AccountBalance as AccountBalanceIcon,
    Room as RoomIcon,
    AccessTime as AccessTimeIcon,
    Logout as LogoutIcon,
    Event
} from '@mui/icons-material';

const navItems = [
    { text: 'Quản lý thời khóa biểu', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Quản lý giảng viên', icon: <PersonIcon />, path: '/lecturers' },
    { text: 'Quản lý học viên', icon: <SchoolIcon />, path: '/students' },
    { text: 'Quản lý chương trình đào tạo', icon: <LibraryBooksIcon />, path: '/programs' },
    { text: 'Quản lý học kỳ', icon: <LibraryBooksIcon />, path: '/semesters' },
    { text: 'Quản lý lịch nghỉ', icon: <Event />, path: '/braekschedules' },
    { text: 'Quản lý học phần', icon: <MenuBookIcon />, path: '/subjects' },
    { text: 'Quản lý khóa học', icon: <ClassIcon />, path: '/courses' },
    { text: 'Quản lý lớp', icon: <GroupsIcon />, path: '/class' },
    { text: 'Quản lý phòng', icon: <RoomIcon />, path: '/room' },
    { text: 'Quản lý khung giờ', icon: <AccessTimeIcon />, path: '/slottime' },
];

const drawerWidth = 350;

// The component now accepts 'open' and 'onClose' props
const NavigationDrawer = ({ open, onClose }) => {
    const theme = useTheme();
    const location = useLocation();


    return (
        <Drawer
            // Key change: variant is now 'temporary' or 'persistent'
            // 'temporary' is usually best for mobile/tablet, sliding over content.
            // 'persistent' (or 'clipped') is good for desktop, sliding alongside content.
            variant="temporary" // Change this to "persistent" if you prefer for desktop
            open={open}
            onClose={onClose} // Event handler to close the drawer
            ModalProps={{
                keepMounted: true, // Optimizes performance for mobile
            }}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    // For temporary variant, it typically overlays, so 'top' and 'height'
                    // are less critical here unless you want it specifically below AppBar.
                    // If using 'persistent', you'd keep the top/height styles as before.
                    top: 0, // Starts at the very top for temporary overlay
                    height: '100%', // Fills full height
                    borderRight: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[1],
                    overflowY: 'auto',
                },
            }}
        >
            {/* Drawer Header/Logo Area - Good place for a clickable logo to go to dashboard */}
            <Toolbar sx={{
                // Ensure this toolbar matches the height of your main AppBar
                minHeight: '64px !important', // Use !important to override if needed
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                py: 1
            }}>
                <Box
                    component={Link}
                    to="/dashboard"
                    onClick={onClose} // Close drawer when clicking logo
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    <img
                        src="https://arena.cusc.vn/logo_cusc.png" // Your logo source
                        alt="Logo"
                        style={{ height: 40, marginRight: theme.spacing(1) }}
                    />
                    <Typography variant="h6" fontWeight={700}>
                        EduSchedule
                    </Typography>
                </Box>
            </Toolbar>
            <Divider />

            <Box sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
            }}>
                <Typography variant="h6" sx={{ mb: 1, px: 1, fontWeight: 'bold' }}>
                    Quản lý Hệ thống
                </Typography>
                <Divider />

                <List disablePadding sx={{ mt: 1 }}>
                    {navItems.map((item) => (
                        <ListItem
                            key={item.path}
                            disablePadding
                            sx={{
                                backgroundColor: location.pathname === item.path
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : 'transparent',
                                borderLeft: location.pathname === item.path
                                    ? `4px solid ${theme.palette.primary.main}`
                                    : 'none',
                                borderRadius: '4px',
                                '&:not(:last-of-type)': {
                                    mb: 0.5,
                                },
                            }}
                        >
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={onClose} // This is crucial: close the drawer on navigation
                                sx={{
                                    py: 1.2,
                                    px: 2,
                                    color: location.pathname === item.path
                                        ? theme.palette.primary.main
                                        : theme.palette.text.primary,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.action.hover, 0.2),
                                        color: theme.palette.primary.main,
                                        '& .MuiListItemIcon-root': {
                                            color: theme.palette.primary.main,
                                        },
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: location.pathname === item.path
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                    },
                                    '& .MuiListItemText-primary': {
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default NavigationDrawer;