import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    Box,
    Typography,
    alpha,
    styled,
    ListItemButton
} from '@mui/material';
import {
    School,
    Person,
    LibraryBooks,
    MenuBook,
    Class,
    Groups,
    AccountBalance,
    Room,
    AccessTime,
    Logout,
    Dashboard,
    Event
} from '@mui/icons-material';

const navItems = [
    { text: 'Quản lý thời khóa biểu', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Quản lý giảng viên', icon: <Person />, path: '/lecturers' },
    { text: 'Quản lý học viên', icon: <School />, path: '/students' },
    { text: 'Quản lý lịch nghỉ', icon: <Event />, path: '/braekschedules' },
    { text: 'Quản lý chương trình', icon: <LibraryBooks />, path: '/programs' },
    { text: 'Quản lý học phần', icon: <MenuBook />, path: '/subjects' },
    { text: 'Quản lý khóa học', icon: <Class />, path: '/courses' },
    { text: 'Quản lý lớp', icon: <Groups />, path: '/class' },
    { text: 'Quản lý lớp học phần', icon: <AccountBalance />, path: '/classsection' },
    { text: 'Quản lý phòng', icon: <Room />, path: '/room' },
    { text: 'Quản lý khung giờ', icon: <AccessTime />, path: '/slottime' },
    { text: 'Đăng xuất', icon: <Logout />, path: '/logout' },
];

const drawerWidth = 350;

const StyledSidebarContainer = styled(Box)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    color: theme.palette.primary.contrastText,
    boxSizing: 'border-box',
    position: 'fixed',
    top: 64,
    height: 'calc(100% - 64px)',
    // Viền phải và đổ bóng để tạo hiệu ứng Drawer
    zIndex: theme.zIndex.drawer,
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    overflowY: 'auto',
}));

const SidebarForJustAdmin = () => {
    const theme = useTheme();
    const location = useLocation();

    return (
        <StyledSidebarContainer>
            {/* Header của sidebar */}
            {/* <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
                    Bảng điều khiển
                </Typography>
            </Box> */}
            {/* Divider với màu sắc tương phản */}
            <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.3) }} />

            <List disablePadding sx={{ mt: 1, ml: 1 }}>
                {navItems.map((item, index) => (
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
                            '&:not(:last-of-type)': {
                                mb: 0.5,
                            },
                        }}
                    >
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            sx={{
                                py: 1.2,
                                px: 2,
                                color: location.pathname === item.path
                                    ? theme.palette.primary.main
                                    : theme.palette.text.primary,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.7),
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
        </StyledSidebarContainer>
    );
};

export default SidebarForJustAdmin;