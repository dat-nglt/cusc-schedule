import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    IconButton,
    CircularProgress,
    Chip,
    Fade,
    Alert,
    Tooltip,
    FormControl,
    InputAdornment
} from '@mui/material';
import {
    Close,
    Info,
    Send,
    EventAvailable,
    Room,
    AccessTime,
    CalendarToday,
    Class,
    Search
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { format, addDays, isAfter, isBefore, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';

const getLecturerBusySlotsAPI = async (lecturerId) => {
    return {
        data: {
            '2025-08-28': ['S1', 'C2'],
            '2025-08-29': ['S2'],
            '2025-08-30': ['C1', 'T1'],
            '2025-09-01': ['S1', 'S2'],
        }
    };
};

const getRoomAvailabilityAPI = async (date, slotId) => {
    // In a real app, this would check room availability for the given date and slot
    return {
        data: [
            { room_id: 'P.101', available: true },
            { room_id: 'P.102', available: true },
            { room_id: 'PH.201', available: false },
            { room_id: 'P.103', available: true },
            { room_id: 'PH.202', available: true },
        ]
    };
};

const createScheduleChangeRequestAPI = async (data) => {
    console.log('Sending request:', data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.reason.includes('lỗi')) {
                reject({
                    response: {
                        data: {
                            message: 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.'
                        }
                    }
                });
            } else {
                resolve({ success: true, message: 'Gửi yêu cầu thành công!' });
            }
        }, 1500);
    });
};

// Constants
const TIME_SLOTS = [
    { id: 'S1', time: '7:00 - 9:00', label: 'S1' },
    { id: 'S2', time: '9:00 - 11:00', label: 'S2' },
    { id: 'C1', time: '13:00 - 15:00', label: 'C1' },
    { id: 'C2', time: '15:00 - 17:00', label: 'C2' },
    { id: 'T1', time: '17:30 - 19:30', label: 'T1' },
    { id: 'T2', time: '19:30 - 21:30', label: 'T2' },
];

export const FormChangeScheduleRequest = ({ open, onClose, scheduleItem }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        class_schedule_id: '',
        lecturer_id: '',
        requested_date: null,
        requested_room_id: '',
        requested_slot_id: '',
        reason: ''
    });
    const [availableRooms, setAvailableRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomSearch, setRoomSearch] = useState('');
    const [lecturerBusySlots, setLecturerBusySlots] = useState({});
    const [roomAvailability, setRoomAvailability] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [fetchingRoomAvailability, setFetchingRoomAvailability] = useState(false);

    // Memoized week days calculation
    const weekDays = useMemo(() => {
        const days = [];
        const today = new Date();
        // Get next 7 days starting from tomorrow
        for (let i = 1; i <= 7; i++) {
            const nextDay = addDays(today, i);
            days.push(nextDay);
        }
        return days;
    }, [open]);

    // Filter rooms based on search term
    useEffect(() => {
        if (roomSearch.trim() === '') {
            setFilteredRooms(availableRooms);
        } else {
            const searchTerm = roomSearch.toLowerCase();
            setFilteredRooms(availableRooms.filter(room =>
                room.room_id.toLowerCase().includes(searchTerm) ||
                room.room_type.toLowerCase().includes(searchTerm)
            ));
        }
    }, [availableRooms, roomSearch]);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [roomsRes, busySlotsRes] = await Promise.all([
                    getLecturerBusySlotsAPI(scheduleItem?.lecturer_id)
                ]);
                setAvailableRooms(roomsRes.data);
                setFilteredRooms(roomsRes.data);
                setLecturerBusySlots(busySlotsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (open && scheduleItem) {
            fetchData();
            setFormData({
                class_schedule_id: scheduleItem.class_schedule_id || '',
                lecturer_id: scheduleItem.lecturer_id || '',
                requested_date: null,
                requested_room_id: '',
                requested_slot_id: '',
                reason: ''
            });
            setSelectedSlot(null);
            setError(null);
            setRoomSearch('');
        }
    }, [open, scheduleItem]);

    // Fetch room availability when a slot is selected
    useEffect(() => {
        const fetchRoomAvailability = async () => {
            if (selectedSlot) {
                setFetchingRoomAvailability(true);
                try {
                    const response = await getRoomAvailabilityAPI(selectedSlot.date, selectedSlot.slotId);
                    setRoomAvailability(prev => ({
                        ...prev,
                        [`${selectedSlot.date}-${selectedSlot.slotId}`]: response.data
                    }));
                } catch (error) {
                    console.error('Error fetching room availability:', error);
                    toast.error('Không thể tải thông tin phòng. Vui lòng thử lại.');
                } finally {
                    setFetchingRoomAvailability(false);
                }
            }
        };

        fetchRoomAvailability();
    }, [selectedSlot]);

    const handleSelectSlot = useCallback((date, slotId) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setSelectedSlot({ date: formattedDate, slotId });
        setFormData(prev => ({
            ...prev,
            requested_date: formattedDate,
            requested_slot_id: slotId,
            requested_room_id: '' // Reset room selection when slot changes
        }));
        setError(null);
    }, []);

    const handleSendForm = async () => {
        setLoading(true);
        try {
            const response = await createScheduleChangeRequestAPI(formData);
            if (response.success === true) {
                toast.success('Yêu cầu thay đổi lịch học đã được gửi thành công!');
                onClose();
            } else {
                const errorMessage = response.message || 'Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error submitting schedule change request:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = useMemo(() => {
        return (
            formData.requested_date &&
            formData.requested_room_id &&
            formData.requested_slot_id &&
            formData.reason.trim() !== ''
        );
    }, [formData]);

    const isRoomAvailable = useCallback((roomId) => {
        if (!selectedSlot) return true;

        const availabilityKey = `${selectedSlot.date}-${selectedSlot.slotId}`;
        const availability = roomAvailability[availabilityKey];

        if (!availability) return true; // Assume available if data not loaded yet

        const room = availability.find(r => r.room_id === roomId);
        return room ? room.available : true;
    }, [selectedSlot, roomAvailability]);

    const renderHeader = () => (
        <Box sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            py: 2.5,
            px: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Typography variant="h5" fontWeight="600">
                <Class sx={{ mr: 1, verticalAlign: 'bottom' }} />
                Yêu cầu thay đổi lịch học
            </Typography>
            <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label="close"
            >
                <Close />
            </IconButton>
        </Box>
    );

    const renderScheduleGrid = () => (
        <Paper sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
            background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                    <EventAvailable sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                        Chọn ngày và ca học mới
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        Vui lòng chọn một ô trống để đặt lịch mới
                    </Typography>
                </Box>
            </Box>

            {/* Schedule Grid */}
            <Box sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: '100%',
                overflowX: 'auto',
                mb: 2
            }}>
                {/* Header - Days of Week */}
                <Box sx={{
                    display: 'flex',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <Box sx={{
                        width: 120,
                        p: 1,
                        textAlign: 'center',
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'primary.light',
                        zIndex: 11
                    }}>
                        Khung giờ
                    </Box>
                    {weekDays.map(day => (
                        <Box key={day.toISOString()} sx={{
                            flex: 1,
                            minWidth: 90,
                            p: 1,
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            borderLeft: '1px solid',
                            borderColor: alpha(theme.palette.primary.dark, 0.1)
                        }}>
                            {format(day, 'EEE', { locale: vi }).toUpperCase()} <br />
                            <Chip
                                label={format(day, 'dd/MM')}
                                size="small"
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    mt: 0.5,
                                    backgroundColor: isToday(day) ? alpha(theme.palette.secondary.main, 0.7) : 'transparent'
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Rows - Time Slots */}
                {TIME_SLOTS.map(slot => (
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
                            fontSize: '0.8rem',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            position: 'sticky',
                            left: 0,
                            zIndex: 1
                        }}>
                            {slot.time} <br /> ({slot.label})
                        </Box>
                        {weekDays.map(day => {
                            const formattedDate = format(day, 'yyyy-MM-dd');
                            const isBusy = lecturerBusySlots[formattedDate]?.includes(slot.id);
                            const isSelected = selectedSlot?.date === formattedDate && selectedSlot?.slotId === slot.id;

                            const cellStyle = {
                                flex: 1,
                                minWidth: 90,
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderLeft: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s',
                                cursor: isBusy ? 'not-allowed' : 'pointer',
                                bgcolor: isSelected ? alpha(theme.palette.success.light, 0.4) : isBusy ? alpha(theme.palette.error.light, 0.2) : 'transparent',
                                '&:hover': {
                                    bgcolor: isBusy ? null : isSelected ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.primary.light, 0.2)
                                }
                            };

                            const cellContent = isBusy ? (
                                <Tooltip title="Giảng viên đã bận" arrow>
                                    <Box component="span" sx={{ fontSize: '0.8rem', color: 'error.main', fontWeight: 'bold' }}>
                                        Bận
                                    </Box>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Chọn giờ này" arrow>
                                    <Box component="span" sx={{
                                        fontSize: '0.8rem',
                                        color: isSelected ? 'success.main' : 'text.secondary',
                                        fontWeight: isSelected ? 'bold' : 'normal'
                                    }}>
                                        {isSelected ? 'Đã chọn' : 'Trống'}
                                    </Box>
                                </Tooltip>
                            );

                            return (
                                <Box
                                    key={`${formattedDate}-${slot.id}`}
                                    sx={cellStyle}
                                    onClick={() => !isBusy && handleSelectSlot(day, slot.id)}
                                >
                                    {cellContent}
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Box>

            {selectedSlot && (
                <Box sx={{ mt: 2, p: 1, bgcolor: alpha(theme.palette.info.light, 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" color="info.main">
                        Đã chọn: {format(new Date(selectedSlot.date), 'dd/MM/yyyy')} - {
                            TIME_SLOTS.find(s => s.id === selectedSlot.slotId)?.time
                        }
                    </Typography>
                </Box>
            )}
        </Paper>
    );

    if (!scheduleItem) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'visible',
                    boxShadow: theme.shadows[15],
                    maxHeight: '90vh'
                }
            }}
        >
            {renderHeader()}
            <DialogContent sx={{ p: 4, overflow: 'auto' }}>
                <Grid container spacing={4}>
                    {/* Left Panel - Current Information */}
                    <Grid item xs={12} md={5}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                backgroundColor: alpha(theme.palette.primary.light, 0.03),
                                height: '100%',
                                position: 'sticky',
                                top: 20
                            }}
                        >
                            <Typography variant="h6" fontWeight="600" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Info sx={{ mr: 1, fontSize: '1.3rem' }} />
                                Thông tin lớp học hiện tại
                            </Typography>

                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: '1.1rem' }} />
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500' }}>Ngày:</Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {scheduleItem.date ? new Date(scheduleItem.date).toLocaleDateString('vi-VN') : ''}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <AccessTime sx={{ mr: 1, color: 'text.secondary', fontSize: '1.1rem' }} />
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500' }}>Thời gian:</Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {TIME_SLOTS.find(s => s.id === scheduleItem.slot_id)?.time}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Room sx={{ mr: 1, color: 'text.secondary', fontSize: '1.1rem' }} />
                                <Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500' }}>Phòng hiện tại:</Typography>
                                    <Typography variant="body1" fontWeight="500">{scheduleItem.room_id}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500' }}>Môn học:</Typography>
                                <Chip
                                    label={scheduleItem.subject?.subject_name}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: '500' }}>Giảng viên:</Typography>
                                <Typography variant="body1" fontWeight="500">{scheduleItem.lecturer?.name}</Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Panel - Change Form */}
                    <Grid item xs={12} md={7}>
                        {renderScheduleGrid()}

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        select
                                        label="Phòng yêu cầu *"
                                        value={formData.requested_room_id}
                                        onChange={(e) => setFormData(prev => ({ ...prev, requested_room_id: e.target.value }))}
                                        disabled={!selectedSlot || fetchingRoomAvailability}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Room color={selectedSlot ? "action" : "disabled"} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Search color="action" />
                                                </InputAdornment>
                                            )
                                        }}
                                        helperText={!selectedSlot ? "Vui lòng chọn ngày và ca học trước" : ""}
                                    >
                                        <MenuItem value="">
                                            <em>Chọn phòng học mới</em>
                                        </MenuItem>
                                        {filteredRooms.map((room) => {
                                            const isAvailable = isRoomAvailable(room.room_id);
                                            return (
                                                <MenuItem
                                                    key={room.room_id}
                                                    value={room.room_id}
                                                    disabled={!isAvailable}
                                                >
                                                    {room.room_id} - {room.room_type} ({room.capacity} chỗ)
                                                    {!isAvailable && " - Đã có lịch"}
                                                </MenuItem>
                                            );
                                        })}
                                    </TextField>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    placeholder="Tìm kiếm phòng..."
                                    value={roomSearch}
                                    onChange={(e) => setRoomSearch(e.target.value)}
                                    sx={{ mt: 1 }}
                                    size="small"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Lý do thay đổi *"
                                    value={formData.reason}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Mô tả chi tiết lý do cần thay đổi lịch học..."
                                    helperText="Vui lòng cung cấp lý do rõ ràng cho việc thay đổi lịch học"
                                />
                            </Grid>
                        </Grid>

                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider sx={{ my: 1 }} />

            <DialogActions sx={{ p: 3, pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                    Hủy bỏ
                </Button>
                <Button
                    onClick={handleSendForm}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: '600' }}
                >
                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FormChangeScheduleRequest;