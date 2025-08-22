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
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Visibility, Edit, Delete, MoreVert, Email, Phone } from '@mui/icons-material';
import { getStatusChip } from '../../components/ui/StatusChip';
import { formatDateTime } from '../../utils/formatDateTime';

export default function StudentTable({
    displayedStudents,
    handleViewStudent,
    handleEditStudent,
    handleDeleteStudent
}) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);

    const handleOpenMenu = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(id);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    return (
        <Box sx={{ width: '100%', overflow: 'auto' }}>
            <Table
                sx={{
                    minWidth: 650,
                    border: '1px solid #e0e0e0',
                    tableLayout: 'fixed',
                }}
            >
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: '8%',
                                py: 1.5
                            }}
                        >
                            STT
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: '15%',
                                display: isSmallScreen ? 'none' : 'table-cell',
                                py: 1.5
                            }}
                        >
                            Mã học viên
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: isSmallScreen ? '30%' : '20%',
                                py: 1.5
                            }}
                        >
                            Họ tên
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: '12%',
                                display: isMediumScreen ? 'none' : 'table-cell',
                                py: 1.5
                            }}
                        >
                            Mã lớp
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: '20%',
                                display: isMediumScreen ? 'none' : 'table-cell',
                                py: 1.5
                            }}
                        >
                            Liên hệ
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: '15%',
                                display: isSmallScreen ? 'none' : 'table-cell',
                                py: 1.5
                            }}
                        >
                            Năm nhập học
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: '15%',
                                py: 1.5
                            }}
                        >
                            Trạng thái
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                width: '10%',
                                py: 1.5
                            }}
                        >
                            Thao tác
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayedStudents.map((student, index) => (
                        <TableRow
                            key={student.student_id}
                            sx={{
                                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                                '&:hover': { backgroundColor: '#f1f8ff' },
                                borderBottom: '1px solid #e0e0e0',
                            }}
                        >
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5
                                }}
                            >
                                {index + 1}
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5,
                                    display: isSmallScreen ? 'none' : 'table-cell'
                                }}
                            >
                                {student.student_id}
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {student.name}
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5,
                                    display: isMediumScreen ? 'none' : 'table-cell'
                                }}
                            >
                                {student.class_id ? (
                                    <Chip
                                        label={student.class?.class_id || student.class_id}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold', maxWidth: '100%' }}
                                    />
                                ) : (
                                    <Chip
                                        label="Chưa có lớp"
                                        size="small"
                                        color="default"
                                        variant="outlined"
                                    />
                                )}
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center', // Căn giữa toàn bộ nội dung trong ô
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5,
                                    display: isMediumScreen ? 'none' : 'table-cell'
                                }}
                            >
                                <Box sx={{ fontSize: '0.85rem' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, justifyContent: 'center' }}>
                                        <Email sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {student.account?.email || 'N/A'}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                                        <Box>
                                            {student.phone_number || 'N/A'}
                                        </Box>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5,
                                    display: isSmallScreen ? 'none' : 'table-cell'
                                }}
                            >
                                {formatDateTime(student.admission_year)}
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {getStatusChip(student.status)}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    py: 1.5
                                }}
                            >
                                <Tooltip title="Thao tác">
                                    <IconButton
                                        size="small"
                                        onClick={(event) => handleOpenMenu(event, student.student_id)}
                                        sx={{
                                            color: 'text.secondary',
                                            '&:hover': {
                                                backgroundColor: 'primary.light',
                                                color: 'primary.contrastText'
                                            }
                                        }}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </Tooltip>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl) && selectedRowId === student.student_id}
                                    onClose={handleCloseMenu}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left'
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            handleViewStudent(student.student_id);
                                            handleCloseMenu();
                                        }}
                                        sx={{ py: 1 }}
                                    >
                                        <Visibility sx={{ mr: 1.5, fontSize: '20px', color: 'info.main' }} />
                                        Xem chi tiết
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleEditStudent(student.student_id);
                                            handleCloseMenu();
                                        }}
                                        sx={{ py: 1 }}
                                    >
                                        <Edit sx={{ mr: 1.5, fontSize: '20px', color: 'primary.main' }} />
                                        Chỉnh sửa
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleDeleteStudent(student.student_id);
                                            handleCloseMenu();
                                        }}
                                        sx={{ py: 1 }}
                                    >
                                        <Delete sx={{ mr: 1.5, fontSize: '20px', color: 'error.main' }} />
                                        Xóa
                                    </MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    )
}