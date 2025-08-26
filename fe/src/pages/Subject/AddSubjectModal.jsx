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
    Paper,
    Stack,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import {
    Close,
    CloudUpload,
    BookmarkAdded, // Icon for subject_id
    MenuBook, // Icon for subject_name
    FormatListNumbered, // Icon for credit
    School, // Icon for theory_hours/practice_hours (general academic)
    HourglassEmpty, // Another option for hours, or use School for both
    CheckCircle,
    Error as ErrorIcon,
    AccessTime, // For semester_id
    HelpOutline, // For status
    PauseCircleFilled,
    StopCircle
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewSubjectModal from './PreviewSubjectModal';
import { processExcelDataSubject } from '../../utils/ExcelValidation';
import { validateSubjectField } from '../../utils/addValidation';

// Define status options with colors and icons, similar to semester modal
const subjectStatusOptions = [
    { value: 'Hoạt động', color: 'success', icon: <CheckCircle /> },
    { value: 'Tạm dừng', color: 'warning', icon: <PauseCircleFilled /> }, // Assuming PauseCircleFilled is imported from your AddSemesterModal context
    { value: 'Ngừng hoạt động', color: 'error', icon: <StopCircle /> } // Assuming StopCircle is imported from your AddSemesterModal context
];

const steps = ['Thông tin học phần', 'Chi tiết & Trạng thái'];

export default function AddSubjectModal({ open, onClose, onAddSubject, existingSubjects = [], error, loading, message, semesters, fetchSubjects }) {

    console.log(semesters);


    const [newSubject, setNewSubject] = useState({
        subject_id: '',
        subject_name: '',
        theory_hours: 0,
        practice_hours: 0,
    });

    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false); // To track if a file was selected for import

    const handleNext = () => {
        // let hasError = false;
        // let errors = {};

        // // gọi 1 lần để lấy tất cả lỗi
        // const allErrors = validateSubjectField(newSubject, existingSubjects);

        // // mapping step -> các field cần kiểm tra
        // const stepFields = {
        //     0: ["subject_id", "subject_name"],
        //     1: ["credit", "theory_hours", "practice_hours", "semester_id"],
        // };

        // const fieldsToCheck = stepFields[activeStep] || [];

        // fieldsToCheck.forEach((field) => {
        //     if (allErrors[field]) {
        //         errors[field] = allErrors[field];
        //         hasError = true;
        //     }
        // });

        // setLocalError(errors);

        // if (!hasError) {
        setActiveStep((prev) => prev + 1);
        // }
    };

    const handleToggleChange = (event, value) => {
        if (value !== null) {
            // Cập nhật giá trị nếu người dùng chọn ToggleButton
            handleChange({
                target: {
                    name: event.currentTarget.name,
                    value: value
                }
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSubject((prev) => ({ ...prev, [name]: value }));
        setLocalError({});
    }

    const handleBack = () => {
        setLocalError('');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleSubmit = async () => {
        if (!newSubject.subject_id || !newSubject.subject_name || newSubject.theory_hours <= 0 || newSubject.practice_hours <= 0) {
            setLocalError('Vui lòng điền đầy đủ thông tin chi tiết hợp lệ trước khi thêm.');
            return;
        }

        const subjectToAdd = {
            ...newSubject,
            theory_hours: parseInt(newSubject.theory_hours),
            practice_hours: parseInt(newSubject.practice_hours),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await onAddSubject(subjectToAdd);

        // Only reset and close if there's no error after submission
        if (!error && !loading) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setNewSubject({
            subject_id: '',
            subject_name: '',
            credit: 0,
            theory_hours: 0,
            practice_hours: 0,
            status: 'Hoạt động',
            semester_id: ''
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

            const processedData = processExcelDataSubject(jsonData, existingSubjects, semesters);

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
                        overflow: 'hidden',
                        maxHeight: '80vh',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', // Different gradient for subjects
                    color: 'white',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Box display="flex" alignItems="center">
                        <MenuBook sx={{ fontSize: 28, mr: 2 }} /> {/* Icon for subject */}
                        <Typography variant="h6" fontWeight="600">
                            Thêm Học Phần Mới
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
                        {/* Error dạng string (API, server, v.v.) */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Error dạng object (validate ở client, nhiều field) */}
                        {Object.keys(localError).length > 0 && (
                            <Fade in={Object.keys(localError).length > 0}>
                                <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                                    <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                                        {Object.values(localError).map(
                                            (err, index) =>
                                                typeof err === "string" && <li key={index}>{err}</li>
                                        )}
                                    </ul>
                                </Alert>
                            </Fade>
                        )}

                        {/* Message thành công */}
                        {message && (
                            <Fade in={!!message}>
                                <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
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
                                    label="Mã học phần"
                                    name="subject_id"
                                    value={newSubject.subject_id}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BookmarkAdded color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Tên học phần"
                                    name="subject_name"
                                    value={newSubject.subject_name}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MenuBook color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box>
                                {/* Box cho Số giờ lý thuyết */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <School fontSize="small" color="primary" />
                                        Số giờ lý thuyết
                                    </Typography>
                                    <Stack direction="row" spacing={2} alignItems="center" useFlexGap flexWrap="wrap">
                                        <ToggleButtonGroup
                                            value={newSubject.theory_hours || 0}
                                            exclusive
                                            onChange={(e, value) => handleToggleChange(e, value)}
                                            aria-label="Số giờ lý thuyết"
                                            name="theory_hours"
                                            disabled={loading}
                                        >
                                            {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((hours) => (
                                                <ToggleButton
                                                    key={hours}
                                                    value={hours}
                                                    sx={{ minWidth: 60, fontWeight: 'bold' }}
                                                >
                                                    {hours}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                        <TextField
                                            label="Tùy chỉnh"
                                            name="theory_hours"
                                            type="number"
                                            value={newSubject.theory_hours}
                                            onChange={handleChange}
                                            variant="outlined"
                                            size="small"
                                            required
                                            disabled={loading}
                                            sx={{ width: '120px', flex: 1 }}
                                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                        />
                                    </Stack>
                                </Box>

                                {/* Box cho Số giờ thực hành */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTime fontSize="small" color="secondary" />
                                        Số giờ thực hành
                                    </Typography>
                                    <Stack direction="row" spacing={2} alignItems="center" useFlexGap flexWrap="wrap">
                                        <ToggleButtonGroup
                                            value={newSubject.practice_hours || 0}
                                            exclusive
                                            onChange={(e, value) => handleToggleChange(e, value)}
                                            aria-label="Số giờ thực hành"
                                            name="practice_hours"
                                            disabled={loading}
                                        >
                                            {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((hours) => (
                                                <ToggleButton
                                                    key={hours}
                                                    value={hours}
                                                    sx={{ minWidth: 60, fontWeight: 'bold' }}
                                                >
                                                    {hours}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                        <TextField
                                            label="Tùy chỉnh"
                                            name="practice_hours"
                                            type="number"
                                            value={newSubject.practice_hours}
                                            onChange={handleChange}
                                            variant="outlined"
                                            size="small"
                                            required
                                            disabled={loading}
                                            sx={{ width: '120px', flex: 1 }}
                                            inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                        />
                                    </Stack>
                                </Box>
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
                                {loading ? 'Đang xử lý...' : 'Thêm học phần'}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Preview Modal */}
            <PreviewSubjectModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchSubjects={fetchSubjects}
                semesters={semesters} // Pass semesters to PreviewSubjectModal if it needs to display semester names
            />
        </>
    );
}