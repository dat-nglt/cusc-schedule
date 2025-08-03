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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { importTimeslotsFromJsonAPI } from '../../api/timeslotAPI';
import { getErrorChip, getRowStatus } from '../../components/ui/ErrorChip';

export default function PreviewSlotTimeModal({ open, onClose, previewData, fetchSlotTimes }) {
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState('');
    const [importMessage, setImportMessage] = useState('');

    const validRows = previewData.filter(row => getRowStatus(row) === 'valid');
    const errorRows = previewData.filter(row => getRowStatus(row) === 'error');

    const handleConfirmImport = async () => {
        if (validRows.length === 0) {
            setImportError('Không có dữ liệu hợp lệ!');
            return;
        }

        setIsImporting(true);
        setImportError('');
        setImportMessage('');

        try {
            // Tạo dữ liệu hợp lệ để import
            const validData = validRows.map(row => {
                const { errors: _errors, rowIndex: _rowIndex, ...slotData } = row;
                return slotData;
            });
            console.log('Valid data to import:', validData);

            // Gọi API import với dữ liệu đã được validate
            const response = await importTimeslotsFromJsonAPI(validData);

            if (response.data && response.data) {
                setImportMessage(`Thêm thành công ${validRows.length} khung giờ!`);
                setImportError('');
                fetchSlotTimes(); // Gọi lại hàm fetch để cập nhật danh sách khung giờ

                // Delay để người dùng thấy thông báo thành công trước khi đóng modal
                setTimeout(() => {
                    onClose(); // Đóng modal sau khi cập nhật
                    setImportMessage('');
                }, 1500);
            } else {
                setImportError(response.data?.message || 'Có lỗi xảy ra khi thêm dữ liệu!');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            setImportError(error.message || 'Lỗi khi thêm dữ liệu! Vui lòng thử lại.');
        } finally {
            setIsImporting(false);
        }
    };

    const getTypeColor = (type) => {
        if (!type || typeof type !== 'string') return 'default';

        switch (type.toLowerCase()) {
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
                <Typography>Xem trước dữ liệu đã nhập</Typography>
            </DialogTitle>
            <DialogContent>
                {importError && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {importError}
                    </Typography>
                )}
                {importMessage && (
                    <div style={{
                        marginBottom: '16px',
                        fontWeight: 'bold',
                        color: 'success.main',
                        fontSize: '16px',
                        padding: '8px',
                        backgroundColor: '#f1f8e9',
                        border: '1px solid #4caf50',
                        borderRadius: '4px'
                    }}>
                        {importMessage}
                    </div>
                )}

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip
                            icon={<CheckCircleIcon />}
                            label={`Hợp lệ: ${validRows.length}`}
                            color="success"
                            variant="outlined"
                        />
                        <Chip
                            icon={<ErrorIcon />}
                            label={`Không hợp lệ: ${errorRows.length}`}
                            color="error"
                            variant="outlined"
                        />
                        <Chip
                            label={`Tổng cộng: ${previewData.length}`}
                            variant="outlined"
                        />
                    </Box>
                </Box>

                {/* Hiển thị dữ liệu hợp lệ */}
                {validRows.length > 0 && (
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" color="success.main">
                                Dữ liệu hợp lệ ({validRows.length} dòng)
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                <Table stickyHeader size="small">
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
                                        {validRows.map((slot, index) => (
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
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Hiển thị dữ liệu có lỗi */}
                {errorRows.length > 0 && (
                    <Accordion defaultExpanded sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" color="error.main">
                                Dữ liệu không hợp lệ ({errorRows.length} dòng)
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã khung giờ</TableCell>
                                            <TableCell>Tên khung giờ</TableCell>
                                            <TableCell>Buổi học</TableCell>
                                            <TableCell>Thời gian bắt đầu</TableCell>
                                            <TableCell>Thời gian kết thúc</TableCell>
                                            <TableCell>Mô tả</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell>Lỗi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {errorRows.map((slot, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ bgcolor: 'error.lighter' }}
                                            >
                                                <TableCell>{slot.slot_id || '-'}</TableCell>
                                                <TableCell>{slot.slot_name || '-'}</TableCell>
                                                <TableCell>
                                                    {slot.type && (
                                                        <Chip
                                                            label={slot.type}
                                                            color={getTypeColor(slot.type)}
                                                            size="small"
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>{slot.start_time || '-'}</TableCell>
                                                <TableCell>{slot.end_time || '-'}</TableCell>
                                                <TableCell>
                                                    {slot.description && slot.description.length > 30
                                                        ? `${slot.description.substring(0, 30)}...`
                                                        : slot.description || '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {slot.status && (
                                                        <Chip
                                                            label={slot.status}
                                                            size="small"
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        {slot.errors?.map((error) =>
                                                            getErrorChip(error, 'khung giờ')
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                )}

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
                    disabled={isImporting}
                    sx={{ color: '#1976d2' }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleConfirmImport}
                    variant="contained"
                    disabled={validRows.length === 0 || isImporting || importMessage}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                >
                    {isImporting ? 'Đang thêm...' :
                        importMessage ? 'Đã thêm thành công' :
                            `Thêm ${validRows.length} khung giờ`}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
