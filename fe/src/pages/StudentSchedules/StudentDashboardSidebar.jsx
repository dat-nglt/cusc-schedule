import React from 'react';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BookIcon from '@mui/icons-material/Book'; // For Credits

const StudentDashboardSidebar = () => {
    // Dummy data for demonstration
    const totalCourses = 5;
    const totalCredits = 15;
    const announcements = [
        { id: 1, title: 'Thông báo về lịch thi cuối kỳ', date: '05/06/2025' },
        { id: 2, title: 'Cập nhật lịch học môn Lập trình Web', date: '01/06/2025' },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                    Tổng quan học tập
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}><SchoolIcon color="action" /></ListItemIcon>
                    <ListItemText primary={`Tổng số môn học: ${totalCourses}`} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}><BookIcon color="action" /></ListItemIcon>
                    <ListItemText primary={`Tổng số tín chỉ: ${totalCredits}`} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon sx={{ minWidth: 36 }}><ScheduleIcon color="action" /></ListItemIcon>
                    <ListItemText primary="Số tiết học trong tuần: 25" /> {/* Example */}
                </Box>
            </Paper>

            <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="secondary">
                    Thông báo & Tin tức
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                    {announcements.length > 0 ? (
                        announcements.map((announcement) => (
                            <ListItem key={announcement.id} disablePadding sx={{ mb: 1 }}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <NotificationsActiveIcon fontSize="small" color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" fontWeight="medium">
                                            {announcement.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {announcement.date}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Không có thông báo mới.
                        </Typography>
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default StudentDashboardSidebar;