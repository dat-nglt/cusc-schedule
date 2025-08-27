import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
    useTheme,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import {
    Search as SearchIcon,
} from '@mui/icons-material';
import useResponsive from '../../hooks/useResponsive';
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';
import { getScheduleChangeRequestByLecturerAPI } from '../../api/schedulechangerequestAPI';
import { useAuth } from '../../contexts/AuthContext';
import ListRequestTable from './ListRequestTable';
const ListScheduleChangeRequests = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();
    const theme = useTheme();
    const { userData } = useAuth();

    // State cho dữ liệu yêu cầu thay đổi lịch
    const [requests, setRequests] = useState([]);

    // State cho phân trang, tìm kiếm, lọc theo trạng thái
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    // Hàm lấy dữ liệu yêu cầu thay đổi lịch
    const fetchScheduleChangeRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getScheduleChangeRequestByLecturerAPI(userData.code);
            setRequests(response.data);
        } catch (err) {
            console.error("Error fetching schedule change requests:", err);
            setError('Không thể tải dữ liệu yêu cầu thay đổi lịch. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };
    // Dữ liệu mẫu cho yêu cầu thay đổi lịch
    useEffect(() => {
        fetchScheduleChangeRequests();
    }, [userData.code]);

    console.log('Schedule Change Requests:', requests);

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý kiểm tra lịch
    const handleCheckSchedule = (id) => {
        console.log('Check schedule for request:', id);
        // Implementation for check schedule
    };


    // Lọc danh sách yêu cầu dựa trên từ khóa tìm kiếm và trạng thái
    const filteredRequests = requests.filter((request) => {
        const matchesSearchTerm =
            request.lecturer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.lecturer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.requested_room_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.requestedRoom?.room_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? request.status.toLowerCase() === selectedStatus
            : true;

        return matchesSearchTerm && matchesStatus;
    });

    // Tính toán dữ liệu hiển thị trên trang hiện tại
    const displayedRequests = filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            {/* Main Content */}
            <Box sx={{ width: '100%', mb: 3 }}>
                {/* Bảng danh sách yêu cầu thay đổi lịch */}
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
                                Danh sách yêu cầu thay đổi lịch đã gửi
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                width: isSmallScreen ? '100%' : 'auto'
                            }}>
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm theo mã yêu cầu, giảng viên, phòng..."
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

                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="pending">Chờ duyệt</MenuItem>
                                        <MenuItem value="approved">Đã duyệt</MenuItem>
                                        <MenuItem value="rejected">Từ chối</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Hiển thị loading và error */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {filteredRequests.length === 0 ? (
                            <Typography>Không có yêu cầu thay đổi lịch nào để hiển thị.</Typography>
                        ) : (
                            <>
                                <ListRequestTable
                                    displayedRequests={displayedRequests}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleCheckSchedule={handleCheckSchedule}
                                />
                                <TablePaginationLayout
                                    count={filteredRequests.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ListScheduleChangeRequests;