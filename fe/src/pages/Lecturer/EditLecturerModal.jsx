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
    Fade,
    Paper
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
    Error as ErrorIcon,
    Add as AddIcon
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
    { value: 'Hoạt động', color: 'success', db: 'active' },
    { value: 'Tạm nghỉ', color: 'warning', db: 'break' },
    { value: 'Nghỉ việc', color: 'error', db: 'resigned' },
];

const steps = ['Thông tin cá nhân', 'Thông tin liên hệ', 'Thông tin công tác', 'Lịch bận'];

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
        status: 'Hoạt động',
    });

    const [busySlots, setBusySlots] = useState([]);
    const [semesterBusySlots, setSemesterBusySlots] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (lecturer) {
            // Chuyển trạng thái từ tiếng Anh sang tiếng Việt để hiển thị
            let viStatus = 'Đang giảng dạy';
            const statusMap = {
                teaching: 'Đang giảng dạy',
                break: 'Tạm nghỉ',
                resigned: 'Đã nghỉ việc',
                retired: 'Nghỉ hưu'
            };
            if (lecturer.status && statusMap[lecturer.status]) {
                viStatus = statusMap[lecturer.status];
            } else if (lecturer.status && statusOptions.some(opt => opt.value === lecturer.status)) {
                viStatus = lecturer.status;
            }
            setEditedLecturer({
                lecturer_id: lecturer.lecturer_id || '',
                name: lecturer.name || '',
                email: lecturer.account.email || '',
                day_of_birth: lecturer.day_of_birth || '',
                gender: lecturer.gender || '',
                address: lecturer.address || '',
                phone_number: lecturer.phone_number || '',
                department: lecturer.department || '',
                hire_date: lecturer.hire_date || '',
                degree: lecturer.degree || '',
                subjects: lecturer.subjects?.map(s => s.subject_id) || [],
                status: viStatus,
            });
            setBusySlots(lecturer.busy_slots || []);
            setSemesterBusySlots(lecturer.semester_busy_slots || []);
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
        } else if (activeStep === 2) {
            if (!editedLecturer.department || !editedLecturer.hire_date || !editedLecturer.degree) {
                setLocalError('Vui lòng điền đầy đủ thông tin công tác');
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

    const handleAddBusySlot = () => {
        setBusySlots([...busySlots, { day: '', slot_id: '' }]);
    };

    const handleRemoveBusySlot = (index) => {
        setBusySlots(busySlots.filter((_, i) => i !== index));
    };

    const handleBusySlotChange = (index, field, value) => {
        const updatedSlots = [...busySlots];
        updatedSlots[index][field] = value;
        setBusySlots(updatedSlots);
    };

    const handleAddSemesterBusySlot = () => {
        setSemesterBusySlots([...semesterBusySlots, { date: '', slot_id: '' }]);
    };

    const handleRemoveSemesterBusySlot = (index) => {
        setSemesterBusySlots(semesterBusySlots.filter((_, i) => i !== index));
    };

    const handleSemesterBusySlotChange = (index, field, value) => {
        const updatedSlots = [...semesterBusySlots];
        updatedSlots[index][field] = value;
        setSemesterBusySlots(updatedSlots);
    };

    const handleSubmit = async () => {
        if (activeStep < steps.length - 1) {
            if (!editedLecturer.department || !editedLecturer.hire_date || !editedLecturer.degree) {
                setLocalError('Vui lòng điền đầy đủ thông tin công tác');
                return;
            }
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

        // Chuyển trạng thái sang tiếng Anh trước khi lưu
        const statusObj = statusOptions.find(opt => opt.value === editedLecturer.status);
        const dbStatus = statusObj ? statusObj.db : 'teaching';

        const updatedLecturerData = {
            ...editedLecturer,
            status: dbStatus,
            updated_at: new Date().toISOString(),
        };

        await onSave(updatedLecturerData, editedLecturer.subjects, busySlots, semesterBusySlots);
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

                    {activeStep === 3 && (
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: 3
                        }}>
                            {/* Lịch bận thường xuyên */}
                            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" gutterBottom color="primary">
                                    Lịch bận thường xuyên
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Các tiết học bận cố định theo tuần
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleAddBusySlot}
                                    sx={{ mb: 2 }}
                                    startIcon={<AddIcon />}
                                    size="small"
                                >
                                    Thêm lịch bận
                                </Button>
                                {busySlots.map((slot, index) => (
                                    <Box key={index} sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr auto',
                                        gap: 1,
                                        mb: 2,
                                        alignItems: 'center'
                                    }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Thứ</InputLabel>
                                            <Select
                                                value={slot.day}
                                                onChange={(e) => handleBusySlotChange(index, 'day', e.target.value)}
                                                label="Thứ"
                                            >
                                                <MenuItem value="Mon">Thứ 2</MenuItem>
                                                <MenuItem value="Tue">Thứ 3</MenuItem>
                                                <MenuItem value="Wed">Thứ 4</MenuItem>
                                                <MenuItem value="Thu">Thứ 5</MenuItem>
                                                <MenuItem value="Fri">Thứ 6</MenuItem>
                                                <MenuItem value="Sat">Thứ 7</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Tiết</InputLabel>
                                            <Select
                                                value={slot.slot_id}
                                                onChange={(e) => handleBusySlotChange(index, 'slot_id', e.target.value)}
                                                label="Tiết"
                                            >
                                                <MenuItem value="S1">Tiết 1 (7:00-09:00)</MenuItem>
                                                <MenuItem value="S2">Tiết 2 (09:00-11:00)</MenuItem>
                                                <MenuItem value="C1">Tiết 3 (13:00-15:00)</MenuItem>
                                                <MenuItem value="C2">Tiết 4 (15:00-17:00)</MenuItem>
                                                <MenuItem value="T1">Tiết 5 (17:30-19:30)</MenuItem>
                                                <MenuItem value="T2">Tiết 6 (19:30-21:30)</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <IconButton
                                            onClick={() => handleRemoveBusySlot(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <Close />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Paper>

                            {/* Lịch bận học kỳ */}
                            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" gutterBottom color="secondary">
                                    Lịch bận học kỳ
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Các ngày bận cụ thể trong học kỳ
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleAddSemesterBusySlot}
                                    sx={{ mb: 2 }}
                                    startIcon={<AddIcon />}
                                    size="small"
                                >
                                    Thêm lịch bận
                                </Button>
                                {semesterBusySlots.map((slot, index) => (
                                    <Box key={index} sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr auto',
                                        gap: 1,
                                        mb: 2,
                                        alignItems: 'center'
                                    }}>
                                        <TextField
                                            label="Ngày"
                                            type="date"
                                            value={slot.date}
                                            onChange={(e) => handleSemesterBusySlotChange(index, 'date', e.target.value)}
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Tiết</InputLabel>
                                            <Select
                                                value={slot.slot_id}
                                                onChange={(e) => handleSemesterBusySlotChange(index, 'slot_id', e.target.value)}
                                                label="Tiết"
                                            >
                                                <MenuItem value="S1">Tiết 1 (7:00-09:00)</MenuItem>
                                                <MenuItem value="S2">Tiết 2 (09:00-11:00)</MenuItem>
                                                <MenuItem value="C1">Tiết 3 (13:00-15:00)</MenuItem>
                                                <MenuItem value="C2">Tiết 4 (15:00-17:00)</MenuItem>
                                                <MenuItem value="T1">Tiết 5 (17:30-19:30)</MenuItem>
                                                <MenuItem value="T2">Tiết 6 (19:30-21:30)</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <IconButton
                                            onClick={() => handleRemoveSemesterBusySlot(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <Close />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Paper>
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