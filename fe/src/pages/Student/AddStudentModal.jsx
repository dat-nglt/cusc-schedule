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
    Avatar,
    Divider,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Chip,
    InputAdornment,
    Fade
} from '@mui/material';
import {
    Close,
    CloudUpload,
    PersonAdd,
    School,
    ContactMail,
    Cake,
    Transgender,
    Phone,
    Home,
    Class,
    Event,
    CheckCircle,
    Error as ErrorIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewStudentModal from './PreviewStudentModal';
import { processExcelDataStudent } from '../../utils/ExcelValidation';

const statusOptions = [
    { value: 'Hoạt động', color: 'success', db: 'active' },
    { value: 'Tạm nghỉ', color: 'warning', db: 'break' },
    { value: 'Đã nghỉ học', color: 'error', db: 'dropped' },
    { value: 'Đã tốt nghiệp', color: 'info', db: 'graduated' },
    { value: 'Bảo lưu', color: 'warning', db: 'reserve' }
];

const steps = ['Thông tin cá nhân', 'Thông tin liên hệ', 'Thông tin học tập'];

export default function AddStudentModal({ open, onClose, onAddStudent, existingStudents, error, loading, message, fetchStudents, classes }) {
    const [newStudent, setNewStudent] = useState({
        student_id: '',
        name: '',
        email: '',
        day_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        class: '',
        admission_year: '',
        status: 'Hoạt động',
    });

    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleNext = () => {
        // Validate current step before proceeding
        if (activeStep === 0) {
            if (!newStudent.student_id || !newStudent.name || !newStudent.day_of_birth || !newStudent.gender) {
                setLocalError('Vui lòng điền đầy đủ thông tin cá nhân');
                return;
            }
        } else if (activeStep === 1) {
            if (!newStudent.email || !newStudent.phone_number || !newStudent.address) {
                setLocalError('Vui lòng điền đầy đủ thông tin liên hệ');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newStudent.email)) {
                setLocalError('Email không hợp lệ');
                return;
            }

            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(newStudent.phone_number)) {
                setLocalError('Số điện thoại phải có 10-11 chữ số');
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
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        // Final validation
        if (!newStudent.class || !newStudent.admission_year) {
            setLocalError('Vui lòng điền đầy đủ thông tin học tập');
            return;
        }

        const birthDate = new Date(newStudent.day_of_birth);
        const admissionDate = new Date(newStudent.admission_year);
        const today = new Date();

        if (birthDate >= today) {
            setLocalError('Ngày sinh không hợp lệ');
            return;
        }

        const minBirthDate = new Date();
        minBirthDate.setFullYear(minBirthDate.getFullYear() - 6);
        if (birthDate > minBirthDate) {
            setLocalError('Học viên phải đủ 6 tuổi');
            return;
        }

        if (admissionDate > today) {
            setLocalError('Ngày nhập học không hợp lệ');
            return;
        }

        if (admissionDate < birthDate) {
            setLocalError('Ngày nhập học không thể trước ngày sinh');
            return;
        }

        const isDuplicateId = existingStudents.some(
            (student) => student.student_id === newStudent.student_id
        );
        if (isDuplicateId) {
            setLocalError(`Mã học viên "${newStudent.student_id}" đã tồn tại`);
            return;
        }

        const isEmailDuplicate = existingStudents.some(
            (student) => student.email === newStudent.email
        );
        if (isEmailDuplicate) {
            setLocalError(`Email "${newStudent.email}" đã tồn tại`);
            return;
        }

        const isPhoneDuplicate = existingStudents.some(
            (student) => student.phone_number === newStudent.phone_number
        );
        if (isPhoneDuplicate) {
            setLocalError(`Số điện thoại "${newStudent.phone_number}" đã tồn tại`);
            return;
        }

        // Chuyển trạng thái sang tiếng Anh trước khi lưu
        const statusObj = statusOptions.find(opt => opt.value === newStudent.status);
        const dbStatus = statusObj ? statusObj.db : 'studying';

        const studentToAdd = {
            ...newStudent,
            status: dbStatus,
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await onAddStudent(studentToAdd);

        if (!error && !loading) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setNewStudent({
            student_id: '',
            name: '',
            email: '',
            day_of_birth: '',
            gender: '',
            address: '',
            phone_number: '',
            class: '',
            admission_year: '',
            status: 'Đang học',
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

            const processedData = processExcelDataStudent(jsonData, existingStudents);
            onClose();

            if (processedData.length === 0) {
                setLocalError('Không có dữ liệu hợp lệ nào trong file Excel');
                e.target.value = '';
                setFileUploaded(false);
                return;
            }

            setPreviewData(processedData);
            setShowPreview(true);

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
                {/* Header với gradient */}
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
                            Thêm Học Viên Mới
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
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    {/* Stepper */}
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

                    {/* Error/Success messages */}
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

                    {/* Form content - changes based on activeStep */}
                    <Box sx={{ p: 3 }}>
                        {activeStep === 0 && (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3
                            }}>
                                <TextField
                                    label="Mã học viên"
                                    name="student_id"
                                    value={newStudent.student_id}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonAdd color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Họ và tên"
                                    name="name"
                                    value={newStudent.name}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonAdd color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Ngày sinh"
                                    name="day_of_birth"
                                    type="date"
                                    value={newStudent.day_of_birth}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Cake color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Giới tính</InputLabel>
                                    <Select
                                        name="gender"
                                        value={newStudent.gender}
                                        onChange={handleChange}
                                        label="Giới tính"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Transgender color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="male">Nam</MenuItem>
                                        <MenuItem value="female">Nữ</MenuItem>
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
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={newStudent.email}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ContactMail color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Số điện thoại"
                                    name="phone_number"
                                    value={newStudent.phone_number}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Địa chỉ"
                                    name="address"
                                    value={newStudent.address}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    multiline
                                    rows={3}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Home color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
                                />
                            </Box>
                        )}

                        {activeStep === 2 && (
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3
                            }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Lớp</InputLabel>
                                    <Select
                                        name="class"
                                        value={newStudent.class}
                                        onChange={handleChange}
                                        label="Lớp"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Class color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        {classes?.map((classItem) => (
                                            <MenuItem key={classItem.class_id} value={classItem.class_id}>
                                                {classItem.class_id} - {classItem.class_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Ngày nhập học"
                                    name="admission_year"
                                    type="date"
                                    value={newStudent.admission_year}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Event color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={newStudent.status}
                                        onChange={handleChange}
                                        label="Trạng thái"
                                    >
                                        {statusOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Chip
                                                    label={option.value}
                                                    size="small"
                                                    color={option.color}
                                                    sx={{ mr: 1 }}
                                                />
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
                            >
                                Nhập từ Excel
                                <input
                                    type="file"
                                    hidden
                                    accept=".xlsx, .xls"
                                    onChange={handleImportExcel}
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
                                {loading ? 'Đang xử lý...' : 'Thêm học viên'}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            <PreviewStudentModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchStudents={fetchStudents}
                classes={classes}
            />
        </>
    );
}