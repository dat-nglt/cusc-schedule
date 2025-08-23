import React, { useEffect, useState } from 'react';
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
    Fade,
    FormGroup,
    Grid,
    FormControlLabel,
    Checkbox
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
    Error as ErrorIcon,
    Add as AddIcon,
    Book,
    Cancel,
    EventRepeat,
    EventBusy
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewLecturerModal from './PreviewLecturerModal';
import { processExcelDataLecturer } from '../../utils/ExcelValidation';
import { format } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { generateLecturerId } from '../../utils/generateLecturerId';
import { getDayName } from '../../utils/scheduleUtils.JS';
import { getSlotLabel } from '../../utils/scheduleUtils.JS';

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

const steps = ['Thông tin cá nhân', 'Thông tin liên hệ', 'Thông tin công tác', 'Lịch bận'];

const AddLecturerModal = ({ open, onClose, onAddLecturer, existingLecturers, error, loading, message, fetchLecturers, subjects }) => {

    const [newLecturer, setNewLecturer] = useState({
        lecturer_id: '',
        name: '',
        email: '',
        day_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        department: '',
        degree: '',
        subjects: [],
        status: 'Active',
    });
    const [busySlots, setBusySlots] = useState([]);
    const [semesterBusySlots, setSemesterBusySlots] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);

    // Hàm nhóm các slot theo ngày
    const groupSemesterSlotsByDate = () => {
        const grouped = {};
        semesterBusySlots.forEach(slot => {
            if (!grouped[slot.date]) {
                grouped[slot.date] = { date: slot.date, slots: [] };
            }
            grouped[slot.date].slots.push(slot.slot_id);
        });
        return Object.values(grouped);
    };
    // Tạo mã giảng viên khi modal mở
    useEffect(() => {
        if (open) {
            const newId = generateLecturerId();
            setNewLecturer((prev) => ({ ...prev, lecturer_id: newId }));
        }
    }, [open]);

    // Hàm xóa tất cả slot của một ngày
    const handleRemoveDateSlots = (date) => {
        setSemesterBusySlots(semesterBusySlots.filter(slot => slot.date !== date));
    };
    // Hàm xóa một slot cụ thể trong danh sách bận học kỳ
    const handleRemoveBusySlot = (index) => {
        setBusySlots(prevSlots => prevSlots.filter((_, i) => i !== index));
    };
    // Hàm thêm hoặc xóa một slot trong danh sách bận thường
    const handleToggleBusySlot = (day, slotId) => {
        const existingIndex = busySlots.findIndex(s => s.day === day && s.slot_id === slotId);

        if (existingIndex >= 0) {
            // Nếu đã tồn tại thì xóa
            handleRemoveBusySlot(existingIndex);
        } else {
            // Nếu chưa tồn tại thì thêm
            setBusySlots([...busySlots, { day, slot_id: slotId }]);
        }

        console.log(busySlots);

    };

    // Hàm xử lý chọn slot trong lịch bận học kỳ
    const handleToggleSelectedSlot = (slotId) => {
        setSelectedSlots(prev =>
            prev.includes(slotId)
                ? prev.filter(id => id !== slotId)
                : [...prev, slotId]
        );
    };

    // Hàm thêm ngày với các slot đã chọn vào danh sách bận học kỳ
    const handleAddDateWithSlots = () => {
        if (!selectedDate || selectedSlots.length === 0) return;

        const newSlots = selectedSlots.map(slotId => ({
            date: format(selectedDate, 'yyyy-MM-dd'),
            slot_id: slotId
        }));

        setSemesterBusySlots([...semesterBusySlots, ...newSlots]);
        setSelectedSlots([]);
        setSelectedDate(null);
    };

    // Hàm chuyển bước
    const handleNext = () => {
        // Validate current step before proceeding
        // if (activeStep === 0) {
        //     if (!newLecturer.lecturer_id || !newLecturer.name || !newLecturer.day_of_birth || !newLecturer.gender) {
        //         setLocalError('Vui lòng điền đầy đủ thông tin cá nhân');
        //         return;
        //     }
        // } else if (activeStep === 1) {
        //     if (!newLecturer.email || !newLecturer.phone_number || !newLecturer.address) {
        //         setLocalError('Vui lòng điền đầy đủ thông tin liên hệ');
        //         return;
        //     }

        //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //     if (!emailRegex.test(newLecturer.email)) {
        //         setLocalError('Email không hợp lệ');
        //         return;
        //     }

        //     const phoneRegex = /^[0-9]{10,11}$/;
        //     if (!phoneRegex.test(newLecturer.phone_number)) {
        //         setLocalError('Số điện thoại phải có 10-11 chữ số');
        //         return;
        //     }
        // } else if (activeStep === 2) {
        //     if (!newLecturer.department || !newLecturer.degree) {
        //         setLocalError('Vui lòng điền đầy đủ thông tin công tác');
        //         return;
        //     }
        // }

        setLocalError('');
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    // Hàm quay lại bước trước
    const handleBack = () => {
        setLocalError('');
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Hàm xử lý thay đổi input form chung (step 0, 1, 2)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLecturer((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };
    // Hàm xử lý submit form
    const handleSubmit = async () => {
        const birthDate = new Date(newLecturer.day_of_birth);
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
        // Kiểm tra trùng lặp mã giảng viên, email, số điện thoại
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

        // Chuyển trạng thái sang tiếng Anh trước khi lưu
        const newLecturerData = {
            ...newLecturer,
            status: "active",
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        console.log(newLecturerData);


        await onAddLecturer(newLecturerData, newLecturer.subjects, busySlots, semesterBusySlots);

        if (!error && !loading) {
            resetForm();
            onClose();
        }
    };
    // Hàm reset form về trạng thái ban đầu
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
            degree: '',
            subjects: [],
            status: 'active',
        });
        setBusySlots([]);
        setSemesterBusySlots([]);
        setActiveStep(0);
        setLocalError('');
        setFileUploaded(false);
    };
    // Hàm xử lý import file Excel
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
            onClose();

        } catch (error) {
            console.error('Error reading Excel file:', error);
            setLocalError('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại');
            setFileUploaded(false);
        } finally {
            e.target.value = '';
        }
    };

    // Hàm đóng modal xem trước
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
                                    fullWidth
                                    variant="outlined"
                                    placeholder='Mã giảng viên do hệ thống tự tạo'
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
                                <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                                        Chuyên môn giảng dạy
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            borderColor: 'divider',
                                            bgcolor: 'background.default'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Chọn môn học từ danh sách dưới đây
                                            </Typography>
                                            {subjects && (
                                                <Chip
                                                    label={`${newLecturer.subjects.length} môn đã chọn`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>

                                        {subjects && subjects.length > 0 ? (
                                            <>
                                                <Box sx={{ maxHeight: 280, overflow: 'auto', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                    <Grid container spacing={1}>
                                                        {subjects.map((subject) => (
                                                            <Grid item xs={12} sm={6} key={subject.subject_id}>
                                                                <Paper
                                                                    elevation={0}
                                                                    sx={{
                                                                        px: 1,
                                                                        borderRadius: 1,
                                                                        border: '1px solid',
                                                                        borderColor: newLecturer.subjects.includes(subject.subject_id) ?
                                                                            'secondary.main' : 'divider',
                                                                        bgcolor: 'background.paper',
                                                                        transition: 'all 0.2s',
                                                                        '&:hover': {
                                                                            borderColor: 'primary.main',
                                                                            bgcolor: 'action.hover'
                                                                        }
                                                                    }}
                                                                >
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={newLecturer.subjects.includes(subject.subject_id)}
                                                                                onChange={(e) => {
                                                                                    const subjectId = subject.subject_id;
                                                                                    let newSubjects;

                                                                                    if (e.target.checked) {
                                                                                        newSubjects = [...newLecturer.subjects, subjectId];
                                                                                    } else {
                                                                                        newSubjects = newLecturer.subjects.filter(id => id !== subjectId);
                                                                                    }

                                                                                    setNewLecturer(prev => ({
                                                                                        ...prev,
                                                                                        subjects: newSubjects
                                                                                    }));
                                                                                    setLocalError('');
                                                                                }}
                                                                                name="subjects"
                                                                                color="primary"
                                                                                sx={{
                                                                                    '& .MuiSvgIcon-root': { fontSize: 20 }
                                                                                }}
                                                                            />
                                                                        }
                                                                        label={
                                                                            <Box>
                                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                                    {subject.subject_name}
                                                                                </Typography>
                                                                            </Box>
                                                                        }
                                                                        sx={{
                                                                            width: '100%',
                                                                            m: 0,
                                                                            alignItems: 'center',
                                                                        }}
                                                                    />
                                                                </Paper>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>

                                                {newLecturer.subjects.length > 0 && (
                                                    <Box sx={{ mt: 3 }}>
                                                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                            Môn học đã chọn:
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {newLecturer.subjects.map((subjectId) => {
                                                                const subject = subjects.find(s => s.subject_id === subjectId);
                                                                return (
                                                                    <Chip
                                                                        key={subjectId}
                                                                        label={subject ? `${subject.subject_id} - ${subject.subject_name}` : subjectId}
                                                                        size="small"
                                                                        color="primary"
                                                                        onDelete={() => {
                                                                            const newSubjects = newLecturer.subjects.filter(id => id !== subjectId);
                                                                            setNewLecturer(prev => ({
                                                                                ...prev,
                                                                                subjects: newSubjects
                                                                            }));
                                                                        }}
                                                                        deleteIcon={<Cancel />}
                                                                        sx={{
                                                                            borderRadius: 1,
                                                                            '& .MuiChip-label': {
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                maxWidth: 200
                                                                            }
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </>
                                        ) : (
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                py: 4,
                                                color: 'text.secondary'
                                            }}>
                                                <Book sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                                                <Typography variant="body2">Không có môn học nào</Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                </Box>
                            </Box>
                        )}
                        {activeStep === 3 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Lịch bận thường xuyên - Weekly Schedule */}
                                <Paper sx={{
                                    p: 1.5, borderRadius: 1, boxShadow: 2, background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            <EventRepeat sx={{ color: 'white', fontSize: 20 }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                                                Lịch bận cố định hàng tuần
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Chọn các khung giờ bận cố định theo từng thứ
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Weekly Schedule Grid */}
                                    <Box sx={{ mb: 3, flex: 2 }}>
                                        <Box sx={{
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            maxWidth: '100%',
                                            overflowX: 'auto'
                                        }}>
                                            {/* Header - Days of Week */}
                                            <Box sx={{ display: 'flex', bgcolor: 'primary.main', color: 'white' }}>
                                                <Box sx={{
                                                    width: 120,
                                                    p: 1,
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    Khung giờ
                                                </Box>
                                                {[
                                                    { value: 'Mon', label: 'T2' },
                                                    { value: 'Tue', label: 'T3' },
                                                    { value: 'Wed', label: 'T4' },
                                                    { value: 'Thu', label: 'T5' },
                                                    { value: 'Fri', label: 'T6' },
                                                    { value: 'Sat', label: 'T7' }
                                                ].map(day => (
                                                    <Box key={day.value} sx={{
                                                        flex: 1,
                                                        minWidth: 60,
                                                        p: 1,
                                                        textAlign: 'center',
                                                        fontWeight: 'medium',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        {day.label}
                                                    </Box>
                                                ))}
                                            </Box>

                                            {/* Rows - Time Slots */}
                                            {[
                                                { id: 'S1', label: 'S1 (7:00-9:00)' },
                                                { id: 'S2', label: 'S2 (9:00-11:00)' },
                                                { id: 'C1', label: 'C1 (13:00-15:00)' },
                                                { id: 'C2', label: 'C2 (15:00-17:00)' },
                                                { id: 'T1', label: 'T1 (17:30-19:30)' },
                                                { id: 'T2', label: 'T2 (19:30-21:30)' }
                                            ].map(slot => (
                                                <Box key={slot.id} sx={{
                                                    display: 'flex',
                                                    borderBottom: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:last-child': { borderBottom: 'none' }
                                                }}>
                                                    <Box sx={{
                                                        width: 120,
                                                        p: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontWeight: 'medium',
                                                        bgcolor: 'grey.50',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        {slot.label}
                                                    </Box>
                                                    {[
                                                        { value: 'Mon', label: 'T2' },
                                                        { value: 'Tue', label: 'T3' },
                                                        { value: 'Wed', label: 'T4' },
                                                        { value: 'Thu', label: 'T5' },
                                                        { value: 'Fri', label: 'T6' },
                                                        { value: 'Sat', label: 'T7' }
                                                    ].map(day => {
                                                        const isSelected = busySlots.some(s => s.day === day.value && s.slot_id === slot.id);
                                                        return (
                                                            <Box
                                                                key={`${day.value}-${slot.id}`}
                                                                sx={{
                                                                    flex: 1,
                                                                    minWidth: 60,
                                                                    p: 0.5,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    cursor: 'pointer',
                                                                    bgcolor: isSelected ? 'secondary.light' : 'transparent',
                                                                    borderLeft: '1px solid',
                                                                    borderColor: 'divider',
                                                                    transition: 'all 0.2s',
                                                                    '&:hover': {
                                                                        bgcolor: isSelected ? 'primary.main' : 'action.hover',
                                                                        '& .MuiCheckbox-root': {
                                                                            color: isSelected ? 'white' : 'primary.main'
                                                                        }
                                                                    }
                                                                }}
                                                                onClick={() => handleToggleBusySlot(day.value, slot.id)}
                                                            >
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    size="small"
                                                                    sx={{
                                                                        p: 0,
                                                                        color: isSelected ? 'primary.main' : 'action.active',
                                                                        '&.Mui-checked': {
                                                                            color: 'primary.main'
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Selected Weekly Slots */}
                                    {busySlots.length > 0 && (
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main', mb: 1 }}>
                                                Lịch bận đã chọn:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {busySlots.map((slot, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={`${getDayName(slot.day)} - ${getSlotLabel(slot.slot_id)}`}
                                                        color="primary"
                                                        onDelete={() => handleRemoveBusySlot(index)}
                                                        deleteIcon={<Cancel />}
                                                        sx={{ borderRadius: 1 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Paper>

                                {/* Lịch bận học kỳ - Specific Dates */}
                                <Paper sx={{ p: 1.5, borderRadius: 2, boxShadow: 2, background: 'linear-gradient(to bottom, #f8f2ff, #ffffff)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: 'secondary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            <EventBusy sx={{ color: 'white', fontSize: 20 }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.dark' }}>
                                                Lịch bận theo ngày cụ thể
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Chọn các ngày và khung giờ bận cụ thể trong học kỳ
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                                        {/* Calendar Picker */}
                                        <Box sx={{ flex: 1, minWidth: 300 }}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Chọn ngày bận"
                                                    value={selectedDate}
                                                    onChange={setSelectedDate}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <CalendarMonthIcon color="secondary" />
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Box>

                                        {/* Time Slot Selection */}
                                        <Box sx={{ flex: 1, minWidth: 300 }}>
                                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                                                Chọn khung giờ bận
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {[
                                                    { id: 'S1', label: 'S1' },
                                                    { id: 'S2', label: 'S2' },
                                                    { id: 'C1', label: 'C1' },
                                                    { id: 'C2', label: 'C2' },
                                                    { id: 'T1', label: 'T1' },
                                                    { id: 'T2', label: 'T2' }
                                                ].map(slot => (
                                                    <Chip
                                                        key={slot.id}
                                                        label={slot.label}
                                                        clickable
                                                        color={selectedSlots.includes(slot.id) ? 'secondary' : 'default'}
                                                        variant={selectedSlots.includes(slot.id) ? 'filled' : 'outlined'}
                                                        onClick={() => handleToggleSelectedSlot(slot.id)}
                                                        sx={{
                                                            borderRadius: 1,
                                                            maxHeight: 25,
                                                            fontWeight: 'medium'
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        {/* Add Button */}
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleAddDateWithSlots}
                                            disabled={!selectedDate || selectedSlots.length === 0}
                                            startIcon={<AddIcon />}
                                            sx={{ alignSelf: 'flex-end', height: 40 }}
                                        >
                                            Thêm lịch
                                        </Button>
                                    </Box>

                                    {/* Selected Specific Dates */}
                                    {semesterBusySlots.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium', color: 'secondary.main', mb: 1 }}>
                                                Ngày bận đã chọn
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                                                {groupSemesterSlotsByDate().map((group, index) => (
                                                    <Paper
                                                        key={index}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            borderLeft: '4px solid',
                                                            borderLeftColor: 'secondary.main',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                            <Typography variant="subtitle2" fontWeight="bold">
                                                                {format(new Date(group.date), 'dd/MM/yyyy')}
                                                            </Typography>
                                                            <IconButton
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 4,
                                                                    right: 4
                                                                }}
                                                                size="small"
                                                                onClick={() => handleRemoveDateSlots(group.date)}
                                                                color="error"
                                                            >
                                                                <Close />
                                                            </IconButton>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {group.slots.map(slotId => (
                                                                <Chip
                                                                    sx={{
                                                                        borderRadius: 1,
                                                                    }}
                                                                    key={slotId}
                                                                    label={getSlotLabel(slotId)}
                                                                    size="small"
                                                                    color="secondary"
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        )}
                    </Box>
                </DialogContent >

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
            </Dialog >

            <PreviewLecturerModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchLecturers={fetchLecturers}
                subjects={subjects}
            />
        </>
    );
}

export default AddLecturerModal;