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

export default function LecturerTable({ displayedLecturers, isSmallScreen, isMediumScreen, handleViewLecturer, handleEditLecturer, handleDeleteLecturer }) {
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

    // Hàm hiển thị trạng thái với màu sắc
    const getStatusChip = (status) => {
        const statusColors = {
            'Hoạt động': { color: '#4caf50', bgcolor: '#e8f5e8' },
            'Tạm nghỉ': { color: '#f57c00', bgcolor: '#fff3e0' },
            'Đang dạy': { color: '#2196f3', bgcolor: '#e3f2fd' }
        };
        const style = statusColors[status] || { color: '#757575', bgcolor: '#f5f5f5' };

        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    color: style.color,
                    bgcolor: style.bgcolor,
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                }}
            />
        );
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
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12%' }}>
                            Mã GV
                        </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '40%' : '18%' }}>
                        Họ tên
                    </TableCell>
                    {!isSmallScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: '25%' }}>
                            Môn giảng dạy
                        </TableCell>
                    )}
                    {!isMediumScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '20%' }}>
                            Liên hệ
                        </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '25%' : '12%' }}>
                        Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '27%' : '10%' }}>
                        Thao tác
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {displayedLecturers.map((lecturer, index) => (
                    <TableRow
                        key={lecturer.id}
                        sx={{
                            backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                            '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {lecturer.stt}
                        </TableCell>
                        {!isSmallScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                {lecturer.maGiangVien}
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {lecturer.hoTen}
                        </TableCell>
                        {!isSmallScreen && (
                            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {lecturer.monGiangDay.slice(0, 2).map((mon, idx) => (
                                        <Chip
                                            key={idx}
                                            label={mon}
                                            size="small"
                                            sx={{ fontSize: '0.7rem', maxWidth: '120px' }}
                                        />
                                    ))}
                                    {lecturer.monGiangDay.length > 2 && (
                                        <Chip
                                            label={`+${lecturer.monGiangDay.length - 2}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                    )}
                                </Box>
                            </TableCell>
                        )}
                        {!isMediumScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <Box sx={{ fontSize: '0.85rem' }}>
                                    <div>{lecturer.lienHe.email}</div>
                                    <div style={{ color: '#666', marginTop: '2px' }}>{lecturer.lienHe.soDienThoai}</div>
                                </Box>
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {getStatusChip(lecturer.trangThai)}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            {isSmallScreen ? (
                                <>
                                    <Tooltip title="Thao tác">
                                        <IconButton
                                            onClick={(event) => handleOpenMenu(event, lecturer.id)}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedRowId === lecturer.id}
                                        onClose={handleCloseMenu}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleViewLecturer(lecturer.id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                                            Xem
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleEditLecturer(lecturer.id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Edit sx={{ mr: 1, color: '#1976d2' }} />
                                            Sửa
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleDeleteLecturer(lecturer.id);
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
                                            onClick={() => handleViewLecturer(lecturer.id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Sửa">
                                        <Edit
                                            color="primary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleEditLecturer(lecturer.id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <Delete
                                            color="error"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteLecturer(lecturer.id)}
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
