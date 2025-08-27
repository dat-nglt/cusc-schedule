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
  ListItemButton,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  School,
  Book,
  People,
  CalendarToday,
  Settings,
} from '@mui/icons-material';

const navItems = [
  { text: 'Tổng quan', icon: <Dashboard />, path: '/lecturer' },
  { text: 'Lịch dạy', icon: <CalendarToday />, path: '/lecturer/schedule' },
  // { text: 'Khóa học', icon: <Book />, path: '/lecturer/courses' },
  { text: 'Danh sách yêu cầu thay đổi', icon: <School />, path: '/lecturer/listRequest' },
  { text: 'Cài đặt', icon: <Settings />, path: '/lecturer/settings' },
];

const drawerWidth = 350;

const StyledSidebarContainer = styled(Box)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  color: theme.palette.text.primary,
  boxSizing: 'border-box',
  position: 'fixed',
  top: 64,
  height: 'calc(100% - 64px)',
  zIndex: theme.zIndex.appBar + 1, // Đảm bảo hiển thị trên các thành phần khác
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  overflowY: 'auto',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const SidebarJustForLecturer = () => {
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
                ? alpha(theme.palette.primary.main, 0.12)
                : 'transparent',
              borderLeft: location.pathname === item.path
                ? `4px solid ${theme.palette.primary.main}`
                : 'none',
              '&:not(:last-of-type)': {
                mb: 1,
              },
              borderRadius: 1,
            }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                py: 1.5,
                px: 2.5,
                borderRadius: 1,
                color: location.pathname === item.path
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.3),
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '& .MuiListItemIcon-root': {
                  color: location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  minWidth: '40px',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 600 : 500,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledSidebarContainer>
  );
};

export default SidebarJustForLecturer;