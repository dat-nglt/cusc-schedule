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
    LinearProgress,
    Alert,
    Grid,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import { importStudentsAPI } from '../../api/studentAPI';
import { getRowStatus, getErrorChip } from '../../components/ui/ErrorChip';

export default function PreviewStudentModal({ open, onClose, previewData, fetchStudents, classes }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
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
            setImportError('Không có dữ liệu hợp lệ để thêm!');
            return;
        }

        setIsImporting(true);
        setImportError('');
        setImportMessage('');

        try {
            const validData = validRows.map(row => {
                const { errors: _errors, rowIndex: _rowIndex, ...studentData } = row;
                if (studentData.class) {
                    studentData.class_id = studentData.class;
                }
                return studentData;
            });
            
            const response = await importStudentsAPI(validData);

            if (response.data) {
                setImportMessage(`✅ Đã thêm thành công ${validRows.length} học viên vào hệ thống`);
                setImportError('');
                fetchStudents();
                
                setTimeout(() => {
                    onClose();
                    setImportMessage("");
                }, 2000);
            } else {
                setImportError(response.data?.message || 'Có lỗi xảy ra khi thêm dữ liệu!');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            setImportError(error.response?.data?.message || 'Lỗi hệ thống khi thêm dữ liệu! Vui lòng thử lại.');
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xl" 
            fullWidth
            fullScreen={isSmallScreen}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: theme.palette.primary.main, 
                color: 'white',
                py: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <InfoIcon />
                <Typography variant="h6" fontWeight="600">
                    Xem trước dữ liệu học viên
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Thông báo trạng thái */}
                {importError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {importError}
                    </Alert>
                )}
                {importMessage && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                        {importMessage}
                    </Alert>
                )}

                {/* Progress bar khi đang import */}
                {isImporting && (
                    <Box sx={{ mb: 3 }}>
                        <LinearProgress 
                            sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                mb: 1 
                            }} 
                        />
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Đang thêm dữ liệu học viên...
                        </Typography>
                    </Box>
                )}

                {/* Thống kê tổng quan */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                p: 2, 
                                textAlign: 'center',
                                bgcolor: 'success.light',
                                color: 'success.contrastText',
                                borderRadius: 2
                            }}
                        >
                            <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {validRows.length}
                            </Typography>
                            <Typography variant="body2">Hợp lệ</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                p: 2, 
                                textAlign: 'center',
                                bgcolor: errorRows.length > 0 ? 'error.light' : 'grey.100',
                                color: errorRows.length > 0 ? 'error.contrastText' : 'grey.600',
                                borderRadius: 2
                            }}
                        >
                            <ErrorIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {errorRows.length}
                            </Typography>
                            <Typography variant="body2">Không hợp lệ</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper 
                            elevation={1} 
                            sx={{ 
                                p: 2, 
                                textAlign: 'center',
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                borderRadius: 2
                            }}
                        >
                            <WarningAmberIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                                {previewData.length}
                            </Typography>
                            <Typography variant="body2">Tổng cộng</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Hiển thị dữ liệu hợp lệ */}
                {validRows.length > 0 && (
                    <Accordion 
                        defaultExpanded 
                        sx={{ 
                            mb: 2,
                            borderRadius: 2,
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                                bgcolor: 'success.light',
                                color: 'success.contrastText',
                                borderRadius: 2,
                                '&:hover': { bgcolor: 'success.main' }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleIcon />
                                <Typography variant="h6" fontWeight="600">
                                    Dữ liệu hợp lệ ({validRows.length} học viên)
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <TableContainer 
                                component={Paper} 
                                sx={{ 
                                    maxHeight: 400,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'success.light'
                                }}
                            >
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'success.lighter' }}>Mã HV</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'success.lighter' }}>Họ tên</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'success.lighter' }}>Email</TableCell>
                                            {!isSmallScreen && (
                                                <>
                                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'success.lighter' }}>SĐT</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'success.lighter' }}>Giới tính</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'success.lighter' }}>Lớp</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'success.lighter' }}>Năm nhập học</TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {validRows.map((student, index) => (
                                            <TableRow 
                                                key={index}
                                                hover
                                                sx={{ 
                                                    '&:nth-of-type(even)': { bgcolor: 'success.50' },
                                                    '&:last-child td': { borderBottom: 0 }
                                                }}
                                            >
                                                <TableCell>
                                                    <Chip 
                                                        label={student.student_id} 
                                                        size="small" 
                                                        color="success" 
                                                        variant="outlined" 
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {student.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{student.email}</TableCell>
                                                {!isSmallScreen && (
                                                    <>
                                                        <TableCell>{student.phone_number}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={student.gender || 'Khác'} 
                                                                size="small" 
                                                                variant="outlined" 
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {student.class ? (
                                                                <Chip
                                                                    label={student.class}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                                    Chưa phân lớp
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{student.admission_year}</TableCell>
                                                    </>
                                                )}
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
                    <Accordion 
                        defaultExpanded 
                        sx={{ 
                            borderRadius: 2,
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                                bgcolor: 'error.light',
                                color: 'error.contrastText',
                                borderRadius: 2,
                                '&:hover': { bgcolor: 'error.main' }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ErrorIcon />
                                <Typography variant="h6" fontWeight="600">
                                    Dữ liệu không hợp lệ ({errorRows.length} học viên)
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <TableContainer 
                                component={Paper} 
                                sx={{ 
                                    maxHeight: 400,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'error.light'
                                }}
                            >
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'error.lighter' }}>Mã HV</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'error.lighter' }}>Họ tên</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'error.lighter' }}>Lỗi</TableCell>
                                            {!isSmallScreen && (
                                                <>
                                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'error.lighter' }}>Email</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'error.lighter' }}>Lớp</TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {errorRows.map((student, index) => (
                                            <TableRow
                                                key={index}
                                                hover
                                                sx={{ 
                                                    bgcolor: 'error.50',
                                                    '&:hover': { bgcolor: 'error.100' },
                                                    '&:last-child td': { borderBottom: 0 }
                                                }}
                                            >
                                                <TableCell>
                                                    <Typography variant="body2" color="error.main">
                                                        {student.student_id || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {student.name || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        {student.errors.map((error, errorIndex) => (
                                                            <Chip
                                                                key={errorIndex}
                                                                label={error}
                                                                size="small"
                                                                color="error"
                                                                variant="filled"
                                                                sx={{ 
                                                                    fontSize: '0.75rem',
                                                                    height: 'auto',
                                                                    py: 0.5
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </TableCell>
                                                {!isSmallScreen && (
                                                    <>
                                                        <TableCell>{student.email || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            {student.class ? (
                                                                <Chip
                                                                    label={student.class}
                                                                    size="small"
                                                                    color="error"
                                                                    variant="outlined"
                                                                />
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                                    Không có
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Hướng dẫn */}
                {errorRows.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                        <Typography variant="body2">
                            <strong>Lưu ý:</strong> Chỉ những học viên hợp lệ sẽ được thêm vào hệ thống. 
                            Vui lòng kiểm tra và sửa các lỗi trước khi thử lại.
                        </Typography>
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined" 
                    disabled={isImporting}
                    sx={{ 
                        borderRadius: 2,
                        minWidth: 100
                    }}
                >
                    Đóng
                </Button>
                <Button
                    onClick={handleConfirmImport}
                    variant="contained"
                    disabled={validRows.length === 0 || isImporting || importMessage}
                    sx={{ 
                        borderRadius: 2,
                        minWidth: 200,
                        bgcolor: 'success.main',
                        '&:hover': { bgcolor: 'success.dark' },
                        '&:disabled': { bgcolor: 'grey.300' }
                    }}
                >
                    {isImporting ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>Đang thêm...</span>
                        </Box>
                    ) : importMessage ? (
                        '✅ Đã hoàn thành'
                    ) : (
                        `Thêm ${validRows.length} học viên hợp lệ`
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}