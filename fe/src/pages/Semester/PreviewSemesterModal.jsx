import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Tooltip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { importSemestersAPI } from '../../api/semesterAPI';
import { getErrorChip, getRowStatus } from '../../components/ui/ErrorChip';
import { formatDateTime } from '../../utils/formatDateTime';

export default function PreviewSemesterModal({ open, onClose, previewData, fetchSemesters, programs }) {
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState('');
    const [importMessage, setImportMessage] = useState('');

    // Validate preview data with program checking
    const validatePreviewData = (data) => {
        return data.map(row => {
            let errors = row.errors || [];

            // If there are already errors, keep only the first one
            if (errors.length > 0) {
                errors = [errors[0]];
            } else {
                // Check if program_id exists in programs array
                const programValue = row.program_id || row.program; // Check both possible field names
                if (programValue && programValue.trim() !== '') {
                    const programExists = programs && programs.some(p => p.program_id === programValue.trim());
                    if (!programExists) {
                        errors = [`Mã chương trình "${programValue}" không tồn tại trong hệ thống`];
                    }
                }
            }

            return {
                ...row,
                errors
            };
        });
    };

    const validatedData = validatePreviewData(previewData);
    const validRows = validatedData.filter(row => getRowStatus(row) === 'valid');
    const errorRows = validatedData.filter(row => getRowStatus(row) === 'error');


    const handleConfirmImport = async () => {
        if (validRows.length === 0) {
            setImportError('Không có dữ liệu hợp lệ!');
            return;
        }

        setIsImporting(true);
        setImportError('');
        setImportMessage('');

        try {
            // Tạo file Excel tạm thời chỉ với dữ liệu hợp lệ
            const validData = validRows.map(row => {
                const { errors: _errors, rowIndex: _rowIndex, ...semesterData } = row;
                return semesterData;
            });
            console.log('Valid data to import:', validData);
            // Gọi API import với dữ liệu đã được validate
            const response = await importSemestersAPI(validData);

            if (response.data && response.data) {
                setImportMessage(`Thêm thành công ${validRows.length} học kỳ`);
                setImportError('');
                fetchSemesters(); // Gọi lại hàm fetch để cập nhật danh sách học kỳ

                // Delay để người dùng thấy thông báo thành công trước khi đóng modal
                setTimeout(() => {
                    onClose();
                    setImportMessage('');
                    setImportError('');
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
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Typography >Xem trước dữ liệu đã nhập</Typography>
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
                                            <TableCell>Mã học kỳ</TableCell>
                                            <TableCell>Tên học kỳ</TableCell>
                                            <TableCell>Ngày bắt đầu</TableCell>
                                            <TableCell>Ngày kết thúc</TableCell>
                                            <TableCell>Mã chương trình</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {validRows.map((semester, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{semester.semester_id}</TableCell>
                                                <TableCell>{semester.semester_name}</TableCell>
                                                <TableCell>{formatDateTime(semester.start_date)}</TableCell>
                                                <TableCell>{formatDateTime(semester.end_date)}</TableCell>
                                                <TableCell>{semester.program_id}</TableCell>
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
                                            <TableCell>Mã học kỳ</TableCell>
                                            <TableCell>Tên học kỳ</TableCell>
                                            <TableCell>Ngày bắt đầu</TableCell>
                                            <TableCell>Ngày kết thúc</TableCell>
                                            <TableCell>Mã chương trình</TableCell>
                                            <TableCell>Lỗi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {errorRows.map((semester, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ bgcolor: 'error.lighter' }}
                                            >
                                                <TableCell>{semester.semester_id || '-'}</TableCell>
                                                <TableCell>{semester.semester_name || '-'}</TableCell>
                                                <TableCell>{formatDateTime(semester.start_date) || '-'}</TableCell>
                                                <TableCell>{formatDateTime(semester.end_date) || '-'}</TableCell>
                                                <TableCell>{semester.program_id || '-'}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        {semester.errors.map((error) => getErrorChip(error, 'học kỳ'))}
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
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
                            `Thêm ${validRows.length} học kỳ`}
                </Button>
            </DialogActions>
        </Dialog>
    );
}