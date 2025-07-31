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
    Paper,
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
    Work,
    EmojiEvents,
    CheckCircle,
    Error as ErrorIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewLecturerModal from './PreviewLecturerModal';
import { processExcelDataLecturer } from '../../utils/ExcelValidation';

const availableDepartments = [
    'Khoa Công Nghệ Thông Tin',
    'Khoa Kỹ Thuật',
    'Khoa Quản Trị Kinh Doanh',
    'Khoa Công Nghệ Thực Phẩm',
    'Khoa Xây Dựng',
    'Khoa Cơ Khí',
    'Khoa Điện - Điện Tử'
];

const availableDegrees = [
    'Cử nhân',
    'Thạc sỹ',
    'Tiến sỹ',
    'Giáo sư',
    'Phó Giáo sư'
];

const statusOptions = [
    { value: 'Đang giảng dạy', color: 'success' },
    { value: 'Tạm nghỉ', color: 'warning' },
    { value: 'Đã nghỉ việc', color: 'error' },
    { value: 'Nghỉ hưu', color: 'info' }
];

const steps = ['Thông tin cá nhân', 'Thông tin liên hệ', 'Thông tin công tác'];

const AddLecturerModal = ({ open, onClose, onAddLecturer, existingLecturers, error, loading, message, fetchLecturers }) => {
    const [newLecturer, setNewLecturer] = useState({
        lecturer_id: '',
        name: '',
        email: '',
        day_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        department: '',
        hire_date: '',
        degree: '',
        status: 'Đang giảng dạy',
    });

    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleNext = () => {
        // Validate current step before proceeding
        if (activeStep === 0) {
            if (!newLecturer.lecturer_id || !newLecturer.name || !newLecturer.day_of_birth || !newLecturer.gender) {
                setLocalError('Vui lòng điền đầy đủ thông tin cá nhân');
                return;
            }
        } else if (activeStep === 1) {
            if (!newLecturer.email || !newLecturer.phone_number || !newLecturer.address) {
                setLocalError('Vui lòng điền đầy đủ thông tin liên hệ');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newLecturer.email)) {
                setLocalError('Email không hợp lệ');
                return;
            }

            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(newLecturer.phone_number)) {
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
        setNewLecturer((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        // Final validation
        if (!newLecturer.department || !newLecturer.hire_date || !newLecturer.degree) {
            setLocalError('Vui lòng điền đầy đủ thông tin công tác');
            return;
        }

        const birthDate = new Date(newLecturer.day_of_birth);
        const hireDate = new Date(newLecturer.hire_date);
        const today = new Date();

        if (birthDate >= today) {
            setLocalError('Ngày sinh không hợp lệ');
            return;
        }

        const minBirthDate = new Date();
        minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);
        if (birthDate > minBirthDate) {
            setLocalError('Giảng viên phải đủ 18 tuổi');
            return;
        }

        if (hireDate > today) {
            setLocalError('Ngày tuyển dụng không hợp lệ');
            return;
        }

        if (hireDate < birthDate) {
            setLocalError('Ngày tuyển dụng không thể trước ngày sinh');
            return;
        }

        const isDuplicateId = existingLecturers.some(
            (lecturer) => lecturer.lecturer_id === newLecturer.lecturer_id
        );
        if (isDuplicateId) {
            setLocalError(`Mã giảng viên "${newLecturer.lecturer_id}" đã tồn tại`);
            return;
        }

        const isEmailDuplicate = existingLecturers.some(
            (lecturer) => lecturer.email === newLecturer.email
        );
        if (isEmailDuplicate) {
            setLocalError(`Email "${newLecturer.email}" đã tồn tại`);
            return;
        }

        const isPhoneDuplicate = existingLecturers.some(
            (lecturer) => lecturer.phone_number === newLecturer.phone_number
        );
        if (isPhoneDuplicate) {
            setLocalError(`Số điện thoại "${newLecturer.phone_number}" đã tồn tại`);
            return;
        }

        const lecturerToAdd = {
            ...newLecturer,
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await onAddLecturer(lecturerToAdd);

        if (!error && !loading) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setNewLecturer({
            lecturer_id: '',
            name: '',
            email: '',
            day_of_birth: '',
            gender: '',
            address: '',
            phone_number: '',
            department: '',
            hire_date: '',
            degree: '',
            status: 'Đang giảng dạy',
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

            const processedData = processExcelDataLecturer(jsonData, existingLecturers);

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
                        overflow: 'hidden'
                    }
                }}
            >
                {/* Header với gradient và shadow */}
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
                            Thêm Giảng Viên Mới
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
                                    label="Mã giảng viên"
                                    name="lecturer_id"
                                    value={newLecturer.lecturer_id}
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
                                    value={newLecturer.name}
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
                                    value={newLecturer.day_of_birth}
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
                                        value={newLecturer.gender}
                                        onChange={handleChange}
                                        label="Giới tính"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Transgender color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                        <MenuItem value="Khác">Khác</MenuItem>
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
                                    value={newLecturer.email}
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
                                    value={newLecturer.phone_number}
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
                                    value={newLecturer.address}
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
                                    <InputLabel>Khoa</InputLabel>
                                    <Select
                                        name="department"
                                        value={newLecturer.department}
                                        onChange={handleChange}
                                        label="Khoa"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <School color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        {availableDepartments.map((dept) => (
                                            <MenuItem key={dept} value={dept}>
                                                {dept}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Ngày tuyển dụng"
                                    name="hire_date"
                                    type="date"
                                    value={newLecturer.hire_date}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Work color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Bằng cấp</InputLabel>
                                    <Select
                                        name="degree"
                                        value={newLecturer.degree}
                                        onChange={handleChange}
                                        label="Bằng cấp"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <EmojiEvents color="action" />
                                            </InputAdornment>
                                        }
                                    >
                                        {availableDegrees.map((degree) => (
                                            <MenuItem key={degree} value={degree}>
                                                {degree}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth required>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        name="status"
                                        value={newLecturer.status}
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
                                {loading ? 'Đang xử lý...' : 'Thêm giảng viên'}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            <PreviewLecturerModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchLecturers={fetchLecturers}
                onAddLecturer={onAddLecturer}
            />
        </>
    );
}

export default AddLecturerModal;