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
} from '@mui/material';
import {
    Search as SearchIcon,
} from '@mui/icons-material';
import useResponsive from '../../hooks/useResponsive';
import ScheduleChangeRequestTable from './ScheduleChangeRequestTable';
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';

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

    // Dữ liệu mẫu cho yêu cầu thay đổi lịch
    useEffect(() => {
        const sampleData = [
            {
                request_id: 1,
                class_schedule_id: 101,
                lecturer_id: 'GV001',
                lecturer: { lecturer_name: 'Nguyễn Văn A' },
                requested_date: '2024-01-15',
                requested_start_time: '14:00:00',
                requested_end_time: '16:00:00',
                requested_room_id: 'P201',
                requestedRoom: { room_name: 'Phòng 201' },
                originalSchedule: {
                    date: '2024-01-15',
                    start_time: '08:00:00',
                    end_time: '10:00:00',
                    room_name: 'Phòng 101'
                },
                reason: 'mệt nghỉ',
                status: 'pending'
            },
            {
                request_id: 2,
                class_schedule_id: 102,
                lecturer_id: 'GV002',
                lecturer: { lecturer_name: 'Trần Thị B' },
                requested_date: '2024-01-16',
                requested_start_time: '10:00:00',
                requested_end_time: '12:00:00',
                requested_room_id: 'P301',
                requestedRoom: { room_name: 'Phòng 301' },
                originalSchedule: {
                    date: '2024-01-16',
                    start_time: '14:00:00',
                    end_time: '16:00:00',
                    room_name: 'Phòng 202'
                },
                reason: 'Thiết bị phòng học bị hỏng, cần chuyển sang phòng khác',
                status: 'approved'
            },
            {
                request_id: 3,
                class_schedule_id: 103,
                lecturer_id: 'GV003',
                lecturer: { lecturer_name: 'Lê Văn C' },
                requested_date: '2024-01-17',
                requested_start_time: '16:00:00',
                requested_end_time: '18:00:00',
                requested_room_id: 'P102',
                requestedRoom: { room_name: 'Phòng 102' },
                originalSchedule: {
                    date: '2024-01-17',
                    start_time: '08:00:00',
                    end_time: '10:00:00',
                    room_name: 'Phòng 103'
                },
                reason: 'Sinh viên có lịch thi vào buổi sáng',
                status: 'rejected'
            }
        ];
        setRequests(sampleData);
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
    const handleApproveRequest = (id) => {
        console.log('Approve request:', id);
        // Implementation for approve request
        setRequests(prevRequests =>
            prevRequests.map(request =>
                request.request_id === id
                    ? { ...request, status: 'approved' }
                    : request
            )
        );
    };

    // Hàm xử lý từ chối yêu cầu
    const handleRejectRequest = (id) => {
        console.log('Reject request:', id);
        // Implementation for reject request
        setRequests(prevRequests =>
            prevRequests.map(request =>
                request.request_id === id
                    ? { ...request, status: 'rejected' }
                    : request
            )
        );
    };

    // Lọc danh sách yêu cầu dựa trên từ khóa tìm kiếm và trạng thái
    const filteredRequests = requests.filter((request) => {
        const matchesSearchTerm =
            request.request_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.lecturer?.lecturer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.lecturer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.requestedRoom?.room_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.requested_room_id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus
            ? request.status === selectedStatus
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
        </Box>
    );
};

export default ScheduleChangeRequests;
