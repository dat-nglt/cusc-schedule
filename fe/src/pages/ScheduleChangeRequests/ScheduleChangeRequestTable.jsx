import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Chip,
    Typography,
} from '@mui/material';
import { Schedule, CheckCircle, Cancel, Menu as MenuIcon } from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';
import { getSlotNumber, getSlotTime } from '../../components/ui/SlotChip';

// Chuyển trạng thái từ tiếng Anh sang tiếng Việt
const getVietnameseStatus = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'Chờ duyệt';
        case 'approved':
            return 'Đã duyệt';
        case 'rejected':
            return 'Từ chối';
        default:
            return status;
    }
};

export default function ScheduleChangeRequestTable({
    displayedRequests,
    isSmallScreen,
    isMediumScreen,
    handleCheckSchedule,
    handleApproveRequest,
    handleRejectRequest
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);

    // Hàm mở menu
    const handleOpenMenu = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(id);
    };

    // Hàm đóng menu
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    // Hàm format ngày
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('vi-VN');
    };



    // Component hiển thị thông tin lịch
    const ScheduleInfo = ({ schedule, isOriginal = false, requestedSlotId = null, originalDate, originalSlot, originalRoom, status }) => {
        if (!schedule && !originalDate) return <Typography variant="body2">-</Typography>;

        // Xử lý cho trường hợp đã được duyệt (APPROVED)
        if (status === 'APPROVED' && isOriginal) {
            return (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {formatDate(originalDate)}
                    </Typography>
                    <Typography variant="caption" display="block">
                        Tiết {getSlotNumber(originalSlot)}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#888', fontSize: '0.75rem' }}>
                        {getSlotTime(originalSlot)}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#666' }}>
                        Phòng: {originalRoom}
                    </Typography>
                </Box>
            );
        }

        // Xử lý cho trường hợp thông thường
        if (schedule) {
            const slotToDisplay = isOriginal ? schedule.slot_id : (requestedSlotId || schedule.slot_id);
            const roomToDisplay = isOriginal
                ? schedule.room_id
                : (schedule.room_name || schedule.room_id_request || schedule.room_id);

            return (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: isOriginal ? '#1976d2' : '#ff9800' }}>
                        {formatDate(schedule.date)}
                    </Typography>
                    <Typography variant="caption" display="block">
                        Tiết {getSlotNumber(slotToDisplay)}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#888', fontSize: '0.75rem' }}>
                        {getSlotTime(slotToDisplay)}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#666' }}>
                        Phòng: {roomToDisplay}
                    </Typography>
                </Box>
            );
        }

        return <Typography variant="body2">-</Typography>;
    };
    console.log('displayedRequests', displayedRequests);


    return (
        <Table
            sx={{
                minWidth: isSmallScreen ? 300 : isMediumScreen ? 700 : 1000,
                border: '1px solid #e0e0e0',
                width: '100%',
                tableLayout: 'fixed',
            }}
        >
            <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    {!isSmallScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '14%' }}>
                            Mã YC
                        </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '25%' : '15%' }}>
                        Giảng viên
                    </TableCell>
                    {!isSmallScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '18%' }}>
                            Lịch gốc
                        </TableCell>
                    )}
                    {!isSmallScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '18%' }}>
                            Lịch yêu cầu
                        </TableCell>
                    )}
                    {!isMediumScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: '15%' }}>
                            Lý do
                        </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '20%' : '10%' }}>
                        Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '30%' : '10%' }}>
                        Thao tác
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {displayedRequests.map((request, index) => (
                    <TableRow
                        key={request.request_id}
                        sx={{
                            backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                            '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >

                        {!isSmallScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                {request.request_id}
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {request.lecturer?.name || request.lecturer_id}
                            </Typography>
                            {isSmallScreen && (
                                <Typography variant="caption" display="block" sx={{ color: '#666', mt: 0.5 }}>
                                    Mã: {request.request_id}
                                </Typography>
                            )}
                        </TableCell>
                        {!isSmallScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <ScheduleInfo
                                    schedule={request.classSchedule}
                                    isOriginal={true}
                                    originalDate={request.original_date}
                                    originalSlot={request.original_slot_id}
                                    originalRoom={request.original_room_id}
                                    status={request.status}
                                />
                            </TableCell>
                        )}
                        {!isSmallScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <ScheduleInfo
                                    schedule={{
                                        date: request.requested_date,
                                        room_name: request.requestedRoom?.room_name,
                                        room_id_request: request.requestedRoom?.room_id,
                                        room_id: request.requested_room_id
                                    }}
                                    isOriginal={false}
                                    requestedSlotId={request.requested_slot_id}
                                    status={request.status}
                                />
                            </TableCell>
                        )}
                        {!isMediumScreen && (
                            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <Typography variant="body2" sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}>
                                    {request.reason || '-'}
                                </Typography>
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {getStatusChip(getVietnameseStatus(request.status))}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            {isSmallScreen ? (
                                <>
                                    <Tooltip title="Thao tác">
                                        <IconButton
                                            onClick={(event) => handleOpenMenu(event, request.request_id)}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedRowId === request.request_id}
                                        onClose={handleCloseMenu}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem

                                            onClick={() => {
                                                handleCheckSchedule(request.request_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Schedule sx={{ mr: 1, color: '#1976d2' }} />
                                            Kiểm tra lịch
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleApproveRequest(request.request_id);
                                                handleCloseMenu();
                                            }}
                                            disabled={request.status?.toLowerCase() !== 'pending'}
                                        >
                                            <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
                                            Duyệt
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleRejectRequest(request.request_id);
                                                handleCloseMenu();
                                            }}
                                            disabled={request.status?.toLowerCase() !== 'pending'}
                                        >
                                            <Cancel sx={{ mr: 1, color: '#d32f2f' }} />
                                            Từ chối
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Tooltip title="Kiểm tra lịch">
                                        <Schedule
                                            color="primary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleCheckSchedule(request.request_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Duyệt">
                                        <CheckCircle
                                            sx={{
                                                color: request.status?.toLowerCase() === 'pending' ? '#4caf50' : '#ccc',
                                                cursor: request.status?.toLowerCase() === 'pending' ? 'pointer' : 'not-allowed'
                                            }}
                                            onClick={() => request.status?.toLowerCase() === 'pending' && handleApproveRequest(request.request_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Từ chối">
                                        <Cancel
                                            sx={{
                                                color: request.status?.toLowerCase() === 'pending' ? '#d32f2f' : '#ccc',
                                                cursor: request.status?.toLowerCase() === 'pending' ? 'pointer' : 'not-allowed'
                                            }}
                                            onClick={() => request.status?.toLowerCase() === 'pending' && handleRejectRequest(request.request_id)}
                                        />
                                    </Tooltip>
                                </Box>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
