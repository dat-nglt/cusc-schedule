import React, { useState } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton
} from '@mui/material';
import {
    Warning as WarningIcon,
    Close as CloseIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ConflictDetailsModal({ open, onClose, conflicts }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WarningIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="h6">Chi tiết xung đột</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Loại xung đột</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Giảng viên</TableCell>
                                <TableCell>Phòng học</TableCell>
                                <TableCell>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {conflicts.map((conflict) => (
                                <TableRow key={conflict.id} sx={{
                                    backgroundColor: conflict.status === 'Chưa giải quyết' ? 'rgba(255, 0, 0, 0.05)' : 'inherit'
                                }}>
                                    <TableCell>{conflict.type}</TableCell>
                                    <TableCell>{conflict.description}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                                            {conflict.time}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{conflict.teacher}</TableCell>
                                    <TableCell>{conflict.room}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={conflict.status}
                                            color={conflict.status === 'Chưa giải quyết' ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
                <Button
                    onClick={() => alert('Chức năng giải quyết xung đột')}
                    variant="contained"
                    color="error"
                >
                    Giải quyết xung đột
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConflictDetailsModal;