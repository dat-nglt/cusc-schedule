import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Container,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    CssBaseline,
    ThemeProvider,
    createTheme,
    useMediaQuery,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider,
    Chip,
    Tabs,
    Tab,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    useTheme,
    alpha
} from '@mui/material';
import {
    Add as AddIcon,
    FileDownload as FileDownloadIcon,
    FilterList as FilterListIcon,
    Sort as SortIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';

// Sample data
const schedules = [
    { id: 1, name: 'HK1 2023-2024', generation: '1.0', optimized: 85, created: '2023-08-15', classes: 45, status: 'Hoạt động' },
    { id: 2, name: 'HK2 2023-2024', generation: '1.1', optimized: 92, created: '2024-01-10', classes: 48, status: 'Hoạt động' },
    { id: 3, name: 'HK1 2024-2025', generation: '2.0', optimized: 88, created: '2024-08-20', classes: 50, status: 'Dự thảo' },
];

const timetableData = [
    { id: 1, time: '7:30 - 9:00', mon: 'Toán - P101', tue: 'Văn - P202', wed: 'Anh - P305', thu: 'Lý - Lab1', fri: 'Hóa - Lab2', sat: '', sun: '' },
    { id: 2, time: '9:10 - 10:40', mon: 'Lý - P103', tue: 'Hóa - P204', wed: 'Sử - P301', thu: 'Địa - P102', fri: 'GDCD - P105', sat: '', sun: '' },
    { id: 3, time: '13:30 - 15:00', mon: 'Anh - P205', tue: 'Toán - P101', wed: 'Văn - P202', thu: 'Sinh - Lab1', fri: 'CN - Lab2', sat: '', sun: '' },
];

const statusOptions = ['Tất cả', 'Hoạt động', 'Dự thảo', 'Đã khóa'];

const ScheduleManagement = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useTheme()
    const [darkMode, setDarkMode] = useState(prefersDarkMode);
    const [tabValue, setTabValue] = useState(0);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleCreateNewSchedule = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleConfirmCreate = () => {
        setOpenCreateDialog(false);
        showSnackbar('Đã tạo thời khóa biểu mới thành công', 'success');
    };

    const handleDeleteSchedule = () => {
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        setOpenDeleteDialog(false);
        showSnackbar('Đã xóa thời khóa biểu thành công', 'success');
        setSelectedSchedule(null);
    };

    const handleDuplicateSchedule = () => {
        showSnackbar('Đã tạo bản sao thành công', 'success');
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const filteredSchedules = schedules.filter(schedule => {
        const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.generation.includes(searchTerm);
        const matchesStatus = statusFilter === 'Tất cả' || schedule.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Header Section */}
            <Box sx={{ width: '100%', mb: 3 }}>
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isSmallScreen ? 'stretch' : 'center',
                            mb: 3,
                            gap: 2
                        }}>
                            <Typography variant="h5" fontWeight="600">
                                Danh sách thời khoá biểu
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                width: isSmallScreen ? '100%' : 'auto'
                            }}>
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm theo mã, tên giảng viên hoặc môn giảng dạy..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        minWidth: 200,
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<FileDownloadIcon />}
                                    disabled={!selectedSchedule}
                                    sx={{
                                        height: 36,
                                        px: 2
                                    }}
                                >
                                    Xuất Excel
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleCreateNewSchedule}
                                    sx={{
                                        height: 36,
                                        px: 2
                                    }}
                                >
                                    Tạo mới
                                </Button>
                            </Box>
                        </Box>
                        <Grid container spacing={3} sx={{ height: 'calc(100vh - 250px)' }}>
                            {/* Sidebar - Danh sách thời khóa biểu */}
                            <Grid item xs={12} md={4} lg={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Paper sx={{
                                    p: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: 0

                                }}>
                                    {/* Component Header */}
                                    {/* Schedule List Container */}
                                    <Box sx={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: theme.palette.divider,
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: theme.palette.text.secondary,
                                            },
                                        },
                                    }}>
                                        {filteredSchedules.map((schedule) => (
                                            <Card
                                                key={schedule.id}
                                                onClick={() => handleScheduleSelect(schedule)}
                                                sx={{
                                                    mb: 2,
                                                    cursor: 'pointer',
                                                    boxShadow: selectedSchedule?.id === schedule.id ? theme.shadows[4] : theme.shadows[1],
                                                    border: selectedSchedule?.id === schedule.id ? `1px solid ${alpha(theme.palette.secondary.main, 0.3)}` : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                    borderRadius: '12px',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        boxShadow: theme.shadows[3],
                                                        borderColor: selectedSchedule?.id === schedule.id ? alpha(theme.palette.secondary.main, 0.5) : alpha(theme.palette.primary.main, 0.5)
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{
                                                    p: 1.5,
                                                    '&:last-child': { pb: 1.5 },
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 0.5
                                                }}>
                                                    {/* Header row with name and status */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        gap: 1
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{
                                                            fontWeight: 600,
                                                            lineHeight: 1.3,
                                                            color: theme.palette.text.primary
                                                        }}>
                                                            {schedule.name}
                                                        </Typography>

                                                        <Chip
                                                            label={schedule.status}
                                                            size="small"
                                                            variant="outlined"
                                                            color={
                                                                schedule.status === 'Hoạt động' ? 'success' :
                                                                    schedule.status === 'Dự thảo' ? 'warning' : 'error'
                                                            }
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.6875rem',
                                                                fontWeight: 500,
                                                                borderWidth: '1.5px',
                                                                '& .MuiChip-label': { px: 0.75 }
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Version info */}
                                                    <Typography variant="caption" sx={{
                                                        color: theme.palette.text.secondary,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5
                                                    }}>
                                                        <Box component="span" sx={{
                                                            fontSize: '0.75rem',
                                                            lineHeight: 1.5,
                                                            opacity: 0.8
                                                        }}>
                                                            v{schedule.generation}
                                                        </Box>
                                                        <Box component="span" sx={{
                                                            width: 4,
                                                            height: 4,
                                                            borderRadius: '50%',
                                                            bgcolor: theme.palette.text.secondary,
                                                            opacity: 0.6
                                                        }} />
                                                        <Box component="span">
                                                            {new Date(schedule.created).toLocaleDateString()}
                                                        </Box>
                                                    </Typography>

                                                    {/* Optimization indicator */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mt: 0.5
                                                    }}>
                                                        <Box sx={{
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: 6,
                                                            bgcolor: theme.palette.mode === 'light' ?
                                                                'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                                                            borderRadius: 3,
                                                            overflow: 'hidden'
                                                        }}>
                                                            <Box sx={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: 0,
                                                                width: `${schedule.optimized}%`,
                                                                height: '100%',
                                                                bgcolor:
                                                                    schedule.optimized >= 90 ? 'success.main' :
                                                                        schedule.optimized >= 80 ? 'warning.main' : 'error.main',
                                                                borderRadius: 3
                                                            }} />
                                                        </Box>

                                                        <Typography variant="caption" sx={{
                                                            fontWeight: 500,
                                                            color:
                                                                schedule.optimized >= 90 ? 'success.main' :
                                                                    schedule.optimized >= 80 ? 'warning.main' : 'error.main',
                                                            minWidth: 40,
                                                            textAlign: 'right'
                                                        }}>
                                                            {schedule.optimized}%
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Main content - Chi tiết thời khóa biểu */}
                            <Grid flex={1} item xs={12} md={8} lg={9} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: "fit-content"
                            }}>
                                <Paper sx={{
                                    p: 3,
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: 0
                                }}>
                                    {selectedSchedule ? (
                                        <>
                                            {/* Header */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 3,
                                                flexWrap: 'wrap',
                                                gap: 2
                                            }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {selectedSchedule.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Phiên bản {selectedSchedule.generation} • Cập nhật lần cuối: {new Date(selectedSchedule.created).toLocaleDateString()}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<EditIcon fontSize="small" />}
                                                        size="small"
                                                        sx={{ borderRadius: 4 }}
                                                    >
                                                        Chỉnh sửa
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<CopyIcon fontSize="small" />}
                                                        size="small"
                                                        onClick={handleDuplicateSchedule}
                                                        sx={{ borderRadius: 4 }}
                                                    >
                                                        Tạo bản sao
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<DeleteIcon fontSize="small" />}
                                                        size="small"
                                                        color="error"
                                                        onClick={handleDeleteSchedule}
                                                        sx={{ borderRadius: 4 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Box>
                                            </Box>

                                            {/* Tabs */}
                                            <Tabs
                                                value={tabValue}
                                                onChange={handleTabChange}
                                                sx={{
                                                    mb: 3,
                                                    '& .MuiTabs-indicator': {
                                                        height: 3,
                                                        borderRadius: '3px 3px 0 0'
                                                    }
                                                }}
                                            >
                                                <Tab label="Thời khóa biểu" sx={{ minWidth: 'auto', px: 2 }} />
                                                <Tab label="Thông tin chi tiết" sx={{ minWidth: 'auto', px: 2 }} />
                                                <Tab label="Lịch sử phiên bản" sx={{ minWidth: 'auto', px: 2 }} />
                                            </Tabs>

                                            {/* Tab content */}
                                            <Box sx={{
                                                flex: 1,
                                                overflow: 'auto',
                                                '&::-webkit-scrollbar': {
                                                    width: '6px',
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: theme.palette.mode === 'light' ? '#bdbdbd' : '#616161',
                                                    borderRadius: '3px',
                                                }
                                            }}>
                                                {tabValue === 0 && (
                                                    <TableContainer component={Paper} elevation={0}>
                                                        <Table sx={{ minWidth: 800 }}>
                                                            <TableHead>
                                                                <TableRow sx={{
                                                                    '& th': {
                                                                        fontWeight: 600,
                                                                        backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.background.default
                                                                    }
                                                                }}>
                                                                    <TableCell>Thời gian</TableCell>
                                                                    <TableCell>Thứ 2</TableCell>
                                                                    <TableCell>Thứ 3</TableCell>
                                                                    <TableCell>Thứ 4</TableCell>
                                                                    <TableCell>Thứ 5</TableCell>
                                                                    <TableCell>Thứ 6</TableCell>
                                                                    <TableCell>Thứ 7</TableCell>
                                                                    <TableCell>Chủ nhật</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {timetableData.map((row) => (
                                                                    <TableRow
                                                                        key={row.id}
                                                                        hover
                                                                        sx={{ '&:last-child td': { borderBottom: 0 } }}
                                                                    >
                                                                        <TableCell sx={{ fontWeight: 500 }}>{row.time}</TableCell>
                                                                        <TableCell>{row.mon}</TableCell>
                                                                        <TableCell>{row.tue}</TableCell>
                                                                        <TableCell>{row.wed}</TableCell>
                                                                        <TableCell>{row.thu}</TableCell>
                                                                        <TableCell>{row.fri}</TableCell>
                                                                        <TableCell>{row.sat}</TableCell>
                                                                        <TableCell>{row.sun}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                )}

                                                {tabValue === 1 && (
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={6}>
                                                            <Card variant="outlined" sx={{ mb: 3 }}>
                                                                <CardContent>
                                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                                        Thông tin cơ bản
                                                                    </Typography>
                                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 2 }}>
                                                                        <Typography variant="body2" color="text.secondary"><strong>Tên:</strong></Typography>
                                                                        <Typography variant="body2">{selectedSchedule.name}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Phiên bản:</strong></Typography>
                                                                        <Typography variant="body2">{selectedSchedule.generation}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Ngày tạo:</strong></Typography>
                                                                        <Typography variant="body2">{new Date(selectedSchedule.created).toLocaleDateString()}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Trạng thái:</strong></Typography>
                                                                        <Box>
                                                                            <Chip
                                                                                label={selectedSchedule.status}
                                                                                size="small"
                                                                                color={
                                                                                    selectedSchedule.status === 'Hoạt động' ? 'success' :
                                                                                        selectedSchedule.status === 'Dự thảo' ? 'warning' : 'error'
                                                                                }
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>

                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                                        Thống kê lớp học
                                                                    </Typography>
                                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 2 }}>
                                                                        <Typography variant="body2" color="text.secondary"><strong>Số lớp học:</strong></Typography>
                                                                        <Typography variant="body2">{selectedSchedule.classes}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Số phòng sử dụng:</strong></Typography>
                                                                        <Typography variant="body2">15 phòng</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Số tiết học/ngày:</strong></Typography>
                                                                        <Typography variant="body2">4 tiết</Typography>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <Card variant="outlined" sx={{ height: '100%' }}>
                                                                <CardContent>
                                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                                        Phân tích tối ưu
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                                        <Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                <Typography variant="body2">Mức độ tối ưu</Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                    {selectedSchedule.optimized}%
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box sx={{
                                                                                width: '100%',
                                                                                height: 8,
                                                                                bgcolor: 'divider',
                                                                                borderRadius: 4,
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <Box
                                                                                    sx={{
                                                                                        width: `${selectedSchedule.optimized}%`,
                                                                                        height: '100%',
                                                                                        bgcolor: selectedSchedule.optimized >= 90 ? 'success.main' :
                                                                                            selectedSchedule.optimized >= 80 ? 'warning.main' : 'error.main'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Box>

                                                                        <Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                <Typography variant="body2">Phân bổ phòng học</Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>78%</Typography>
                                                                            </Box>
                                                                            <Box sx={{
                                                                                width: '100%',
                                                                                height: 8,
                                                                                bgcolor: 'divider',
                                                                                borderRadius: 4,
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <Box
                                                                                    sx={{
                                                                                        width: '78%',
                                                                                        height: '100%',
                                                                                        bgcolor: 'info.main'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Box>

                                                                        <Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                <Typography variant="body2">Phân bổ giáo viên</Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>85%</Typography>
                                                                            </Box>
                                                                            <Box sx={{
                                                                                width: '100%',
                                                                                height: 8,
                                                                                bgcolor: 'divider',
                                                                                borderRadius: 4,
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <Box
                                                                                    sx={{
                                                                                        width: '85%',
                                                                                        height: '100%',
                                                                                        bgcolor: 'secondary.main'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {tabValue === 2 && (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: 300,
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography variant="body1" color="text.secondary">
                                                            Lịch sử các phiên bản sẽ hiển thị tại đây
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                    ) : (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            textAlign: 'center',
                                            p: 3
                                        }}>
                                            <Box sx={{
                                                width: 120,
                                                height: 120,
                                                bgcolor: theme.palette.mode === 'light' ? '#f0f0f0' : '#424242',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3
                                            }}>
                                                <AddIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                            </Box>
                                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1.5 }}>
                                                Chưa có thời khóa biểu được chọn
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                                                Vui lòng chọn một thời khóa biểu từ danh sách bên trái hoặc tạo mới thời khóa biểu
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={handleCreateNewSchedule}
                                                sx={{ borderRadius: 4 }}
                                            >
                                                Tạo thời khóa biểu mới
                                            </Button>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ScheduleManagement;