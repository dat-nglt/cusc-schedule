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
} from '@mui/material';
import { Visibility, Edit, Delete, Menu as MenuIcon } from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';

export default function SubjectTable({ displayedSubjects, isSmallScreen, isMediumScreen, handleViewSubject, handleEditSubject, handleDeleteSubject }) {
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
                            Mã học phần
                        </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '40%' : '18%' }}>
                        Tên học phần
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '40%' : '18%' }}>
                        Số giờ lý thuyết
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '40%' : '18%' }}>
                        Số giờ thực hành
                    </TableCell>
                    {!isMediumScreen && (
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '20%' }}>
                            Học kỳ
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
                {displayedSubjects.map((subject, index) => (
                    <TableRow
                        key={subject.id}
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
                                {subject.subject_id}
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {subject.subject_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {subject.theory_hours}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {subject.practice_hours}
                        </TableCell>
                        {!isMediumScreen && (
                            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                <Box sx={{ fontSize: '0.85rem' }}>
                                    <div>{subject.semester_id}</div>
                                    {/* <div style={{ color: '#666', marginTop: '2px' }}>{subject.phone_number}</div> */}
                                </Box>
                            </TableCell>
                        )}
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                            {getStatusChip(subject.status)}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            {isSmallScreen ? (
                                <>
                                    <Tooltip title="Thao tác">
                                        <IconButton
                                            onClick={(event) => handleOpenMenu(event, subject.subject_id)}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedRowId === subject.subject_id}
                                        onClose={handleCloseMenu}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleViewSubject(subject.subject_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                                            Xem
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleEditSubject(subject.subject_id);
                                                handleCloseMenu();
                                            }}
                                        >
                                            <Edit sx={{ mr: 1, color: '#1976d2' }} />
                                            Sửa
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleDeleteSubject(subject.subject_id);
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
                                            onClick={() => handleViewSubject(subject.subject_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Sửa">
                                        <Edit
                                            color="primary"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleEditSubject(subject.subject_id)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <Delete
                                            color="error"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDeleteSubject(subject.subject_id)}
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
