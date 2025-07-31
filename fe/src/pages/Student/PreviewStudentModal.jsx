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
import { importStudentsAPI } from '../../api/studentAPI';
import { getRowStatus, getErrorChip } from '../../components/ui/ErrorChip';

export default function PreviewStudentModal({ open, onClose, previewData, fetchStudents, classes }) {
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState('');
    const [importMessage, setImportMessage] = useState('');

    // Validate preview data with class checking
    const validatePreviewData = (data) => {
        return data.map(row => {
            let errors = row.errors || [];

            // If there are already errors, keep only the first one
            if (errors.length > 0) {
                errors = [errors[0]];
            } else {
                // Check if class_id exists in classes array (if class is provided)
                if (row.class && row.class.trim() !== '') {
                    const classExists = classes && classes.some(cls => cls.class_id === row.class.trim());
                    if (!classExists) {
                        errors = [`Mã lớp "${row.class}" không tồn tại trong hệ thống`];
                    }
                }
            }

            return {
                ...row,
                errors
            };
        });
    };

    // Validate data with class checking
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
                const { errors: _errors, rowIndex: _rowIndex, ...studentData } = row;
                // Map class to class_id for API
                if (studentData.class) {
                    studentData.class_id = studentData.class;
                }
                return studentData;
            });
            console.log('Valid data to import:', validData);
            // Gọi API import với dữ liệu đã được validate
            const response = await importStudentsAPI(validData);

            if (response.data) {
                setImportMessage(`Thêm thành công ${validRows.length} học viên`);
                setImportError('');
                fetchStudents(); // Gọi lại hàm fetch để cập nhật danh sách học viên
                // Delay để người dùng thấy thông báo thành công trước khi đóng modal
                setTimeout(() => {
                    onClose();
                    setImportMessage("");
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
    }
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Typography >Xem trước dữ liệu học viên</Typography>
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
                                            <TableCell>Mã HV</TableCell>
                                            <TableCell>Họ tên</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>SĐT</TableCell>
                                            <TableCell>Giới tính</TableCell>

                                            <TableCell>Địa chỉ</TableCell>
                                            <TableCell>Lớp</TableCell>
                                            <TableCell>Năm nhập học</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {validRows.map((student, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{student.student_id}</TableCell>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                <TableCell>{student.phone_number}</TableCell>
                                                <TableCell>{student.gender}</TableCell>
                                                <TableCell>{student.address}</TableCell>
                                                <TableCell>
                                                    {student.class ? (
                                                        <Chip
                                                            label={student.class}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>{student.admission_year}</TableCell>
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
                                            <TableCell>Mã HV</TableCell>
                                            <TableCell>Họ tên</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>SĐT</TableCell>
                                            <TableCell>Giới tính</TableCell>
                                            <TableCell>Địa chỉ</TableCell>
                                            <TableCell>Lớp</TableCell>
                                            <TableCell>Năm nhập học</TableCell>
                                            <TableCell>Lỗi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {errorRows.map((student, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ bgcolor: 'error.lighter' }}
                                            >
                                                <TableCell>{student.student_id || '-'}</TableCell>
                                                <TableCell>{student.name || '-'}</TableCell>
                                                <TableCell>{student.email || '-'}</TableCell>
                                                <TableCell>{student.phone_number || '-'}</TableCell>
                                                <TableCell>{student.gender || '-'}</TableCell>
                                                <TableCell>{student.address || '-'}</TableCell>
                                                <TableCell>
                                                    {student.class ? (
                                                        <Chip
                                                            label={student.class}
                                                            size="small"
                                                            color={student.errors.some(err => err.includes('Mã lớp')) ? 'error' : 'default'}
                                                            variant="outlined"
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>{student.admission_year || '-'}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                        {student.errors.map((error) => getErrorChip(error, 'học viên'))}
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
                            `Thêm ${validRows.length} học viên`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
