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
import ScheduleChangeRequestTable from './ScheduleChangeRequestTable';
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';
import { getAllScheduleChangeRequestsAPI, approveScheduleChangeRequestAPI, rejectScheduleChangeRequestAPI } from '../../api/schedulechangerequestAPI';

const ScheduleChangeRequests = () => {
    const { isSmallScreen, isMediumScreen } = useResponsive();
    const theme = useTheme();

    // State cho dữ liệu yêu cầu thay đổi lịch
    const [requests, setRequests] = useState([]);

    // State cho phân trang, tìm kiếm, lọc theo trạng thái
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State cho dialog từ chối
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Hàm lấy dữ liệu yêu cầu thay đổi lịch
    const fetchScheduleChangeRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAllScheduleChangeRequestsAPI();
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
    }, []);

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý kiểm tra lịch
    const handleCheckSchedule = (id) => {
        console.log('Check schedule for request:', id);
        // Implementation for check schedule
    };

    // Hàm xử lý duyệt yêu cầu
    const handleApproveRequest = async (id) => {
        console.log('Approve request:', id);
        setLoading(true);
        try {
            await approveScheduleChangeRequestAPI(id);
            // Cập nhật state sau khi duyệt thành công
            setRequests(prevRequests =>
                prevRequests.map(request =>
                    request.request_id === id
                        ? { ...request, status: 'APPROVED' }
                        : request
                )
            );
            setError('');
        } catch (err) {
            console.error("Error approving request:", err);
            setError(err.response?.data?.message || 'Không thể duyệt yêu cầu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý từ chối yêu cầu - mở dialog
    const handleRejectRequest = (id) => {
        setSelectedRequestId(id);
        setRejectDialogOpen(true);
    };

    // Hàm xử lý xác nhận từ chối yêu cầu
    const handleConfirmReject = async () => {
        if (!selectedRequestId) return;

        setLoading(true);
        try {
            await rejectScheduleChangeRequestAPI(selectedRequestId, rejectionReason);
            // Cập nhật state sau khi từ chối thành công
            setRequests(prevRequests =>
                prevRequests.map(request =>
                    request.request_id === selectedRequestId
                        ? { ...request, status: 'REJECTED' }
                        : request
                )
            );
            setError('');
            setRejectDialogOpen(false);
            setRejectionReason('');
            setSelectedRequestId(null);
        } catch (err) {
            console.error("Error rejecting request:", err);
            setError(err.response?.data?.message || 'Không thể từ chối yêu cầu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm đóng dialog từ chối
    const handleCloseRejectDialog = () => {
        setRejectDialogOpen(false);
        setRejectionReason('');
        setSelectedRequestId(null);
    };
    console.log('Filtered requests:', requests);
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
                                Danh sách yêu cầu thay đổi lịch
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
                                <ScheduleChangeRequestTable
                                    displayedRequests={displayedRequests}
                                    isSmallScreen={isSmallScreen}
                                    isMediumScreen={isMediumScreen}
                                    handleCheckSchedule={handleCheckSchedule}
                                    handleApproveRequest={handleApproveRequest}
                                    handleRejectRequest={handleRejectRequest}
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

            {/* Dialog xác nhận từ chối yêu cầu */}
            <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Từ chối yêu cầu thay đổi lịch học</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Bạn có chắc chắn muốn từ chối yêu cầu này?
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Lý do từ chối (tùy chọn)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Nhập lý do từ chối yêu cầu..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRejectDialog} color="inherit">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmReject}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Từ chối'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ScheduleChangeRequests;