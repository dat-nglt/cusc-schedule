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
import { useEffect } from 'react';
import { generateStudentId } from '../../utils/generateLecturerId';
import { validateStudentField } from '../../utils/addValidation';

const steps = ['Thông tin cá nhân', 'Thông tin liên hệ', 'Thông tin học tập'];

export default function AddStudentModal({ open, onClose, onAddStudent, existingStudents, error, loading, message, fetchStudents, existingAccounts, classes }) {
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
        let hasError = false;
        let errors = {};

        if (activeStep === 0) {
            const step1Fields = ["student_id", "name", "day_of_birth", "gender"];
            const allErrors = validateStudentField(newStudent, existingStudents, existingAccounts);

            step1Fields.forEach((field) => {
                if (allErrors[field]) {
                    errors[field] = allErrors[field];
                    hasError = true;
                }
            });
        } else if (activeStep === 1) {
            const step2Fields = ["email", "phone_number", "address"];
            const allErrors = validateStudentField(newStudent, existingStudents, existingAccounts);

            step2Fields.forEach((field) => {
                if (allErrors[field]) {
                    errors[field] = allErrors[field];
                    hasError = true;
                }
            });
        }

        // Cập nhật trạng thái lỗi
        setLocalError(errors);

        // Nếu không có lỗi, chuyển sang bước tiếp theo
        if (!hasError) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setLocalError('');

    };



    const handleBack = () => {
        setLocalError('');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    useEffect(() => {
        if (open) {
            const studentID = generateStudentId();
            setNewStudent((prev) => ({ ...prev, student_id: studentID }));
        }
    }, [open]);

    const handleSubmit = async () => {
        // 1. Chạy xác thực toàn bộ form
        const formErrors = validateStudentField(newStudent, existingStudents);

        // 2. Cập nhật trạng thái lỗi
        setLocalError(formErrors);

        // 3. Nếu có lỗi, dừng lại và không submit
        if (Object.keys(formErrors).length > 0) {
            console.log("Form có lỗi, không thể submit.");
            return;
        }

        // 4. Nếu không có lỗi, tiến hành submit
        try {
            const studentToAdd = {
                ...newStudent,
                status: "active",
                google_id: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            console.log(studentToAdd);
            await onAddStudent(studentToAdd);

            if (!error && !loading) {
                resetForm();
                onClose();
            }
        } catch (err) {
            console.error("Lỗi khi thêm học viên:", err);
            setLocalError({ submit: "Không thể thêm học viên, vui lòng thử lại." });
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
                        {/* Hiển thị lỗi từ server (nếu có) */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Hiển thị các lỗi local từ đối tượng localError */}
                        {Object.keys(localError).length > 0 && (
                            <Fade in={Object.keys(localError).length > 0}>
                                <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                                    {/* Dùng Object.values() để lấy mảng các chuỗi lỗi và hiển thị chúng */}
                                    <ul>
                                        {Object.values(localError).map((err, index) => (
                                            // Đảm bảo mỗi lỗi là một chuỗi
                                            typeof err === 'string' && <li key={index}>{err}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            </Fade>
                        )}

                        {/* Hiển thị thông báo thành công */}
                        {message && (
                            <Fade in={!!message}>
                                <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
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
                                        readOnly: true,
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
                                    rows={1}
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