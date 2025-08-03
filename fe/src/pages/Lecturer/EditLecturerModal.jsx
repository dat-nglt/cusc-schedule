import React, { useState, useEffect } from 'react';
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
    School,
    Person,
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

export default function EditLecturerModal({ open, onClose, lecturer, onSave, error, loading, subjects }) {
    const [editedLecturer, setEditedLecturer] = useState({
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
        subjects: [],
        status: 'Đang giảng dạy',
    });

    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (lecturer) {
            setEditedLecturer({
                lecturer_id: lecturer.lecturer_id || '',
                name: lecturer.name || '',
                email: lecturer.email || '',
                day_of_birth: lecturer.day_of_birth || '',
                gender: lecturer.gender || '',
                address: lecturer.address || '',
                phone_number: lecturer.phone_number || '',
                department: lecturer.department || '',
                hire_date: lecturer.hire_date || '',
                degree: lecturer.degree || '',
                subjects: lecturer.subjects || [],
                status: lecturer.status || 'Đang giảng dạy',
            });
            setActiveStep(0);
            setLocalError('');
        }
    }, [lecturer]);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!editedLecturer.lecturer_id || !editedLecturer.name || !editedLecturer.day_of_birth || !editedLecturer.gender) {
                setLocalError('Vui lòng điền đầy đủ thông tin cá nhân');
                return;
            }
        } else if (activeStep === 1) {
            if (!editedLecturer.email || !editedLecturer.phone_number || !editedLecturer.address) {
                setLocalError('Vui lòng điền đầy đủ thông tin liên hệ');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(editedLecturer.email)) {
                setLocalError('Email không hợp lệ');
                return;
            }

            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(editedLecturer.phone_number)) {
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
        setEditedLecturer((prev) => ({ ...prev, [name]: value }));
        setLocalError('');

    };

    const handleSubmit = async () => {
        if (!editedLecturer.department || !editedLecturer.hire_date || !editedLecturer.degree) {
            setLocalError('Vui lòng điền đầy đủ thông tin công tác');
            return;
        }

        const birthDate = new Date(editedLecturer.day_of_birth);
        const hireDate = new Date(editedLecturer.hire_date);
        const today = new Date();

        if (birthDate >= today) {
            setLocalError('Ngày sinh không hợp lệ');
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

        const updatedLecturerData = {
            ...editedLecturer,
            updated_at: new Date().toISOString(),
        };

        await onSave(updatedLecturerData);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                        Chỉnh sửa thông tin giảng viên
                    </Typography>
                </Box>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
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
                                value={editedLecturer.lecturer_id}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Họ và tên"
                                name="name"
                                value={editedLecturer.name}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Ngày sinh"
                                name="day_of_birth"
                                type="date"
                                value={editedLecturer.day_of_birth}
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
                                    value={editedLecturer.gender}
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
                                value={editedLecturer.email}
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
                                value={editedLecturer.phone_number}
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
                                value={editedLecturer.address}
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
                                    value={editedLecturer.department}
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
                                value={editedLecturer.hire_date}
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
                                    value={editedLecturer.degree}
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
                            <FormControl fullWidth>
                                <InputLabel>Môn học giảng dạy</InputLabel>
                                <Select
                                    name="subjects"
                                    multiple
                                    value={editedLecturer.subjects}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setEditedLecturer(prev => ({
                                            ...prev,
                                            subjects: typeof value === 'string' ? value.split(',') : value
                                        }));
                                        setLocalError('');
                                    }}
                                    label="Môn học giảng dạy"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const subject = subjects?.find(s => s.subject_id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={subject ? `${subject.subject_id} - ${subject.subject_name}` : value}
                                                        size="small"
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {subjects && subjects.map((subject) => (
                                        <MenuItem key={subject.subject_id} value={subject.subject_id}>
                                            {subject.subject_id} - {subject.subject_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth required>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    name="status"
                                    value={editedLecturer.status}
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
                justifyContent: 'flex-end',
                gap: 2,
                borderTop: '1px solid #eee'
            }}>
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
                        {loading ? 'Đang lưu...' : 'Cập nhật'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}