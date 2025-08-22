import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    Typography,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Chip,
    IconButton,
    Paper,
    Grid,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    School,
    Room,
    Person,
    Class,
    Close,
    NavigateNext,
    NavigateBefore
} from '@mui/icons-material';

const steps = ['Chương trình', 'Phòng học', 'Giảng viên', 'Lớp học'];

export default function CreateSchedulesAutoModal({
    open,
    onClose,
    programs = [],
    rooms = [],
    lecturers = [],
    classes = [],
    onGenerate,
    onSelectionChange
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [activeStep, setActiveStep] = useState(0);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedLecturers, setSelectedLecturers] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        setSelectedPrograms([]);
        setSelectedRooms([]);
        setSelectedLecturers([]);
        setSelectedClasses([]);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleGenerate = () => {
        // Gửi selections về parent component
        const selections = {
            programs: selectedPrograms,
            rooms: selectedRooms,
            lecturers: selectedLecturers,
            classes: selectedClasses
        };

        if (onSelectionChange) {
            onSelectionChange(selections);
        }

        onGenerate();
        handleClose();
    };

    const isStepValid = (step) => {
        switch (step) {
            case 0: return selectedPrograms.length > 0;
            case 1: return selectedRooms.length > 0;
            case 2: return selectedLecturers.length > 0;
            case 3: return selectedClasses.length > 0;
            default: return false;
        }
    };

    // Hàm xử lý "Chọn tất cả" cho từng loại dữ liệu
    const handleSelectAll = (items, selectedItems, setSelectedItems, idKey) => (event) => {
        if (event.target.checked) {
            if (Array.isArray(items)) {
                setSelectedItems(items.map(item => item[idKey]));
            }
        } else {
            setSelectedItems([]);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <School color="primary" />
                            <Typography variant="subtitle1" fontWeight="600">
                                Chọn chương trình học
                            </Typography>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Array.isArray(programs) && selectedPrograms.length === programs.length && programs.length > 0}
                                        indeterminate={selectedPrograms.length > 0 && Array.isArray(programs) && selectedPrograms.length < programs.length}
                                        onChange={handleSelectAll(programs, selectedPrograms, setSelectedPrograms, 'program_id')}
                                    />
                                }
                                label="Chọn tất cả chương trình"
                                sx={{ mb: 0 }}
                            />
                        </Paper>

                        <Box sx={{
                            maxHeight: 300,
                            overflow: 'auto',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                        }}>
                            {Array.isArray(programs) && programs.length > 0 ? programs.map((program) => (
                                <Box
                                    key={program.program_id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: selectedPrograms.includes(program.program_id) ? 'primary.50' : 'transparent',
                                        '&:last-child': { borderBottom: 'none' },
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedPrograms.includes(program.program_id)}
                                        onChange={() => setSelectedPrograms(prev =>
                                            prev.includes(program.program_id)
                                                ? prev.filter(id => id !== program.program_id)
                                                : [...prev, program.program_id]
                                        )}
                                        sx={{ mr: 1.5 }}
                                    />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight="500" noWrap>
                                            {program.program_name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Mã: {program.program_id}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Thời lượng: {program.duration}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )) : (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Không có chương trình nào để hiển thị
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {selectedPrograms.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" fontWeight="medium" display="block" gutterBottom>
                                    Đã chọn: {selectedPrograms.length} chương trình
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selectedPrograms.slice(0, 3).map(id => {
                                        const program = Array.isArray(programs) ? programs.find(p => p.program_id === id) : null;
                                        return (
                                            <Chip
                                                key={id}
                                                label={program?.program_name || id}
                                                size="small"
                                                color="primary"
                                                onDelete={() => setSelectedPrograms(prev => prev.filter(item => item !== id))}
                                            />
                                        );
                                    })}
                                    {selectedPrograms.length > 3 && (
                                        <Chip
                                            label={`+${selectedPrograms.length - 3} khác`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <Room color="primary" />
                            <Typography variant="subtitle1" fontWeight="600">
                                Chọn phòng học
                            </Typography>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Array.isArray(rooms) && selectedRooms.length === rooms.length && rooms.length > 0}
                                        indeterminate={selectedRooms.length > 0 && Array.isArray(rooms) && selectedRooms.length < rooms.length}
                                        onChange={handleSelectAll(rooms, selectedRooms, setSelectedRooms, 'room_id')}
                                    />
                                }
                                label="Chọn tất cả phòng"
                                sx={{ mb: 0 }}
                            />
                        </Paper>

                        <Box sx={{
                            maxHeight: 300,
                            overflow: 'auto',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                        }}>
                            {Array.isArray(rooms) && rooms.map((room) => (
                                <Box
                                    key={room.room_id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: selectedRooms.includes(room.room_id) ? 'primary.50' : 'transparent',
                                        '&:last-child': { borderBottom: 'none' },
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedRooms.includes(room.room_id)}
                                        onChange={() => setSelectedRooms(prev =>
                                            prev.includes(room.room_id)
                                                ? prev.filter(id => id !== room.room_id)
                                                : [...prev, room.room_id]
                                        )}
                                        sx={{ mr: 1.5 }}
                                    />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight="500" noWrap>
                                            {room.room_name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Mã: {room.room_id}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Loại: {room.type}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Sức chứa: {room.capacity}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {selectedRooms.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" fontWeight="medium" display="block" gutterBottom>
                                    Đã chọn: {selectedRooms.length} phòng
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selectedRooms.slice(0, 3).map(id => {
                                        const room = Array.isArray(rooms) ? rooms.find(r => r.room_id === id) : null;
                                        return (
                                            <Chip
                                                key={id}
                                                label={room?.room_name || id}
                                                size="small"
                                                color="primary"
                                                onDelete={() => setSelectedRooms(prev => prev.filter(item => item !== id))}
                                            />
                                        );
                                    })}
                                    {selectedRooms.length > 3 && (
                                        <Chip
                                            label={`+${selectedRooms.length - 3} khác`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <Person color="primary" />
                            <Typography variant="subtitle1" fontWeight="600">
                                Chọn giảng viên
                            </Typography>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Array.isArray(lecturers) && selectedLecturers.length === lecturers.length && lecturers.length > 0}
                                        indeterminate={selectedLecturers.length > 0 && Array.isArray(lecturers) && selectedLecturers.length < lecturers.length}
                                        onChange={handleSelectAll(lecturers, selectedLecturers, setSelectedLecturers, 'lecturer_id')}
                                    />
                                }
                                label="Chọn tất cả giảng viên"
                                sx={{ mb: 0 }}
                            />
                        </Paper>

                        <Box sx={{
                            maxHeight: 300,
                            overflow: 'auto',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                        }}>
                            {Array.isArray(lecturers) && lecturers.map((lecturer) => (
                                <Box
                                    key={lecturer.lecturer_id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: selectedLecturers.includes(lecturer.lecturer_id) ? 'primary.50' : 'transparent',
                                        '&:last-child': { borderBottom: 'none' },
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedLecturers.includes(lecturer.lecturer_id)}
                                        onChange={() => setSelectedLecturers(prev =>
                                            prev.includes(lecturer.lecturer_id)
                                                ? prev.filter(id => id !== lecturer.lecturer_id)
                                                : [...prev, lecturer.lecturer_id]
                                        )}
                                        sx={{ mr: 1.5 }}
                                    />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight="500" noWrap>
                                            {lecturer.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Mã: {lecturer.lecturer_id}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Số môn: {lecturer.subjects?.length || 0}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {selectedLecturers.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" fontWeight="medium" display="block" gutterBottom>
                                    Đã chọn: {selectedLecturers.length} giảng viên
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selectedLecturers.slice(0, 3).map(id => {
                                        const lecturer = Array.isArray(lecturers) ? lecturers.find(l => l.lecturer_id === id) : null;
                                        return (
                                            <Chip
                                                key={id}
                                                label={lecturer?.name || id}
                                                size="small"
                                                color="primary"
                                                onDelete={() => setSelectedLecturers(prev => prev.filter(item => item !== id))}
                                            />
                                        );
                                    })}
                                    {selectedLecturers.length > 3 && (
                                        <Chip
                                            label={`+${selectedLecturers.length - 3} khác`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            case 3:
                return (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                            <Class color="primary" />
                            <Typography variant="subtitle1" fontWeight="600">
                                Chọn lớp học
                            </Typography>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={Array.isArray(classes) && selectedClasses.length === classes.length && classes.length > 0}
                                        indeterminate={selectedClasses.length > 0 && Array.isArray(classes) && selectedClasses.length < classes.length}
                                        onChange={handleSelectAll(classes, selectedClasses, setSelectedClasses, 'class_id')}
                                    />
                                }
                                label="Chọn tất cả lớp"
                                sx={{ mb: 0 }}
                            />
                        </Paper>

                        <Box sx={{
                            maxHeight: 300,
                            overflow: 'auto',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                        }}>
                            {Array.isArray(classes) && classes.map((cls) => (
                                <Box
                                    key={cls.class_id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: selectedClasses.includes(cls.class_id) ? 'primary.50' : 'transparent',
                                        '&:last-child': { borderBottom: 'none' },
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedClasses.includes(cls.class_id)}
                                        onChange={() => setSelectedClasses(prev =>
                                            prev.includes(cls.class_id)
                                                ? prev.filter(id => id !== cls.class_id)
                                                : [...prev, cls.class_id]
                                        )}
                                        sx={{ mr: 1.5 }}
                                    />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight="500" noWrap>
                                            {cls.class_name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Mã: {cls.class_id}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Sĩ số: {cls.class_size}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Chương trình: {cls.program_id}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {selectedClasses.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" fontWeight="medium" display="block" gutterBottom>
                                    Đã chọn: {selectedClasses.length} lớp
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selectedClasses.slice(0, 3).map(id => {
                                        const cls = Array.isArray(classes) ? classes.find(c => c.class_id === id) : null;
                                        return (
                                            <Chip
                                                key={id}
                                                label={cls?.class_name || id}
                                                size="small"
                                                color="primary"
                                                onDelete={() => setSelectedClasses(prev => prev.filter(item => item !== id))}
                                            />
                                        );
                                    })}
                                    {selectedClasses.length > 3 && (
                                        <Chip
                                            label={`+${selectedClasses.length - 3} khác`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 2,
                    height: isMobile ? '100%' : 'auto',
                    maxHeight: isMobile ? '100%' : '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1,
                backgroundColor: 'primary.main',
                color: 'white'
            }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    Tạo lịch học tự động
                </Typography>
                <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 1 }}>
                <Stepper activeStep={activeStep} sx={{ my: 3, px: isMobile ? 0 : 2 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontSize: isMobile ? '0.7rem' : '0.875rem'
                                    }
                                }}
                            >
                                {isMobile ? label.substring(0, 3) + '.' : label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper elevation={0} sx={{ p: isMobile ? 1 : 2, minHeight: isMobile ? 300 : 400, border: '1px solid', borderColor: 'divider' }}>
                    {renderStepContent(activeStep)}
                </Paper>
            </DialogContent>

            <DialogActions sx={{
                px: 2,
                pb: 2,
                pt: 1,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 1 : 0
            }}>
                <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    startIcon={<NavigateBefore />}
                    variant="outlined"
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                >
                    Quay lại
                </Button>

                {!isMobile && <Box sx={{ flex: 1 }} />}

                {activeStep === steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={handleGenerate}
                        // disabled={!isStepValid(activeStep)}
                        color="success"
                        fullWidth={isMobile}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            fontWeight: 'bold',
                            boxShadow: 2
                        }}
                    >
                        Tạo lịch học
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStepValid(activeStep)}
                        endIcon={<NavigateNext />}
                        fullWidth={isMobile}
                        size={isMobile ? "small" : "medium"}
                    >
                        Tiếp theo
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}