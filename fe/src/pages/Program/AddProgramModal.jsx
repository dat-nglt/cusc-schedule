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
    School,
    Class,
    Schedule,
    CheckCircle,
    Error as ErrorIcon,
    PlayCircleFilled,
    PauseCircleFilled,
    StopCircle,
    DoneAll
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewProgramModal from './PreviewProgramModal';
import { processExcelDataProgram } from '../../utils/ExcelValidation';

const statusOptions = [
    { value: 'Đang triển khai', color: 'info', icon: <PlayCircleFilled /> },
    { value: 'Đang áp dụng', color: 'success', icon: <DoneAll /> },
    { value: 'Tạm dừng', color: 'warning', icon: <PauseCircleFilled /> },
    { value: 'Đã kết thúc', color: 'error', icon: <StopCircle /> }
];

const trainingDurations = [1, 2, 3, 4].map(year => ({
    value: year,
    label: `${year} Năm`
}));

const steps = ['Thông tin cơ bản', 'Thông tin bổ sung'];

export default function AddProgramModal({
    open,
    onClose,
    onAddProgram,
    existingPrograms,
    error,
    loading,
    message,
    fetchPrograms
}) {
    const [newProgram, setNewProgram] = useState({
        program_id: '',
        program_name: '',
        training_duration: '',
        status: 'Đang triển khai',
    });

    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!newProgram.program_id || !newProgram.program_name) {
                setLocalError('Vui lòng điền đầy đủ thông tin cơ bản');
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
        setNewProgram((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        if (!newProgram.training_duration) {
            setLocalError('Vui lòng điền đầy đủ thông tin bổ sung');
            return;
        }

        const isDuplicate = existingPrograms.some(
            (program) => program.program_id === newProgram.program_id
        );
        if (isDuplicate) {
            setLocalError(`Mã chương trình "${newProgram.program_id}" đã tồn tại`);
            return;
        }

        const programToAdd = {
            ...newProgram,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await onAddProgram(programToAdd);

        if (!error && !loading) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setNewProgram({
            program_id: '',
            program_name: '',
            training_duration: '',
            status: 'Đang triển khai',
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

            const processedData = processExcelDataProgram(jsonData, existingPrograms);

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
                        <School sx={{ fontSize: 28, mr: 2 }} />
                        <Typography variant="h6" fontWeight="600">
                            Thêm Chương Trình Đào Tạo
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
                                    label="Mã chương trình"
                                    name="program_id"
                                    value={newProgram.program_id}
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
                                    label="Tên chương trình"
                                    name="program_name"
                                    value={newProgram.program_name}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <School color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3
                            }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Thời gian đào tạo</InputLabel>
                                    <Select
                                        name="training_duration"
                                        value={newProgram.training_duration}
                                        onChange={handleChange}
                                        label="Thời gian đào tạo"
                                        disabled={loading}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Schedule color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        {trainingDurations.map((duration) => (
                                            <MenuItem key={duration.value} value={duration.value}>
                                                {duration.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth required>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={newProgram.status}
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
                                {loading ? 'Đang xử lý...' : 'Thêm chương trình'}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            <PreviewProgramModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchPrograms={fetchPrograms}
            />
        </>
    );
}