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
    Paper,
    Checkbox,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    FormGroup,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid
} from '@mui/material';
import {
    Close,
    CloudUpload,
    School,
    Class,
    Schedule,
    CheckCircle,
    Error as ErrorIcon,
    PlayCircleFilled,
    PauseCircleFilled,
    StopCircle,
    DoneAll,
    ExpandMore,
    Subject
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewProgramModal from './PreviewProgramModal';
import { processExcelDataProgram } from '../../utils/ExcelValidation';

const statusOptions = [
    { value: 'Đang triển khai', color: 'info', icon: <PlayCircleFilled /> },
    { value: 'Đang áp dụng', color: 'success', icon: <DoneAll /> },
    { value: 'Tạm dừng', color: 'warning', icon: <PauseCircleFilled /> },
    { value: 'Đã kết thúc', color: 'error', icon: <StopCircle /> }
];

const steps = ['Thông tin cơ bản', 'Chọn học kỳ', 'Phân bổ môn học'];

export default function AddProgramModal({
    open,
    onClose,
    onAddProgram,
    existingPrograms,
    error,
    loading,
    message,
    fetchPrograms,
    semesters, // Dữ liệu học kỳ từ database
    subjects // Dữ liệu môn học từ database
}) {
    const [newProgram, setNewProgram] = useState({
        program_id: '',
        program_name: '',
        status: 'active', // Mặc định là 'active'
        selected_semesters: [], // Mảng chứa ID của các học kỳ được chọn
        semester_subjects: {} // Đối tượng chứa môn học cho từng học kỳ { semesterId: [subjectIds] }
    });

    const [activeStep, setActiveStep] = useState(0);
    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState([]); // Môn học chưa được chọn

    // Cập nhật danh sách môn học khả dụng khi có thay đổi
    useEffect(() => {
        if (subjects && newProgram.semester_subjects) {
            const allSelectedSubjects = Object.values(newProgram.semester_subjects).flat();
            const available = subjects.filter(subject =>
                !allSelectedSubjects.includes(subject.subject_id)
            );
            setAvailableSubjects(available);
        }
    }, [subjects, newProgram.semester_subjects]);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!newProgram.program_id || !newProgram.program_name) {
                setLocalError('Vui lòng điền đầy đủ thông tin cơ bản');
                return;
            }

            // Kiểm tra trùng mã chương trình
            const isDuplicate = existingPrograms.some(
                (program) => program.program_id === newProgram.program_id
            );
            if (isDuplicate) {
                setLocalError(`Mã chương trình "${newProgram.program_id}" đã tồn tại`);
                return;
            }
        }

        if (activeStep === 1) {
            if (newProgram.selected_semesters.length === 0) {
                setLocalError('Vui lòng chọn ít nhất một học kỳ');
                return;
            }

            // Khởi tạo cấu trúc dữ liệu cho môn học theo học kỳ
            const initialSemesterSubjects = {};
            newProgram.selected_semesters.forEach(semesterId => {
                initialSemesterSubjects[semesterId] = [];
            });

            setNewProgram(prev => ({
                ...prev,
                semester_subjects: initialSemesterSubjects
            }));
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
        setNewProgram((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    // Xử lý chọn học kỳ
    const handleSemesterSelection = (semesterId) => {
        setNewProgram(prev => {
            const isSelected = prev.selected_semesters.includes(semesterId);

            if (isSelected) {
                // Nếu bỏ chọn học kỳ, xóa cả môn học đã chọn cho học kỳ đó
                const updatedSemesterSubjects = { ...prev.semester_subjects };
                delete updatedSemesterSubjects[semesterId];

                return {
                    ...prev,
                    selected_semesters: prev.selected_semesters.filter(id => id !== semesterId),
                    semester_subjects: updatedSemesterSubjects
                };
            } else {
                return {
                    ...prev,
                    selected_semesters: [...prev.selected_semesters, semesterId],
                    semester_subjects: {
                        ...prev.semester_subjects,
                        [semesterId]: [] // Khởi tạo mảng môn học trống cho học kỳ mới
                    }
                };
            }
        });
    };

    // Xử lý chọn môn học cho từng học kỳ
    const handleSubjectSelection = (semesterId, subjectId) => {
        setNewProgram(prev => {
            const currentSubjects = prev.semester_subjects[semesterId] || [];
            const isSelected = currentSubjects.includes(subjectId);

            let updatedSubjects;
            if (isSelected) {
                // Bỏ chọn môn học
                updatedSubjects = currentSubjects.filter(id => id !== subjectId);
            } else {
                // Chọn môn học
                updatedSubjects = [...currentSubjects, subjectId];
            }

            return {
                ...prev,
                semester_subjects: {
                    ...prev.semester_subjects,
                    [semesterId]: updatedSubjects
                }
            };
        });
    };

    const handleSubmit = async () => {
        // Kiểm tra xem mỗi học kỳ đã có ít nhất một môn học chưa
        const hasEmptySemester = Object.values(newProgram.semester_subjects)
            .some(subjects => subjects.length === 0);

        if (hasEmptySemester) {
            setLocalError('Mỗi học kỳ phải có ít nhất một môn học');
            return;
        }

        // Chuyển trạng thái sang tiếng Anh trước khi lưu
        const statusObj = statusOptions.find(opt => opt.value === newProgram.status);
        const dbStatus = statusObj ? statusObj.db : 'active';

        const programToAdd = {
            program_id: newProgram.program_id,
            program_name: newProgram.program_name,
            status: newProgram.status,
            semesters: newProgram.selected_semesters.map(semesterId => {
                const semester = semesters.find(s => s.semester_id === semesterId);
                return {
                    semester_id: semesterId,
                    semester_name: semester.semester_name,
                    subjects: newProgram.semester_subjects[semesterId].map(subjectId => {
                        const subject = subjects.find(s => s.subject_id === subjectId);
                        return {
                            subject_id: subjectId,
                            subject_name: subject.subject_name,
                            // Có thể thêm các thông tin khác của môn học nếu cần
                        };
                    })
                };
            }),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        await onAddProgram(programToAdd);

        if (!error && !loading) {
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setNewProgram({
            program_id: '',
            program_name: '',
            status: 'Đang triển khai',
            selected_semesters: [],
            semester_subjects: {}
        });
        setActiveStep(0);
        setLocalError('');
        setFileUploaded(false);
    };

    // Hàm xử lý import Excel (giữ nguyên từ code gốc)
    const handleImportExcel = async (e) => {
        // ... (giữ nguyên như code gốc)
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
                            Thêm Chương Trình Đào Tạo
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
                                    value={newProgram.program_id}
                                    onChange={handleChange}
                                    fullWidth
                                    variant="outlined"
                                    required
                                    disabled={loading}
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
                                    value={newProgram.program_name}
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
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Chọn học kỳ cho chương trình
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Lựa chọn các học kỳ cần thiết để hoàn thành chương trình đào tạo
                                </Typography>

                                <FormGroup>
                                    <Grid container spacing={2}>
                                        {semesters && semesters.map(semester => (
                                            <Grid item xs={12} sm={6} key={semester.semester_id}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={newProgram.selected_semesters.includes(semester.semester_id)}
                                                            onChange={() => handleSemesterSelection(semester.semester_id)}
                                                            name={semester.semester_name}
                                                        />
                                                    }
                                                    label={semester.semester_name}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </FormGroup>
                            </Box>
                        )}

                        {activeStep === 2 && (
                            <Box sx={{ maxHeight: 500, overflowY: 'scroll' }}>
                                <Typography variant="h6" gutterBottom>
                                    Phân bổ môn học cho từng học kỳ
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Chọn môn học cho từng học kỳ. Mỗi môn học chỉ có thể được chọn cho một học kỳ.
                                </Typography>

                                {newProgram.selected_semesters.map(semesterId => {
                                    const semester = semesters.find(s => s.semester_id === semesterId);
                                    const selectedSubjects = newProgram.semester_subjects[semesterId] || [];

                                    return (
                                        <Accordion key={semesterId} defaultExpanded sx={{ mb: 2 }}>
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant="subtitle1">
                                                    {semester.semester_name}
                                                    <Chip
                                                        label={`${selectedSubjects.length} môn`}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                                    Chọn môn học cho học kỳ {semester.semester_name}:
                                                </Typography>

                                                <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                                                    {subjects.map(subject => {
                                                        const isSelected = selectedSubjects.includes(subject.subject_id);
                                                        const isAvailable = availableSubjects.some(s => s.subject_id === subject.subject_id);
                                                        const showSubject = isSelected || isAvailable;

                                                        return (
                                                            <Fade
                                                                in={showSubject}
                                                                timeout={300}
                                                                key={subject.subject_id}
                                                                unmountOnExit
                                                            >
                                                                <ListItem
                                                                    disablePadding
                                                                    sx={{
                                                                        transition: 'all 0.3s ease',
                                                                        opacity: isSelected ? 1 : 0.8,
                                                                        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                                                                        borderRadius: 1,
                                                                        mb: 0.5,
                                                                        '&:hover': {
                                                                            backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <ListItemIcon>
                                                                        <Checkbox
                                                                            edge="start"
                                                                            checked={isSelected}
                                                                            tabIndex={-1}
                                                                            disableRipple
                                                                            onChange={() => handleSubjectSelection(semesterId, subject.subject_id)}
                                                                            disabled={!isSelected && !isAvailable}
                                                                            color="primary"
                                                                            sx={{
                                                                                px: 3,
                                                                                transition: 'transform 0.2s ease',
                                                                                '&:hover': {
                                                                                    transform: 'scale(1.1)'
                                                                                }
                                                                            }}
                                                                        />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Box sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                transition: 'all 0.3s ease'
                                                                            }}>
                                                                                <Subject sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    sx={{
                                                                                        fontWeight: isSelected ? 600 : 400,
                                                                                        color: isSelected ? 'primary.main' : 'text.primary'
                                                                                    }}
                                                                                >
                                                                                    {subject.subject_name}
                                                                                </Typography>
                                                                            </Box>
                                                                        }
                                                                        secondary={
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    color: isSelected ? 'primary.dark' : 'text.secondary',
                                                                                    transition: 'color 0.3s ease'
                                                                                }}
                                                                            >
                                                                                {subject.subject_id}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                    {!isAvailable && !isSelected && (
                                                                        <Chip
                                                                            label="Đã chọn ở học kỳ khác"
                                                                            size="small"
                                                                            color="default"
                                                                            variant="outlined"
                                                                            sx={{ ml: 1, fontSize: '0.7rem' }}
                                                                        />
                                                                    )}
                                                                </ListItem>
                                                            </Fade>
                                                        );
                                                    })}
                                                </List>

                                                {selectedSubjects.length > 0 && (
                                                    <Fade in={selectedSubjects.length > 0}>
                                                        <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                                                            <Typography variant="body2" sx={{ color: 'success.contrastText', display: 'flex', alignItems: 'center' }}>
                                                                <CheckCircle sx={{ fontSize: 18, mr: 1 }} />
                                                                Đã chọn {selectedSubjects.length} môn học cho học kỳ này
                                                            </Typography>
                                                        </Box>
                                                    </Fade>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
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
                                {loading ? 'Đang xử lý...' : 'Thêm chương trình'}
                            </Button>
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            <PreviewProgramModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                fetchPrograms={fetchPrograms}
            />
        </>
    );
}