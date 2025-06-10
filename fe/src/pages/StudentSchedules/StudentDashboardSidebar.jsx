import React from 'react';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemIcon, useTheme, alpha, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BookIcon from '@mui/icons-material/Book'; // For Credits
import { Assessment } from '@mui/icons-material';


const StudentDashboardSidebar = () => {
    const theme = useTheme()

    const InfoBox = ({ icon: Icon, label, value, color }) => (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                p: 2, // Padding cho mỗi box thông tin
                borderRadius: 1.5, // Bo tròn các góc
                // Sử dụng màu nền nhẹ từ theme, hoặc màu trong suốt từ alpha
                bgcolor: alpha(theme.palette[color].main, 0.1), // Nền màu nhẹ dựa trên màu icon
                mb: 1.5, // Margin dưới cho mỗi box
                border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`, // Border mờ cùng màu
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)', // Hiệu ứng nhấc lên khi hover
                    boxShadow: `0 4px 10px ${alpha(theme.palette[color].main, 0.2)}`, // Bóng nhẹ khi hover
                }
            }}
        >
            <Icon sx={{ color: theme.palette[color].main, mr: 1.5 }} /> {/* Icon với màu chính */}
            <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
                {label}: <Typography component="span" variant="subtitle2" fontWeight="bold">{value}</Typography>
            </Typography>
        </Box>
    );

    // Dummy data for demonstration
    const totalCourses = 5;
    const totalCredits = 15;
    const practice = 20
    const theory = 10
    const announcements = [
        { id: 1, title: 'Thông báo về lịch thi cuối kỳ', date: '05/06/2025' },
        { id: 1, title: 'Thông báo về lịch thi cuối kỳ', date: '05/06/2025' },
        { id: 1, title: 'Thông báo về lịch thi cuối kỳ', date: '05/06/2025' },
        { id: 1, title: 'Thông báo về lịch thi cuối kỳ', date: '05/06/2025' },
        { id: 1, title: 'Thông báo về lịch thi cuối kỳ', date: '05/06/2025' },
        { id: 2, title: 'Cập nhật lịch học môn Lập trình Web', date: '01/06/2025' },
    ];

    return (

        <Box sx={{ width: '100%', height: { xs: 'fit-content', md: '250px' }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box
                sx={{
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.divider,
                    p: 2, // Padding tổng thể của khung
                    mb: 3,
                    flex: 1,
                    height: '100%',
                    bgcolor: theme.palette.background.paper, // Màu nền cho box chính
                    borderRadius: 2 // Bo tròn góc cho box chính
                }}
            >

                <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                    Tổng quan học tập
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {/* Các Box thông tin chi tiết */}
                <Stack gap={1}>
                    <Stack flexDirection={'row'} gap={3}>
                        <InfoBox
                            icon={SchoolIcon}
                            label="Tổng số môn học"
                            value={totalCourses}
                            color="info" // Sử dụng màu info từ theme
                        />
                        <InfoBox
                            icon={BookIcon}
                            label="Tổng số tín chỉ"
                            value={totalCredits}
                            color="success" // Sử dụng màu success từ theme
                        />
                    </Stack>
                    <Stack flexDirection={'row'} gap={3}>
                        <InfoBox
                            icon={ScheduleIcon}
                            label="Số tiết học TH trong tuần"
                            value={practice}
                            color="warning" // Sử dụng màu warning từ theme
                        />
                        <InfoBox
                            icon={ScheduleIcon}
                            label="Số tiết học LT trong tuần"
                            value={theory}
                            color="warning" // Sử dụng màu warning từ theme
                        />

                    </Stack>
                </Stack>
            </Box>

            <Box sx={{
                border: '1px solid',
                borderColor: (theme) => theme.palette.divider,
                p: 2, mb: 3, flex: 1, height: '100%'
            }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="secondary">
                    Thông báo & Tin tức
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense sx={{ overflowY: 'scroll', maxHeight: '150px' }}>
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
            </Box>
        </Box>
    );
};

export default StudentDashboardSidebar;