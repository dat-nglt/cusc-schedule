
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    IconButton,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Chip,
    InputAdornment,
    Fade,
    Paper
} from '@mui/material';
import {
    Close,
    CloudUpload,
    CalendarToday, // For start_date/end_date
    Class, // For semester_id
    School, // For program_id
    PlayCircleFilled, // For 'Đang triển khai'
    DoneAll, // For 'Đang áp dụng' (or similar, depending on status meanings)
    PauseCircleFilled, // For 'Tạm dừng'
    StopCircle, // For 'Đã kết thúc'
    CheckCircle,
    Error as ErrorIcon,
    AccessTime // For semester_name (generic time/period icon)
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewSemesterModal from './PreviewSemesterModal';
import { processExcelDataSemester } from '../../utils/ExcelValidation'; // Assuming this utility is correctly implemented

const statusOptions = [
    { value: 'Đang triển khai', color: 'info', icon: <PlayCircleFilled /> },
    { value: 'Đang mở đăng ký', color: 'primary', icon: <AccessTime /> }, // Using AccessTime as a placeholder, choose a suitable icon
    { value: 'Đang diễn ra', color: 'success', icon: <DoneAll /> },
    { value: 'Tạm dừng', color: 'warning', icon: <PauseCircleFilled /> },
    { value: 'Đã kết thúc', color: 'error', icon: <StopCircle /> }
];

const steps = ['Thông tin cơ bản', 'Thời gian & Trạng thái'];

export default function AddSemesterModal({ open, onClose, onAddSemester, existingSemesters, error, loading, message, fetchSemesters, programs }) {
    const [newSemester, setNewSemester] = useState({
        semester_id: '',
        semester_name: '',
        start_date: '',
        end_date: '',
        status: 'Đang triển khai',
        program_id: '',
    });

    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false); // To track if a file was selected for import

    const handleNext = () => {
        if (activeStep === 0) {
            if (!newSemester.semester_id || !newSemester.semester_name || !newSemester.program_id) {
                setLocalError('Vui lòng điền đầy đủ thông tin cơ bản.');
                return;
            }
        }
        setLocalError('');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setLocalError('');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSemester((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        if (!newSemester.start_date || !newSemester.end_date) {
            setLocalError('Vui lòng điền đầy đủ thông tin thời gian.');
            return;
        }

        const isDuplicate = existingSemesters.some(
            (semester) => semester.semester_id === newSemester.semester_id
        );
        if (isDuplicate) {
            setLocalError(`Mã học kỳ "${newSemester.semester_id}" đã tồn tại.`);
            return;
        }

        const startDate = new Date(newSemester.start_date);
        const endDate = new Date(newSemester.end_date);

        if (startDate >= endDate) {
            setLocalError('Ngày kết thúc phải sau ngày bắt đầu.');
            return;
        }

        const semesterToAdd = {
            ...newSemester,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await onAddSemester(semesterToAdd);

        if (!error && !loading) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setNewSemester({
            semester_id: '',
            semester_name: '',
            start_date: '',
            end_date: '',
            status: 'Đang triển khai',
            program_id: '',
        });
        setActiveStep(0);
        setLocalError('');
        setFileUploaded(false);
    };

    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setLocalError('Vui lòng chọn một file Excel');
            return;
        }

        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            setLocalError('Chỉ hỗ trợ file Excel (.xlsx, .xls)');
            e.target.value = '';
            return;
        }

        try {
            setLocalError('');
            setFileUploaded(true);

            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (rawData.length < 2) {
                setLocalError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)');
                e.target.value = '';
                setFileUploaded(false);
                return;
            }

            const headers = rawData[0];
            const dataRows = rawData.slice(1);

            const jsonData = dataRows.map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                });
                return obj;
            });

            const processedData = processExcelDataSemester(jsonData, existingSemesters, programs);

            if (processedData.length === 0) {
                setLocalError('Không có dữ liệu hợp lệ nào trong file Excel');
                e.target.value = '';
                setFileUploaded(false);
                return;
            }

            setPreviewData(processedData);
            setShowPreview(true);
            onClose();

        } catch (error) {
            console.error('Error reading Excel file:', error);
            setLocalError('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại');
            setFileUploaded(false);
        } finally {
            e.target.value = '';
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setPreviewData([]);
        setFileUploaded(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => {
                    resetForm();
                    onClose();
                }}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
                    color: 'white',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Box display="flex" alignItems="center">
                        <CalendarToday sx={{ fontSize: 28, mr: 2 }} /> {/* Icon for semester */}
                        <Typography variant="h6" fontWeight="600">
                            Thêm Học Kỳ Mới
                        </Typography>
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        aria-label="close"
                        disabled={loading}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    <Divider />

                    <Box sx={{ px: 3, pt: 2 }}>
                        {(error || localError) && (
                            <Fade in={!!(error || localError)}>
                                <Alert
                                    severity="error"
                                    icon={<ErrorIcon />}
                                    sx={{ mb: 2 }}
                                >
                                    {error || localError}
                                </Alert>
                            </Fade>
                        )}
                        {message && (
                            <Fade in={!!message}>
                                <Alert
                                    severity="success"
                                    icon={<CheckCircle />}
                                    sx={{ mb: 2 }}
                                >
                                    {message}
                                </Alert>
                            </Fade>
                        )}
                    </Box>

                    <Box sx={{ p: 3 }}>
                        {activeStep === 0 && (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3
                            }}>
                                <TextField
                                    label="Mã học kỳ"
                                    name="semester_id"
                                    value={newSemester.semester_id}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Class color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Tên học kỳ"
                                    name="semester_name"
                                    value={newSemester.semester_name}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccessTime color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Mã chương trình</InputLabel>
                                    <Select
                                        name="program_id"
                                        value={newSemester.program_id}
                                        onChange={handleChange}
                                        label="Mã chương trình"
                                        disabled={loading}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <School color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        {programs?.map((program) => (
                                            <MenuItem key={program.program_id} value={program.program_id}>
                                                {program.program_id} - {program.program_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3
                            }}>
                                <TextField
                                    label="Ngày bắt đầu"
                                    name="start_date"
                                    type="date"
                                    value={newSemester.start_date}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarToday color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Ngày kết thúc"
                                    name="end_date"
                                    type="date"
                                    value={newSemester.end_date}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarToday color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={newSemester.status}
                                        onChange={handleChange}
                                        label="Trạng thái"
                                        disabled={loading}
                                    >
                                        {statusOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box display="flex" alignItems="center">
                                                    {option.icon}
                                                    <Chip
                                                        label={option.value}
                                                        size="small"
                                                        color={option.color}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    p: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #eee'
                }}>
                    <Box>
                        {activeStep === 0 && (
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<CloudUpload />}
                                component="label"
                                disabled={loading}
                            >
                                Nhập từ Excel
                                <input
                                    type="file"
                                    hidden
                                    accept=".xlsx, .xls"
                                    onChange={handleImportExcel}
                                    disabled={loading}
                                />
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {activeStep > 0 && (
                            <Button
                                onClick={handleBack}
                                variant="outlined"
                                disabled={loading}
                            >
                                Quay lại
                            </Button>
                        )}

                        {activeStep < steps.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                Tiếp theo
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                            >
                                {loading ? 'Đang xử lý...' : 'Thêm học kỳ'}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            <PreviewSemesterModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchSemesters={fetchSemesters}
                programs={programs} // Ensure programs are passed if needed in PreviewSemesterModal
            />
        </>
    );
}
