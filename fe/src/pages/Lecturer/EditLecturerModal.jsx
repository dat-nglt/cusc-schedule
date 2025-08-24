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
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Chip,
    InputAdornment,
    Fade,
    Paper,
    Grid,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider
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
    Cancel,
    EventRepeat,
    EventBusy
} from '@mui/icons-material';
import { format } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getDayName } from '../../utils/scheduleUtils';
import { getSlotLabel } from '../../utils/scheduleUtils';

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

export default function EditLecturerModal({ open, onClose, lecturer, onSave, existingLecturers, error, loading, subjects }) {
    const [editedLecturer, setEditedLecturer] = useState({
        lecturer_id: '',
        name: '',
        email: '',
        day_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        department: '',
        degree: '',
        subjects: lecturer?.subjects,
        status: 'active',
    });

    const [busySlots, setBusySlots] = useState([]);
    const [semesterBusySlots, setSemesterBusySlots] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);

    useEffect(() => {
        if (lecturer && open) {
            // Chuyển trạng thái từ tiếng Anh sang tiếng Việt để hiển thị
            let viStatus = 'Hoạt động';
            const statusMap = {
                active: 'Hoạt động',
                break: 'Tạm nghỉ',
                resigned: 'Nghỉ việc',
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
                email: lecturer.email || lecturer.account?.email || '',
                day_of_birth: lecturer.day_of_birth || '',
                gender: lecturer.gender || '',
                address: lecturer.address || '',
                phone_number: lecturer.phone_number || '',
                department: lecturer.department || '',
                degree: lecturer.degree || '',
                subjects: lecturer.subjects?.map(s => s.subject_id || s) || [],
                status: viStatus,
            });

            setBusySlots(lecturer.busy_slots || []);
            setSemesterBusySlots(lecturer.semester_busy_slots || []);
            setActiveStep(0);
            setLocalError('');
        }
    }, [lecturer, open]);

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

    // Hàm xóa tất cả slot của một ngày
    const handleRemoveDateSlots = (date) => {
        setSemesterBusySlots(semesterBusySlots.filter(slot => slot.date !== date));
    };

    // Hàm xóa một slot cụ thể trong danh sách bận thường
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
            if (!editedLecturer.department || !editedLecturer.degree) {
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

    const handleSubmit = async () => {
        const birthDate = new Date(editedLecturer.day_of_birth);
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

        // Bỏ chính nó ra khỏi danh sách so sánh
        const otherLecturers = existingLecturers.filter(
            (lecturer) => lecturer.lecturer_id !== editedLecturer.lecturer_id
        );

        const isDuplicateId = otherLecturers.some(
            (lecturer) => lecturer.lecturer_id === editedLecturer.lecturer_id
        );
        if (isDuplicateId) {
            setLocalError(`Mã giảng viên "${editedLecturer.lecturer_id}" đã tồn tại`);
            return;
        }

        // Check duplicate Email
        const isEmailDuplicate = otherLecturers.some(
            (lecturer) => lecturer.email === editedLecturer.email
        );
        if (isEmailDuplicate) {
            setLocalError(`Email "${editedLecturer.email}" đã tồn tại`);
            return;
        }

        // Check duplicate Phone
        const isPhoneDuplicate = otherLecturers.some(
            (lecturer) => lecturer.phone_number === editedLecturer.phone_number
        );
        if (isPhoneDuplicate) {
            setLocalError(`Số điện thoại "${editedLecturer.phone_number}" đã tồn tại`);
            return;
        }

        const updatedLecturerData = {
            ...editedLecturer,
            status: "active",
            updated_at: new Date().toISOString(),
        };

        console.log(updatedLecturerData);
        console.log(editedLecturer.subjects);
        console.log(busySlots);
        console.log(semesterBusySlots);

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
                                        {editedLecturer.subjects && (
                                            <Chip
                                                label={`${editedLecturer.subjects.length} môn đã chọn`}
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
                                                                    borderColor: editedLecturer.subjects.includes(subject.subject_id) ?
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
                                                                            checked={editedLecturer.subjects.includes(subject.subject_id)}
                                                                            onChange={(e) => {
                                                                                const subjectId = subject.subject_id;
                                                                                let newSubjects;

                                                                                if (e.target.checked) {
                                                                                    newSubjects = [...editedLecturer.subjects, subjectId];
                                                                                } else {
                                                                                    newSubjects = editedLecturer.subjects.filter(id => id !== subjectId);
                                                                                }

                                                                                setEditedLecturer(prev => ({
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

                                            {editedLecturer.subjects.length > 0 && (
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
                                                        Môn học đã chọn:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {editedLecturer.subjects.map((subjectId) => {
                                                            const subject = subjects.find(s => s.subject_id === subjectId);
                                                            return (
                                                                <Chip
                                                                    key={subjectId}
                                                                    label={subject ? `${subject.subject_name}` : subjectId}
                                                                    size="small"
                                                                    color="primary"
                                                                    onDelete={() => {
                                                                        const newSubjects = editedLecturer.subjects.filter(id => id !== subjectId);
                                                                        setEditedLecturer(prev => ({
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
                                            <School sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
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
                                        startIcon={<EventBusy />}
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