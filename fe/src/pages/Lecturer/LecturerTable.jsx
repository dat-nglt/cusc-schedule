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
                        key={lecturer.lecturer_id}
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
                                {lecturer.lecturer_id}
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {lecturer.name}
                        </TableCell>
                        {!isSmallScreen && (
                            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {/* {lecturer.department.slice(0, 2).map((d, idx) => (
                                        <Chip
                                            key={idx}
                                            label={d}
                                            size="small"
                                            sx={{ fontSize: '0.7rem', maxWidth: '120px' }}
                                        />
                                    ))}
                                    {lecturer.department.length > 2 && (
                                        <Chip
                                            label={`+${lecturer.department.length - 2}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                    )} */}
                                </Box>
                            </TableCell>
                        )}
                        {!isMediumScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <Box sx={{ fontSize: '0.85rem' }}>
                                    <div>{lecturer.email}</div>
                                    <div style={{ color: '#666', marginTop: '2px' }}>{lecturer.phone_number}</div>
                                </Box>
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {getStatusChip(lecturer.status)}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            {isSmallScreen ? (
                                <>
                                    <Tooltip title="Thao tác">
                                        <IconButton
                                            onClick={(event) => handleOpenMenu(event, lecturer.lecturer_id)}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedRowId === lecturer.lecturer_id}
                                        onClose={handleCloseMenu}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleViewLecturer(lecturer.lecturer_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                                            Xem
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleEditLecturer(lecturer.lecturer_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Edit sx={{ mr: 1, color: '#1976d2' }} />
                                            Sửa
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleDeleteLecturer(lecturer.lecturer_id);
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
                                            onClick={() => handleViewLecturer(lecturer.lecturer_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Sửa">
                                        <Edit
                                            color="primary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleEditLecturer(lecturer.lecturer_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <Delete
                                            color="error"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteLecturer(lecturer.lecturer_id)}
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
