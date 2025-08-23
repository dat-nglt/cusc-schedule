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
    useMediaQuery,
    useTheme,
    Chip
} from '@mui/material';
import { Visibility, Edit, Delete, MoreVert, Email, Phone } from '@mui/icons-material';
import { getStatusForLectuer } from '../../components/ui/StatusChip';

export default function LecturerTable({
    displayedLecturers,
    handleViewLecturer,
    handleEditLecturer,
    handleDeleteLecturer
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
                                width: '20%',
                                display: isSmallScreen ? 'none' : 'table-cell',
                                py: 1.5
                            }}
                        >
                            Mã GV
                        </TableCell>
                        <TableCell
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                textAlign: 'center',
                                borderRight: '1px solid #e0e0e0',
                                width: isSmallScreen ? '30%' : '30%',
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
                                width: '15%',
                                display: isSmallScreen ? 'none' : 'table-cell',
                                py: 1.5
                            }}
                        >
                            Khoa bộ môn
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
                    {displayedLecturers.map((lecturer, index) => (
                        <TableRow
                            key={lecturer.lecturer_id}
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
                                {lecturer.lecturer_id}
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
                                {lecturer.name}
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5,
                                    display: isSmallScreen ? 'none' : 'table-cell'
                                }}
                            >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                                    {lecturer.department ? (
                                        <Chip
                                            key={lecturer.lecturer_id}
                                            label={lecturer.department}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontSize: '0.7rem', height: 24 }}
                                        />
                                    ) : (
                                        <Box sx={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic', textAlign: 'center' }}>
                                            Chưa trực thuộc khoa
                                        </Box>
                                    )}
                                    {lecturer.subjects && lecturer.subjects.length > 2 && (
                                        <Chip
                                            label={`+${lecturer.subjects.length - 2}`}
                                            size="small"
                                            sx={{ fontSize: '0.7rem', height: 24 }}
                                        />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderRight: '1px solid #e0e0e0',
                                    py: 1.5
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    {getStatusForLectuer(lecturer.status)}
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
                                        onClick={(event) => handleOpenMenu(event, lecturer.lecturer_id)}
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
                                    open={Boolean(anchorEl) && selectedRowId === lecturer.lecturer_id}
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
                                            handleViewLecturer(lecturer.lecturer_id);
                                            handleCloseMenu();
                                        }}
                                        sx={{ py: 1 }}
                                    >
                                        <Visibility sx={{ mr: 1.5, fontSize: '20px', color: 'info.main' }} />
                                        Xem chi tiết
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleEditLecturer(lecturer.lecturer_id);
                                            handleCloseMenu();
                                        }}
                                        sx={{ py: 1 }}
                                    >
                                        <Edit sx={{ mr: 1.5, fontSize: '20px', color: 'primary.main' }} />
                                        Chỉnh sửa
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            handleDeleteLecturer(lecturer.lecturer_id);
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