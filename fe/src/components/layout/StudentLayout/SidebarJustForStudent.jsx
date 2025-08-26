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
    alpha,
    styled,
    ListItemButton
} from '@mui/material';
import {
    School,
    Home,
    People,
    Assessment,
    HowToReg,
    Schedule,
    Settings,
    BarChartOutlined
} from '@mui/icons-material';

const navItems = [
    { text: 'Sinh Viên', icon: <People />, path: '/student' },
    { text: 'Kết Quả', icon: <Assessment />, path: '/student/results' },
    { text: 'Chương Trình ĐT', icon: <School />, path: '/chuong-trinh' },
    { text: 'Đăng Ký Học Phần', icon: <HowToReg />, path: '/dang-ky' },
    { text: 'Lịch Học', icon: <Schedule />, path: '/student/schedules' },
    { text: 'Thống Kê', icon: <BarChartOutlined />, path: '/thong-ke' },
    { text: 'Cài Đặt', icon: <Settings />, path: '/cai-dat' }
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

const SidebarForJustStudent = () => {
    const theme = useTheme();
    const location = useLocation();

    return (
        <StyledSidebarContainer>
            <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.3) }} />
            <List disablePadding sx={{ mt: 1, ml: 1 }}>
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
        </StyledSidebarContainer>
    );
};

export default SidebarForJustStudent;