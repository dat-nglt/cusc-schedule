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
  Autocomplete,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Fade,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  Close,
  School,
  Group,
  PlaylistAddCheck,
  CheckCircle,
  Error as ErrorIcon,
  PlayCircleFilled,
  PauseCircleFilled,
  Save,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import { validateClass } from '../../utils/addValidation';

const steps = ['Thông tin cơ bản', 'Khóa học và trạng thái'];
const statusOptions = [
  { value: 'active', label: 'Đang mở', color: 'success', icon: <PlayCircleFilled /> },
  { value: 'inactive', label: 'Đã kết thúc', color: 'error', icon: <PauseCircleFilled /> },
];
const commonClassSizes = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export default function EditClassModal({
  open,
  onClose,
  onEditClass,
  classItem,
  existingClasses,
  existingCourses,
  existingPrograms,
  error,
  loading,
  message
}) {
  const [editedClass, setEditedClass] = useState({
    class_id: '',
    class_name: '',
    class_size: '',
    status: 'active',
    course_id: '',
    program_id: '',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState({});
  

  useEffect(() => {
    if (open && classItem) {
      setEditedClass({
        class_id: classItem.class_id || '',
        class_name: classItem.class_name || '',
        class_size: classItem.class_size?.toString() || '',
        status: classItem.status || 'active',
        course_id: classItem.course_id || '',
        program_id: classItem.program_id || '',
      });
      setActiveStep(0);
      setLocalError({});
    }
  }, [open, classItem]);

  const handleNext = () => {
    let hasError = false;
    let errors = {};

    if (activeStep === 0) {
      const step1Fields = ["class_name", "class_size"];
      const allErrors = validateClass(editedClass, existingClasses, "step0");

      step1Fields.forEach((field) => {
        if (allErrors[field]) {
          errors[field] = allErrors[field];
          hasError = true;
        }
      });
    } else if (activeStep === 1) {
      const step2Fields = ["course_id", "program_id"];
      const allErrors = validateClass(editedClass, existingClasses, "step1");

      step2Fields.forEach((field) => {
        if (allErrors[field]) {
          errors[field] = allErrors[field];
          hasError = true;
        }
      });
    }

    setLocalError(errors);

    if (!hasError) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClass((prev) => ({ ...prev, [name]: value }));
    setLocalError({});
  };

  const handleBack = () => {
    setLocalError({});
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    // For editing, we exclude the current class from the existing classes list
    const otherClasses = existingClasses.filter(cls => cls.class_id !== editedClass.class_id);
    const formErrors = validateClass(editedClass, otherClasses);
    setLocalError(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const classToUpdate = {
        ...editedClass,
        class_size: parseInt(editedClass.class_size, 10),
        updated_at: new Date().toISOString(),
      };

      await onEditClass(classToUpdate);

      if (!error && !loading) {
        onClose();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật lớp học:", err);
      setLocalError({ submit: "Không thể cập nhật lớp học, vui lòng thử lại." });
    }
  };

  const handleClassSizeChange = (value) => {
    setEditedClass((prev) => ({ ...prev, class_size: value }));
    setLocalError({});
  };

  const incrementClassSize = () => {
    const current = parseInt(editedClass.class_size) || 0;
    handleClassSizeChange(Math.min(current + 5, 100).toString());
  };

  const decrementClassSize = () => {
    const current = parseInt(editedClass.class_size) || 0;
    handleClassSizeChange(Math.max(current - 5, 0).toString());
  };

  const handleStatusChange = (status) => {
    setEditedClass((prev) => ({ ...prev, status }));
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
            Chỉnh Sửa Lớp Học
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
          {error && (
            <Fade in={!!error}>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {Object.keys(localError).length > 0 && (
            <Fade in={Object.keys(localError).length > 0}>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                <ul>
                  {Object.values(localError).map((err, index) => (
                    typeof err === 'string' && <li key={index}>{err}</li>
                  ))}
                </ul>
              </Alert>
            </Fade>
          )}

          {message && (
            <Fade in={!!message}>
              <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
                {message}
              </Alert>
            </Fade>
          )}
        </Box>

        <Box sx={{ p: 3 }}>
          {activeStep === 0 && (
            <>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3
              }}>
                <TextField
                  label="Mã lớp học"
                  name="class_id"
                  value={editedClass.class_id}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Tên lớp học"
                  name="class_name"
                  value={editedClass.class_name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaylistAddCheck color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Chọn một trong các giá trị phổ biến hoặc nhập thủ công
                </Typography>

                {/* Nút chọn nhanh các giá trị phổ biến */}
                <Box
                  sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: 1 }}
                >
                  <ToggleButtonGroup
                    value={editedClass.class_size}
                    exclusive
                    onChange={(e, newValue) => {
                      if (newValue !== null) {
                        handleClassSizeChange(newValue);
                      }
                    }}
                    aria-label="sĩ số lớp"
                    sx={{ mb: 2, gap: 1, flex: 1, alignContent: 'center' }}
                  >
                    {commonClassSizes.map((size) => (
                      <ToggleButton
                        key={size}
                        value={size.toString()}
                        aria-label={`${size} học viên`}
                        sx={{
                          minWidth: 50,
                          height: 50,
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: 'divider',
                          fontWeight: 'medium',
                          '&.Mui-selected': {
                            backgroundColor: 'secondary.main',
                            color: 'secondary.contrastText',
                            fontWeight: 'bold',
                            '&:hover': {
                              backgroundColor: 'secondary.dark',
                            }
                          },
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        {size}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>

                  {/* TextField với các nút tăng/giảm */}
                  <TextField
                    label="Sĩ số lớp"
                    name="class_size"
                    type="number"
                    value={editedClass.class_size}
                    onChange={(e) => handleClassSizeChange(e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                    sx={{
                      flex: 1,
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1,
                        max: 100,
                        step: 1
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <Group color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={decrementClassSize}
                            size="small"
                            disabled={!editedClass.class_size || parseInt(editedClass.class_size) <= 1}
                          >
                            <KeyboardArrowDown />
                          </IconButton>
                          <IconButton
                            onClick={incrementClassSize}
                            size="small"
                            disabled={parseInt(editedClass.class_size) >= 100}
                          >
                            <KeyboardArrowUp />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </>
          )}

          {activeStep === 1 && (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3
            }}>
              <Autocomplete
                options={existingCourses || []}
                getOptionLabel={(option) => `${option.course_id} - ${option.course_name}`}
                value={existingCourses?.find(course => course.course_id === editedClass.course_id) || null}
                onChange={(event, newValue) => {
                  setEditedClass(prev => ({
                    ...prev,
                    course_id: newValue ? newValue.course_id : ''
                  }));
                  setLocalError({});
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Khóa học"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <School color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                options={existingPrograms || []}
                getOptionLabel={(option) => `${option.program_id} - ${option.program_name}`}
                value={existingPrograms?.find(program => program.program_id === editedClass.program_id) || null}
                onChange={(event, newValue) => {
                  setEditedClass(prev => ({
                    ...prev,
                    program_id: newValue ? newValue.program_id : ''
                  }));
                  setLocalError({});
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chương trình đào tạo"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <School color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{ mb: 2 }}
              />

              <Box sx={{ gridColumn: '1 / -1', mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Trạng thái lớp học
                </Typography>
                <ToggleButtonGroup
                  value={editedClass.status}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue !== null) {
                      handleStatusChange(newValue);
                    }
                  }}
                  aria-label="trạng thái lớp học"
                  fullWidth
                >
                  {statusOptions.map((option) => (
                    <ToggleButton
                      key={option.value}
                      value={option.value}
                      sx={{
                        py: 1.5,
                        '&.Mui-selected': {
                          backgroundColor: `${option.color}.main`,
                          color: `${option.color}.contrastText`,
                          '&:hover': {
                            backgroundColor: `${option.color}.dark`,
                          }
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: '1px solid #eee'
      }}>
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
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật lớp học'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}