import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    MenuItem,
    Grid,
    useTheme,
    alpha,
    Paper,
    Divider,
    InputAdornment,
    Chip,
    FormControl,
    InputLabel,
    Select,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatScheduleTime } from '../../utils/scheduleUtils';
import { getAllRoomAPI } from '../../api/roomAPI';
import {
    CalendarToday,
    Class,
    Info
} from '@mui/icons-material';
import { createScheduleChangeRequestAPI } from '../../api/schedulechangerequestAPI';
import { toast } from 'react-toastify';


const FormChangeScheduleRequest = ({ open, onClose, scheduleItem }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        class_schedule_id: '',
        lecturer_id: '',
        requested_date: null,
        requested_room_id: '',
        requested_slot_id: '',
        reason: ''
    });

    // Danh sách phòng và slot
    const [availableRooms, setAvailableRooms] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const rooms = await getAllRoomAPI();
                setAvailableRooms(rooms.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, []);


    const timeSlots = [
        { id: 'S1', time: '7:00 - 9:00' },
        { id: 'S2', time: '9:00 - 11:00' },
        { id: 'C1', time: '13:00 - 15:00' },
        { id: 'C2', time: '15:00 - 17:00' },
        { id: 'T1', time: '17:30 - 19:30' },
        { id: 'T2', time: '19:30 - 21:30' },
    ];

    const handleSendForm = async () => {
        try {
            const response = await createScheduleChangeRequestAPI(formData);

            // Nếu API trả về success: true
            if (response.success === true) {
                toast.success('Yêu cầu thay đổi lịch học đã được gửi thành công!');
                onClose();
                setActiveStep(0);
                setFormData({ // Đảm bảo reset form sau khi gửi thành công
                    class_schedule_id: '',
                    lecturer_id: '',
                    requested_date: null,
                    requested_room_id: '',
                    requested_slot_id: '',
                    reason: ''
                });
            }
            // Nếu API trả về success: false
            else {
                // Lấy message từ response và lưu vào state 'error'
                const errorMessage = response.message || 'Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.';
                setError(errorMessage);
                toast.error(errorMessage); // Hiển thị toast lỗi
                console.log('API Error:', errorMessage);
            }
        } catch (error) {
            // Xử lý các lỗi khác như lỗi mạng, server down
            const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage); // Hiển thị toast lỗi
            console.error('Error submitting schedule change request:', error);
        }
    };


    const steps = ['Thông tin lớp học', 'Chi tiết thay đổi', 'Xác nhận'];

    useEffect(() => {
        if (scheduleItem) {
            setFormData({
                class_schedule_id: scheduleItem.id || '',
                lecturer_id: scheduleItem.lecturer_id || '',
                requested_date: null,
                requested_room_id: '',
                requested_slot_id: '',
                reason: ''
            });
        }
    }, [scheduleItem]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };


    if (!scheduleItem) return null;

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                backgroundColor: alpha(theme.palette.primary.light, 0.03)
                            }}
                        >
                            <Typography variant="h6" fontWeight="600" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Info sx={{ mr: 1, fontSize: '1.3rem' }} />
                                Thông tin lớp học hiện tại
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500', mb: 0.5 }}>
                                            Môn học
                                        </Typography>
                                        <Chip
                                            label={scheduleItem.subject}
                                            color="primary"
                                            sx={{ width: 'fit-content' }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500', mb: 0.5 }}>
                                            Giảng viên
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">{scheduleItem.lecturer}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500', mb: 0.5 }}>
                                            Phòng hiện tại
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">{scheduleItem.room}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500', mb: 0.5 }}>
                                            Thời gian
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">{formatScheduleTime(scheduleItem.slot_id)}</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, color: theme.palette.secondary.main }} />
                            Thông tin thay đổi
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Ngày yêu cầu *"
                                        value={formData.requested_date}
                                        onChange={(newValue) => handleInputChange('requested_date', newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                helperText="Chọn ngày bạn muốn thay đổi lịch học"
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Ca học yêu cầu *</InputLabel>
                                    <Select
                                        value={formData.requested_slot_id}
                                        label="Ca học yêu cầu *"
                                        onChange={(e) => handleInputChange('requested_slot_id', e.target.value)}
                                    >
                                        {timeSlots.map((slot) => (
                                            <MenuItem key={slot.id} value={slot.id}>
                                                {slot.time} ({slot.id})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant="caption" color="textSecondary" sx={{ ml: 2, mt: 0.5 }}>
                                        Chọn ca học mới
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Phòng yêu cầu *</InputLabel>
                                    <Select
                                        value={formData.requested_room_id}
                                        label="Phòng yêu cầu"
                                        onChange={(e) => handleInputChange('requested_room_id', e.target.value)}
                                    >
                                        {availableRooms.map((room) => (
                                            <MenuItem key={room.room_id} value={room.room_id}>
                                                {room.room_id}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Typography variant="caption" color="textSecondary" sx={{ ml: 2, mt: 0.5 }}>
                                        Chọn phòng học mới
                                    </Typography>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Lý do thay đổi *"
                                    value={formData.reason}
                                    onChange={(e) => handleInputChange('reason', e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Mô tả chi tiết lý do cần thay đổi lịch học..."
                                    helperText="Vui lòng cung cấp lý do rõ ràng cho việc thay đổi lịch học"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                            <Info sx={{ mr: 1, color: theme.palette.info.main }} />
                            Xác nhận yêu cầu thay đổi
                        </Typography>

                        <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: alpha(theme.palette.success.light, 0.1) }}>
                            <Typography variant="body1" gutterBottom>
                                Vui lòng kiểm tra lại thông tin trước khi gửi yêu cầu.
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">Ngày yêu cầu:</Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {formData.requested_date ? new Date(formData.requested_date).toLocaleDateString('vi-VN') : 'Chưa chọn'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">Ca học:</Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {formData.requested_slot_id ?
                                            `${timeSlots.find(s => s.id === formData.requested_slot_id)?.time} (${formData.requested_slot_id})` :
                                            'Chưa chọn'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="textSecondary">Phòng:</Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {formData.requested_room_id ?
                                            availableRooms.find(r => r.room_id === formData.requested_room_id)?.room_id :
                                            'Chưa chọn'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">Lý do:</Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                                        {formData.reason || 'Chưa nhập'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                        {error && (
                            <Typography variant="body2" color="error" sx={{ ml: 2 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                );
            default:
                return <div>Unknown step</div>;
        }
    };

    const isStepValid = () => {
        switch (activeStep) {
            case 1:
                return formData.requested_date && formData.requested_room_id &&
                    formData.requested_slot_id && formData.reason;
            default:
                return true;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'visible',
                    boxShadow: theme.shadows[15]
                }
            }}
        >
            <DialogTitle sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                py: 2.5,
                px: 4,
                textAlign: 'center'
            }}>
                <Typography variant="h5" fontWeight="600">
                    <Class sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    Yêu cầu thay đổi lịch học
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: 'visible' }}>
                <Box sx={{ px: 4, pt: 3, pb: 1 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ p: 4, pt: 3 }}>
                    {renderStepContent(activeStep)}
                </Box>
            </DialogContent>


            <Divider sx={{ my: 1 }} />

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                    onClick={activeStep === 0 ? onClose : handleBack}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                    {activeStep === 0 ? 'Hủy bỏ' : 'Quay lại'}
                </Button>

                <Box sx={{ flex: '1 1 auto' }} />

                {activeStep === steps.length - 1 ? (
                    <Button
                        onClick={handleSendForm}
                        variant="contained"
                        sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: '600' }}
                    >
                        Gửi yêu cầu
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        disabled={!isStepValid()}
                        sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: '600' }}
                    >
                        Tiếp theo
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default FormChangeScheduleRequest;