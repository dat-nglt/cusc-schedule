import React, { useState, useEffect } from 'react';
import {
    Menu,
    MenuItem,
    Badge,
    IconButton,
    Typography,
    Box,
    Divider,
    Chip,
    Button,
    ListItemIcon,
    Avatar,
    ListItemText,
    ListItemAvatar
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    WarningAmber,
    Construction,
    PersonAdd,
    ArrowForward,
    CheckCircle,
    Schedule,
    Error,
    Assignment,
    Announcement
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getUserNotificationsAPI, markAsReadAPI } from '../../api/notificationAPI';

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const theme = useTheme();
    const open = Boolean(anchorEl);

    useEffect(() => {
        // Fetch notifications từ API
        const fetchNotifications = async () => {
            try {
                const res = await getUserNotificationsAPI();
                const notis = (res?.data || []).map(item => ({
                    id: item.id,
                    isRead: item.isRead,
                    readAt: item.readAt,
                    created_at: item.notificationInfo?.created_at || item.created_at,
                    expires_at: item.notificationInfo?.expires_at,
                    title: item.notificationInfo?.title || '',
                    content: item.notificationInfo?.content || '',
                    type: item.notificationInfo?.type || 'general',
                    recipients: item.notificationInfo?.recipients || 'all',
                    raw: item
                }));
                setNotifications(notis);
            } catch (err) {
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        // Tính số thông báo chưa đọc
        const count = notifications.filter(notification => !notification.isRead).length;
        setUnreadCount(count);
    }, [notifications]);

    console.log(notifications);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = (id) => {
        const updatedNotifications = notifications.map(notification =>
            notification.id === id ? { ...notification, isRead: true } : notification
        );
        setNotifications(updatedNotifications);
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(notification => ({
            ...notification,
            isRead: true
        }));
        setNotifications(updatedNotifications);
    };

    const deleteNotification = (id) => {
        const updatedNotifications = notifications.filter(notification => notification.id !== id);
        setNotifications(updatedNotifications);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'urgent':
                return <Error fontSize="small" sx={{ color: theme.palette.error.main }} />;
            case 'scheduled':
                return <Schedule fontSize="small" sx={{ color: theme.palette.warning.main }} />;
            default:
                return <Announcement fontSize="small" sx={{ color: theme.palette.info.main }} />;
        }
    };

    const getRecipientLabel = (recipients) => {
        const labels = {
            'all': 'Tất cả',
            'students': 'Sinh viên',
            'lecturers': 'Giảng viên',
            'training_officers': 'Cán bộ đào tạo',
            'admins': 'Quản trị viên'
        };
        return labels[recipients] || recipients;
    };

    const formatTime = (date) => {
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: vi
        });
    };

    return (
        <>
            <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleClick}
                sx={{ ml: 1 }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        minWidth: 400,
                        maxWidth: 500,
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
                            alignItems: 'flex-start',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {unreadCount > 0 && (
                            <Chip
                                label={`${unreadCount} mới`}
                                size="small"
                                color="primary"
                                sx={{
                                    height: 20,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                }}
                            />
                        )}
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                onClick={markAllAsRead}
                                sx={{ minWidth: 'auto', fontSize: '0.75rem' }}
                            >
                                Đánh dấu đã đọc tất cả
                            </Button>
                        )}
                    </Box>
                </MenuItem>

                <Divider />

                {/* Notification Items */}
                {notifications.length === 0 ? (
                    <MenuItem sx={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        py: 3
                    }}>
                        <CheckCircle sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Không có thông báo nào
                        </Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification.id}
                            sx={{
                                backgroundColor: notification.isRead ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                                opacity: notification.isRead ? 0.8 : 1
                            }}
                        >
                            <ListItemAvatar sx={{ minWidth: 44, mt: 0.5 }}>
                                <Avatar sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '& .MuiSvgIcon-root': { fontSize: 18 }
                                }}>
                                    {getNotificationIcon(notification.type)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" fontWeight="medium">
                                        {notification.title}
                                    </Typography>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
                                            {notification.content}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={getRecipientLabel(notification.recipients)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.65rem' }}
                                            />
                                            <Typography variant="caption" color="primary">
                                                {formatTime(notification.created_at)}
                                            </Typography>
                                            {!notification.isRead && (
                                                <Chip
                                                    label="Mới"
                                                    size="small"
                                                    color="primary"
                                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                }
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                ml: 1
                            }}>
                                {/* Có thể thêm nút hành động ở đây nếu cần */}
                            </Box>
                        </MenuItem>
                    ))
                )}

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
        </>
    );
};

export default NotificationComponent;