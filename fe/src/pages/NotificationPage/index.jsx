import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Chip,
    Grid,
    Tabs,
    Tab,
    Box,
    IconButton,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme,
    useMediaQuery,
    Avatar,
    InputAdornment,
    TextField,
    Pagination
} from '@mui/material';
import {
    FilterList as FilterIcon,
    Notifications as NotificationsIcon,
    Schedule as ScheduledIcon,
    Error as UrgentIcon,
    Info as GeneralIcon,
    Search as SearchIcon,
    School as StudentIcon,
    Person as LecturerIcon,
    Engineering as TrainingOfficerIcon,
    AdminPanelSettings as AdminIcon,
    Groups as AllUsersIcon
} from '@mui/icons-material';

// Mock data dựa trên model Notification
const mockNotifications = [
    {
        id: '1',
        title: 'Thông báo bảo trì hệ thống',
        content: 'Hệ thống sẽ được bảo trì từ 22h00 ngày 15/10 đến 02h00 ngày 16/10. Trong thời gian này, hệ thống có thể gián đoạn. Vui lòng lưu lại công việc và đăng xuất trước thời gian bảo trì.',
        type: 'scheduled',
        recipients: 'all',
        created_at: '2023-10-10T08:30:00Z',
        expires_at: '2023-10-16T02:00:00Z'
    },
    {
        id: '2',
        title: 'CẢNH BÁO: Yêu cầu thay đổi mật khẩu khẩn cấp',
        content: 'Phát hiện lỗ hổng bảo mật trong hệ thống. Yêu cầu tất cả người dùng thay đổi mật khẩu ngay lập tức. Truy cập trang cá nhân > Bảo mật để thực hiện thay đổi.',
        type: 'urgent',
        recipients: 'all',
        created_at: '2023-10-09T15:45:00Z',
        expires_at: '2023-10-12T23:59:59Z'
    },
    {
        id: '3',
        title: 'Lịch học kỳ mới đã được cập nhật',
        content: 'Lịch học kỳ mới cho tất cả các ngành đã được cập nhật trên hệ thống. Sinh viên vui lòng kiểm tra lịch học trong trang cá nhân và báo cáo sai sót (nếu có) cho phòng đào tạo trước ngày 20/10.',
        type: 'general',
        recipients: 'students',
        created_at: '2023-10-08T10:15:00Z',
        expires_at: null
    },
    {
        id: '4',
        title: 'Họp giảng viên định kỳ tháng 10/2023',
        content: 'Thông báo lịch họp giảng viên định kỳ tháng 10. Tất cả giảng viên có mặt tại phòng họp A lúc 14h00 ngày 20/10/2023. Nội dung: Đánh giá chất lượng giảng dạy và triển khai kế hoạch học kỳ mới.',
        type: 'general',
        recipients: 'lecturers',
        created_at: '2023-10-07T14:20:00Z',
        expires_at: '2023-10-20T14:00:00Z'
    },
    {
        id: '5',
        title: 'Triển khai quy chế đào tạo mới',
        content: 'Quy chế đào tạo mới đã được ban hành theo quyết định số 1234/QĐ-ĐH. Cán bộ đào tạo vui lòng nắm bắt các thay đổi và hướng dẫn sinh viên thực hiện theo quy chế mới. Tài liệu chi tiết đã được gửi qua email.',
        type: 'general',
        recipients: 'training_officers',
        created_at: '2023-10-05T09:00:00Z',
        expires_at: null
    },
    {
        id: '6',
        title: 'Nâng cấp hệ thống quản lý phiên bản 3.2',
        content: 'Hệ thống quản lý sẽ được nâng cấp lên phiên bản 3.2 vào Chủ nhật tuần tới (15/10). Admin vui lòng chuẩn bị cho công tác sao lưu dữ liệu và kiểm tra tính tương thích. Liên hệ đội kỹ thuật để được hỗ trợ.',
        type: 'scheduled',
        recipients: 'admins',
        created_at: '2023-10-01T11:30:00Z',
        expires_at: '2023-10-15T23:59:59Z'
    },
    {
        id: '7',
        title: 'Đăng ký học phần học kỳ Spring 2024',
        content: 'Từ ngày 16/10/2023, sinh viên có thể đăng ký học phần cho học kỳ Spring 2024. Vui lòng kiểm tra email để xem hướng dẫn chi tiết và lịch trình đăng ký theo từng khoa.',
        type: 'general',
        recipients: 'students',
        created_at: '2023-09-28T09:15:00Z',
        expires_at: '2023-10-16T00:00:00Z'
    },
    {
        id: '8',
        title: 'Tập huấn sử dụng hệ thống thi trực tuyến',
        content: 'Tổ chức tập huấn sử dụng hệ thống thi trực tuyến cho giảng viên vào ngày 12/10/2023. Giảng viên vui lòng đăng ký tham gia qua trang web phòng đào tạo trước ngày 10/10.',
        type: 'general',
        recipients: 'lecturers',
        created_at: '2023-09-25T14:30:00Z',
        expires_at: '2023-10-10T23:59:59Z'
    }
];

// Hàm chuyển đổi giá trị ENUM thành nhãn tiếng Việt
const getRecipientLabel = (recipient) => {
    const labels = {
        all: 'Tất cả',
        students: 'Sinh viên',
        lecturers: 'Giảng viên',
        training_officers: 'Cán bộ đào tạo',
        admins: 'Quản trị viên'
    };
    return labels[recipient] || recipient;
};

// Hàm lấy icon cho đối tượng nhận
const getRecipientIcon = (recipient) => {
    switch (recipient) {
        case 'students': return <StudentIcon />;
        case 'lecturers': return <LecturerIcon />;
        case 'training_officers': return <TrainingOfficerIcon />;
        case 'admins': return <AdminIcon />;
        default: return <AllUsersIcon />;
    }
};

// Hàm lấy icon và màu sắc cho loại thông báo
const getTypeInfo = (type) => {
    switch (type) {
        case 'urgent':
            return { icon: <UrgentIcon />, color: 'error', bgColor: '#ffebee' };
        case 'scheduled':
            return { icon: <ScheduledIcon />, color: 'primary', bgColor: '#e3f2fd' };
        default:
            return { icon: <GeneralIcon />, color: 'info', bgColor: '#e8f5e9' };
    }
};

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Hàm định dạng ngày giờ
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const NotificationPage = () => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications);
    const [tabValue, setTabValue] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [recipientFilter, setRecipientFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Lọc thông báo theo tab và bộ lọc
    useEffect(() => {
        let result = notifications;

        // Lọc theo tab
        if (tabValue !== 'all') {
            result = result.filter(noti => noti.type === tabValue);
        }

        // Lọc theo đối tượng nhận
        if (recipientFilter !== 'all') {
            result = result.filter(noti => noti.recipients === recipientFilter);
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(noti =>
                noti.title.toLowerCase().includes(term) ||
                noti.content.toLowerCase().includes(term)
            );
        }

        setFilteredNotifications(result);
        setPage(1); // Reset về trang đầu khi thay đổi bộ lọc
    }, [tabValue, recipientFilter, searchTerm, notifications]);

    // Xử lý thay đổi tab
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Mở dialog chi tiết thông báo
    const handleOpenDetail = (notification) => {
        setSelectedNotification(notification);
        setDetailDialogOpen(true);
    };

    // Đóng dialog chi tiết
    const handleCloseDetail = () => {
        setDetailDialogOpen(false);
    };

    // Mở dialog bộ lọc
    const handleOpenFilter = () => {
        setFilterDialogOpen(true);
    };

    // Đóng dialog bộ lọc
    const handleCloseFilter = () => {
        setFilterDialogOpen(false);
    };

    // Áp dụng bộ lọc
    const applyFilter = (recipient) => {
        setRecipientFilter(recipient);
        handleCloseFilter();
    };

    // Xử lý tìm kiếm
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Xử lý thay đổi trang
    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Tính toán thông báo cho trang hiện tại
    const currentNotifications = filteredNotifications.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Tính số trang
    const pageCount = Math.ceil(filteredNotifications.length / itemsPerPage);

    return (
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                mb: 4,
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                        <NotificationsIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight="700" color="primary">
                            Thông Báo
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Cập nhật thông tin mới nhất từ nhà trường
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    width: { xs: '100%', sm: 'auto' },
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <TextField
                        placeholder="Tìm kiếm thông báo..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{
                            minWidth: { xs: '100%', sm: 300 },
                            backgroundColor: 'background.paper',
                            borderRadius: 1
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <IconButton
                        onClick={handleOpenFilter}
                        aria-label="Lọc thông báo"
                        sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: recipientFilter !== 'all' ? theme.palette.primary.main + '10' : 'background.paper'
                        }}
                    >
                        <Badge
                            color="primary"
                            variant="dot"
                            invisible={recipientFilter === 'all'}
                        >
                            <FilterIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Box>

            {/* Tabs phân loại thông báo */}
            <Box sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 3,
                overflowX: 'auto',
                '& .MuiTabs-scroller': {
                    overflow: 'auto !important'
                }
            }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        minHeight: 48,
                        '& .MuiTab-root': {
                            minHeight: 48,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            py: 1,
                            px: { xs: 1, sm: 2 }
                        }
                    }}
                >
                    <Tab icon={<NotificationsIcon />} iconPosition="start" label="Tất cả" value="all" />
                    <Tab icon={<UrgentIcon />} iconPosition="start" label="Khẩn cấp" value="urgent" />
                    <Tab icon={<ScheduledIcon />} iconPosition="start" label="Lịch trình" value="scheduled" />
                    <Tab icon={<GeneralIcon />} iconPosition="start" label="Thông thường" value="general" />
                </Tabs>
            </Box>

            {/* Thống kê nhanh */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip

                    sx={{
                        px: 2,
                        py: 1
                    }}
                    icon={getRecipientIcon(recipientFilter)}
                    label={`Đối tượng: ${getRecipientLabel(recipientFilter)}`}
                    variant="outlined"
                    color="primary"
                />
                <Chip

                    sx={{
                        px: 2,
                        py: 1
                    }}
                    label={`Tìm thấy: ${filteredNotifications.length} thông báo`}
                    variant="outlined"
                />
            </Box>

            {/* Danh sách thông báo */}
            <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {currentNotifications.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{
                            textAlign: 'center',
                            py: 8,
                            backgroundColor: 'grey.50',
                            borderRadius: 2
                        }}>
                            <NotificationsIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Không tìm thấy thông báo nào
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    currentNotifications.map((notification) => {
                        const typeInfo = getTypeInfo(notification.type);
                        return (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                lg={4}
                                key={notification.id}
                                // Sử dụng display: flex để Grid item chứa Card có cùng chiều cao
                                sx={{ display: 'flex' }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        borderLeft: `4px solid ${theme.palette[typeInfo.color].main}`,
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            backgroundColor: typeInfo.bgColor + '30'
                                        }
                                    }}
                                    onClick={() => handleOpenDetail(notification)}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                                        {/* Header Section (fixed height) */}
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, flexShrink: 0 }}>
                                            <Avatar sx={{
                                                bgcolor: `${typeInfo.color}.light`,
                                                color: `${typeInfo.color}.dark`,
                                                width: 32,
                                                height: 32,
                                                mr: 1.5
                                            }}>
                                                {typeInfo.icon}
                                            </Avatar>
                                            <Typography variant="h6" component="h2" sx={{
                                                flexGrow: 1,
                                                fontWeight: notification.type === 'urgent' ? 600 : 500,
                                                color: notification.type === 'urgent' ? 'error.main' : 'text.primary'
                                            }}>
                                                {notification.title}
                                            </Typography>
                                        </Box>

                                        {/* Main Content Section (flex-grow to fill space) */}
                                        <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2 }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {notification.content}
                                            </Typography>
                                        </Box>

                                        {/* Footer Section (fixed height, pushes to bottom) */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mt: 'auto', // Push to the bottom
                                            flexShrink: 0
                                        }}>
                                            <Chip
                                                icon={getRecipientIcon(notification.recipients)}
                                                label={getRecipientLabel(notification.recipients)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    {formatDate(notification.created_at)}
                                                </Typography>
                                                {notification.expires_at && (
                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                        Hết hạn: {formatDate(notification.expires_at)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>

            {/* Phân trang */}
            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size={isSmallMobile ? "small" : "medium"}
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            {/* Dialog chi tiết thông báo */}
            <Dialog
                open={detailDialogOpen}
                onClose={handleCloseDetail}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                {selectedNotification && (
                    <>
                        <DialogTitle sx={{
                            pb: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.grey[50]
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {getTypeInfo(selectedNotification.type).icon}
                                <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                                    {selectedNotification.title}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                <Chip
                                    icon={getRecipientIcon(selectedNotification.recipients)}
                                    label={getRecipientLabel(selectedNotification.recipients)}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Ngày đăng: {formatDateTime(selectedNotification.created_at)}
                                </Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{ py: 3 }}>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                {selectedNotification.content}
                            </Typography>
                            {selectedNotification.expires_at && (
                                <Box sx={{
                                    mt: 3,
                                    p: 2,
                                    backgroundColor: 'warning.light',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <UrgentIcon color="warning" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="warning.dark">
                                        Thông báo này sẽ hết hạn vào: {formatDateTime(selectedNotification.expires_at)}
                                    </Typography>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ px: 3, py: 2 }}>
                            <Button onClick={handleCloseDetail} variant="contained">
                                Đóng
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Dialog bộ lọc */}
            <Dialog
                open={filterDialogOpen}
                onClose={handleCloseFilter}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.grey[50],
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                    <FilterIcon sx={{ mr: 1 }} />
                    Lọc thông báo
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Chọn đối tượng nhận thông báo
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {['all', 'students', 'lecturers', 'training_officers', 'admins'].map((recipient) => (
                            <Button
                                key={recipient}
                                variant={recipientFilter === recipient ? "contained" : "outlined"}
                                onClick={() => applyFilter(recipient)}
                                startIcon={getRecipientIcon(recipient)}
                                sx={{
                                    justifyContent: 'flex-start',
                                    py: 1.5,
                                    textTransform: 'none'
                                }}
                                size="large"
                            >
                                {getRecipientLabel(recipient)}
                            </Button>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCloseFilter}>Hủy</Button>
                    <Button
                        onClick={() => applyFilter('all')}
                        variant="outlined"
                    >
                        Đặt lại
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default NotificationPage;