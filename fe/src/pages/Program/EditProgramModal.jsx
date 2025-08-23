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
    Divider,
    Stepper,
    Step,
    StepLabel,
    Chip,
    InputAdornment,
    Fade,
    Grid
} from '@mui/material';
import {
    Close,
    School,
    Class,
    CheckCircle,
    Error as ErrorIcon,
    Update
} from '@mui/icons-material';

const steps = ['Thông tin cơ bản', 'Cập nhật trạng thái'];
const availableTrainingDurations = [1, 2, 3, 4];
const statusOptions = [
    { value: 'Hoạt động', db: 'active', color: 'success' },
    { value: 'Tạm ngưng', db: 'suspended', color: 'warning' },
    { value: 'Ngưng hoạt động', db: 'inactive', color: 'error' }
];

export default function EditProgramModal({ open, onClose, program, onSave, error, loading }) {
    const [editedProgram, setEditedProgram] = useState({
        program_id: '',
        program_name: '',
        training_duration: '',
        status: 'Hoạt động',
    });
    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (program) {
            // Chuyển trạng thái từ tiếng Anh sang tiếng Việt để hiển thị
            let viStatus = 'Hoạt động';
            const statusMap = {
                active: 'Hoạt động',
                inactive: 'Ngưng hoạt động',
                suspended: 'Tạm ngưng'
            };
            if (program.status && statusMap[program.status]) {
                viStatus = statusMap[program.status];
            } else if (program.status && statusOptions.some(opt => opt.value === program.status)) {
                viStatus = program.status;
            }
            
            setEditedProgram({
                program_id: program.program_id || '',
                program_name: program.program_name || '',
                training_duration: program.training_duration || '',
                status: viStatus,
            });
        }
        setActiveStep(0);
        setLocalError('');
    }, [program]);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!editedProgram.program_name || !editedProgram.training_duration) {
                setLocalError('Vui lòng điền đầy đủ thông tin cơ bản');
                return;
            }

            // Validate program name length
            if (editedProgram.program_name.length < 3) {
                setLocalError('Tên chương trình phải có ít nhất 3 ký tự!');
                return;
            }

            // Validate training duration
            if (!availableTrainingDurations.includes(Number(editedProgram.training_duration))) {
                setLocalError('Thời gian đào tạo không hợp lệ!');
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
        setEditedProgram((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        // Chuyển trạng thái sang tiếng Anh trước khi lưu
        const statusObj = statusOptions.find(opt => opt.value === editedProgram.status);
        const dbStatus = statusObj ? statusObj.db : 'active';

        const updatedProgramData = {
            program_id: editedProgram.program_id,
            program_name: editedProgram.program_name,
            training_duration: editedProgram.training_duration,
            status: dbStatus,
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onSave được truyền từ component cha
        await onSave(updatedProgramData);
        if (!error) {
            onClose();
        }
    };

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption ? statusOption.color : 'default';
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
                        Chỉnh Sửa Chương Trình Đào Tạo
                    </Typography>
                </Box>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
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
                                value={editedProgram.program_id}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                                disabled={true}
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
                                value={editedProgram.program_name}
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
                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                <InputLabel>Thời gian đào tạo</InputLabel>
                                <Select
                                    name="training_duration"
                                    value={editedProgram.training_duration}
                                    onChange={handleChange}
                                    label="Thời gian đào tạo"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Update color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {availableTrainingDurations.map((duration) => (
                                        <MenuItem key={duration} value={duration}>
                                            {duration} Năm
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    label={editedProgram.status}
                                    color={getStatusColor(editedProgram.status)}
                                    sx={{ 
                                        height: 40, 
                                        width: '100%',
                                        justifyContent: 'flex-start',
                                        '& .MuiChip-label': {
                                            display: 'block',
                                            whiteSpace: 'normal'
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Cập nhật trạng thái chương trình
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                Chọn trạng thái mới cho chương trình đào tạo
                            </Typography>

                            <FormControl fullWidth required>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    name="status"
                                    value={editedProgram.status}
                                    onChange={handleChange}
                                    label="Trạng thái"
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip 
                                                    label={option.value} 
                                                    color={option.color} 
                                                    size="small" 
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    <strong>Lưu ý:</strong> Thay đổi trạng thái có thể ảnh hưởng đến việc hiển thị chương trình trên hệ thống.
                                </Typography>
                            </Alert>
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
                    {/* Có thể thêm nút hành động bổ sung ở đây nếu cần */}
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
                            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                        >
                            {loading ? 'Đang lưu...' : 'Cập nhật chương trình'}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
}