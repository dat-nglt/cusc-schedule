import React, { useState } from 'react';
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Box,
    Typography,
    Switch
} from '@mui/material';
import {
    Assessment,
    School,
    HowToReg,
    Schedule,
    BarChart,
    Home,
    People,
    Settings,
    LightMode,
    DarkMode
} from '@mui/icons-material';

const menuItems = [
    { text: 'Trang Chủ', icon: <Home />, path: '/dashboard' },
    { text: 'Sinh Viên', icon: <People />, path: '/student' },
    { text: 'Kết Quả', icon: <Assessment />, path: '/student/results' },
    { text: 'Chương Trình ĐT', icon: <School />, path: '/chuong-trinh' },
    { text: 'Đăng Ký Học Phần', icon: <HowToReg />, path: '/dang-ky' },
    { text: 'Lịch Học', icon: <Schedule />, path: '/student/schedules' },
    { text: 'Thống Kê', icon: <BarChart />, path: '/thong-ke' },
    { text: 'Cài Đặt', icon: <Settings />, path: '/cai-dat' }
];

const SidebarJustForStudent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const drawerWidth = 350;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile
            }}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    top: '64px',
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                },
            }}
        >

            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        // selected={currentPath === item.path}
                        onClick={() => window.location.href = item.path}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.light,
                            },
                            '&.Mui-selected:hover': {
                                backgroundColor: theme.palette.primary.light,
                            },
                            '&:hover': {
                                cursor: 'pointer',
                                backgroundColor: theme.palette.primary.dark,
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            
        </Drawer>
    );
};

export default SidebarJustForStudent;