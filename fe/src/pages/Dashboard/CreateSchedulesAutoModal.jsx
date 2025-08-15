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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Paper,
    Chip,
    IconButton
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

const steps = ['Chọn chương trình', 'Chọn phòng học', 'Chọn giảng viên', 'Chọn lớp học'];

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
    const [activeStep, setActiveStep] = useState(0);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedLecturers, setSelectedLecturers] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);

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

    const handleProgramChange = (programId) => {
        setSelectedPrograms(prev =>
            prev.includes(programId)
                ? prev.filter(id => id !== programId)
                : [...prev, programId]
        );
    };

    const handleRoomChange = (roomId) => {
        setSelectedRooms(prev =>
            prev.includes(roomId)
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId]
        );
    };

    const handleLecturerChange = (lecturerId) => {
        setSelectedLecturers(prev =>
            prev.includes(lecturerId)
                ? prev.filter(id => id !== lecturerId)
                : [...prev, lecturerId]
        );
    };

    const handleClassChange = (classId) => {
        setSelectedClasses(prev =>
            prev.includes(classId)
                ? prev.filter(id => id !== classId)
                : [...prev, classId]
        );
    };

    const handleGenerate = () => {
        const selections = {
            programs: selectedPrograms,
            rooms: selectedRooms,
            lecturers: selectedLecturers,
            classes: selectedClasses
        };

        console.log('Selected data:', selections);

        // Update parent component's formTest with selected data
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

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <School color="primary" />
                            Chọn chương trình học
                        </Typography>
                        <FormControl component="fieldset" fullWidth>
                            <FormGroup>
                                {programs.map((program) => (
                                    <FormControlLabel
                                        key={program.program_id}
                                        control={
                                            <Checkbox
                                                checked={selectedPrograms.includes(program.program_id)}
                                                onChange={() => handleProgramChange(program.program_id)}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="body1">{program.program_name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Mã chương trình: {program.program_id} | Thời gian: {program.duration}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        {selectedPrograms.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Đã chọn {selectedPrograms.length} chương trình:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedPrograms.map(id => {
                                        const program = programs.find(p => p.program_id === id);
                                        return (
                                            <Chip
                                                key={id}
                                                label={program?.program_name || id}
                                                size="small"
                                                color="primary"
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Room color="primary" />
                            Chọn phòng học
                        </Typography>
                        <FormControl component="fieldset" fullWidth>
                            <FormGroup >
                                {rooms.map((room) => (
                                    <FormControlLabel
                                        key={room.room_id}
                                        control={
                                            <Checkbox
                                                checked={selectedRooms.includes(room.room_id)}
                                                onChange={() => handleRoomChange(room.room_id)}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="body1">{room.room_name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Mã phòng học: {room.room_id} | Loại: {room.type} | Sức chứa: {room.capacity}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        {selectedRooms.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Đã chọn {selectedRooms.length} phòng:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedRooms.map(id => {
                                        const room = rooms.find(r => r.room_id === id);
                                        return (
                                            <Chip
                                                key={id}
                                                label={room?.room_name || id}
                                                size="small"
                                                color="primary"
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person color="primary" />
                            Chọn giảng viên
                        </Typography>
                        <FormControl component="fieldset" fullWidth>
                            <FormGroup>
                                {lecturers.map((lecturer) => (
                                    <FormControlLabel
                                        key={lecturer.lecturer_id}
                                        control={
                                            <Checkbox
                                                checked={selectedLecturers.includes(lecturer.lecturer_id)}
                                                onChange={() => handleLecturerChange(lecturer.lecturer_id)}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="body1">{lecturer.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Mã giảng viên: {lecturer.lecturer_id} | Môn: {lecturer.subjects?.length || 0} môn
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        {selectedLecturers.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Đã chọn {selectedLecturers.length} giảng viên:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedLecturers.map(id => {
                                        const lecturer = lecturers.find(l => l.lecturer_id === id);
                                        return (
                                            <Chip
                                                key={id}
                                                label={lecturer?.name || id}
                                                size="small"
                                                color="primary"
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            case 3:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Class color="primary" />
                            Chọn lớp học
                        </Typography>
                        <FormControl component="fieldset" fullWidth>
                            <FormGroup>
                                {classes.map((cls) => (
                                    <FormControlLabel
                                        key={cls.class_id}
                                        control={
                                            <Checkbox
                                                checked={selectedClasses.includes(cls.class_id)}
                                                onChange={() => handleClassChange(cls.class_id)}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography variant="body1">{cls.class_name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Mã lớp học: {cls.class_id} | Sĩ số: {cls.class_size} | Mã Chương trình: {cls.program_id}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                        {selectedClasses.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Đã chọn {selectedClasses.length} lớp:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {selectedClasses.map(id => {
                                        const cls = classes.find(c => c.class_id === id);
                                        return (
                                            <Chip
                                                key={id}
                                                label={cls?.class_name || id}
                                                size="small"
                                                color="primary"
                                            />
                                        );
                                    })}
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
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h5" component="div">
                    Tạo lịch học tự động
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper elevation={1} sx={{ p: 3, minHeight: 300 }}>
                    {renderStepContent(activeStep)}
                </Paper>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    startIcon={<NavigateBefore />}
                >
                    Quay lại
                </Button>

                <Box sx={{ flex: 1 }} />

                {activeStep === steps.length - 1 ? (
                    <Button
                        variant="contained"
                        onClick={handleGenerate}
                        disabled={!isStepValid(activeStep)}
                        color="success"
                    >
                        Tạo lịch học
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStepValid(activeStep)}
                        endIcon={<NavigateNext />}
                    >
                        Tiếp theo
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
