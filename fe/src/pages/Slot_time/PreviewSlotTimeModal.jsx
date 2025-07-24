import React, { useState } from 'react';
import {
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
    Typography,
    Box,
    Alert,
    CircularProgress,
    Chip,
} from '@mui/material';

export default function PreviewSlotTimeModal({ open, onClose, previewData, fetchSlotTimes }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleConfirmImport = async () => {
        if (previewData.length === 0) {
            setError('Không có dữ liệu để import!');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Gọi API để thêm nhiều slot time
            const response = await fetch('/api/slot-times/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slotTimes: previewData }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setSuccess(`Đã import thành công ${result.addedCount || previewData.length} khung giờ!`);

            // Refresh data
            if (fetchSlotTimes) {
                await fetchSlotTimes();
            }

            // Close modal after 2 seconds
            setTimeout(() => {
                onClose();
                setSuccess('');
            }, 2000);

        } catch (error) {
            console.error('Error importing slot times:', error);
            setError('Có lỗi xảy ra khi import dữ liệu. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'hoạt động':
            case 'active':
                return 'success';
            case 'tạm dừng':
                return 'warning';
            case 'đã kết thúc':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'sáng':
                return 'primary';
            case 'chiều':
                return 'secondary';
            case 'tối':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Typography variant="h6">
                    Xem trước dữ liệu khung giờ ({previewData.length} bản ghi)
                </Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box sx={{ mt: 2 }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã khung giờ</TableCell>
                                    <TableCell>Tên khung giờ</TableCell>
                                    <TableCell>Buổi học</TableCell>
                                    <TableCell>Thời gian bắt đầu</TableCell>
                                    <TableCell>Thời gian kết thúc</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewData.map((slot, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{slot.slot_id}</TableCell>
                                        <TableCell>{slot.slot_name}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={slot.type}
                                                color={getTypeColor(slot.type)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{slot.start_time}</TableCell>
                                        <TableCell>{slot.end_time}</TableCell>
                                        <TableCell>
                                            {slot.description && slot.description.length > 30
                                                ? `${slot.description.substring(0, 30)}...`
                                                : slot.description || 'Không có mô tả'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={slot.status}
                                                color={getStatusColor(slot.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {previewData.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Không có dữ liệu để hiển thị
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    disabled={loading}
                    sx={{ color: '#1976d2' }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleConfirmImport}
                    variant="contained"
                    disabled={loading || previewData.length === 0}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? 'Đang import...' : `Import ${previewData.length} khung giờ`}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
