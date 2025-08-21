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
} from '@mui/material';
import { Visibility, Edit, Delete, Menu as MenuIcon } from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';
import { formatDateTime } from '../../utils/formatDateTime';

// Chuyển trạng thái từ tiếng Anh sang tiếng Việt
const getVietnameseStatus = (status) => {
    switch (status) {
        case 'active':
            return 'Hoạt động';
        case 'inactive':
            return 'Ngưng hoạt động';
        case 'suspended':
            return 'Tạm ngưng';
        default:
            return status;
    }
};

export default function SemesterTable({ displayedSemesters, isSmallScreen, isMediumScreen, handleViewSemester, handleEditSemester, handleDeleteSemester }) {
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

    return (
        <Table
            sx={{
                minWidth: isSmallScreen ? 300 : isMediumScreen ? 500 : 650,
                border: '1px solid #e0e0e0',
                width: '100%',
                tableLayout: 'fixed',
            }}
        >
            <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '8%' }}>
                        STT
                    </TableCell>
                    {!isSmallScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '20%' }}>
                            Mã học kỳ
                        </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '20%' : '15%' }}>
                        Tên học kỳ
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '25%' : '15%' }}>
                        Số tuần
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12%' }}>
                        Bắt đầu
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12%' }}>
                        Kết thúc
                    </TableCell>

                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '25%' : '15%' }}>
                        Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '27%' : '15%' }}>
                        Thao tác
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {displayedSemesters.map((semester, index) => (
                    <TableRow
                        key={semester.semester_id}
                        sx={{
                            backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                            '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {index + 1}
                        </TableCell>
                        {!isSmallScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                {semester.semester_id}
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {semester.semester_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {semester.duration_weeks ? `${semester.duration_weeks} tuần` : 'Chưa xác định'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {semester.start_date ? formatDateTime(semester.start_date) : 'Chưa xác định'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {semester.end_date ? formatDateTime(semester.end_date) : 'Chưa xác định'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {/* Sử dụng getStatusChip để hiển thị màu trạng thái */}
                            {getStatusChip(getVietnameseStatus(semester.status))}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            {isSmallScreen ? (
                                <>
                                    <Tooltip title="Thao tác">
                                        <IconButton
                                            onClick={(event) => handleOpenMenu(event, semester.semester_id)}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedRowId === semester.semester_id}
                                        onClose={handleCloseMenu}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleViewSemester(semester.semester_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                                            Xem
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleEditSemester(semester.semester_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Edit sx={{ mr: 1, color: '#1976d2' }} />
                                            Sửa
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleDeleteSemester(semester.semester_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Delete sx={{ mr: 1, color: '#d32f2f' }} />
                                            Xóa
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Tooltip title="Xem">
                                        <Visibility
                                            color="primary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleViewSemester(semester.semester_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Sửa">
                                        <Edit
                                            color="primary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleEditSemester(semester.semester_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <Delete
                                            color="error"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteSemester(semester.semester_id)}
                                        />
                                    </Tooltip>
                                </Box>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
