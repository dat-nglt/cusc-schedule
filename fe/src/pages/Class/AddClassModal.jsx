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
  Autocomplete,
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
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  Close,
  CloudUpload,
  School,
  Group,
  PlaylistAddCheck,
  CheckCircle,
  Error as ErrorIcon,
  PlayCircleFilled,
  PauseCircleFilled,
  Add,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewClassModal from './PreviewClassModal';
import { processExcelDataClass } from '../../utils/ExcelValidation';
import { generateClassId } from '../../utils/generateLecturerId';
import { validateClass } from '../../utils/addValidation';

const steps = ['Thông tin cơ bản', 'Khóa học và trạng thái'];
const statusOptions = [
  { value: 'active', label: 'Hoạt động', color: 'success', icon: <PlayCircleFilled /> },
  { value: 'inactive', label: 'Ngừng hoạt động', color: 'error', icon: <PauseCircleFilled /> },
];
const commonClassSizes = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export default function AddClassModal({
  open,
  onClose,
  onAddClass,
  existingClasses,
  existingCourses,
  existingPrograms,
  error,
  loading,
  message,
  fetchClasses
}) {
  const [newClass, setNewClass] = useState({
    class_id: '',
    class_name: '',
    class_size: '',
    status: 'active',
    course_id: '',
    program_id: '',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleNext = () => {
    let hasError = false;
    let errors = {};

    if (activeStep === 0) {
      const step1Fields = ["class_id", "class_name", "class_size"];
      const allErrors = validateClass(newClass, existingClasses, "step0");

      step1Fields.forEach((field) => {
        if (allErrors[field]) {
          errors[field] = allErrors[field];
          hasError = true;
        }
      });
    } else if (activeStep === 1) {
      const step2Fields = ["course_id", "program_id"];
      const allErrors = validateClass(newClass, existingClasses, "step1");

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
    setNewClass((prev) => ({ ...prev, [name]: value }));
    setLocalError({});
  };

  const handleBack = () => {
    setLocalError({});
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (open) {
      const classID = generateClassId();
      setNewClass((prev) => ({ ...prev, class_id: classID }));
    }
  }, [open]);

  const handleSubmit = async () => {
    const formErrors = validateClass(newClass, existingClasses);
    setLocalError(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const classToAdd = {
        ...newClass,
        class_size: parseInt(newClass.class_size, 10),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await onAddClass(classToAdd);

      if (!error && !loading) {
        resetForm();
        onClose();
      }
    } catch (err) {
      console.error("Lỗi khi thêm lớp học:", err);
      setLocalError({ submit: "Không thể thêm lớp học, vui lòng thử lại." });
    }
  };

  const resetForm = () => {
    setNewClass({
      class_id: '',
      class_name: '',
      class_size: '',
      status: 'active',
      course_id: '',
      program_id: '',
    });
    setActiveStep(0);
    setLocalError({});
    setFileUploaded(false);
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLocalError({ file: 'Vui lòng chọn một file Excel' });
      return;
    }

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setLocalError({ file: 'Chỉ hỗ trợ file Excel (.xlsx, .xls)' });
      e.target.value = '';
      return;
    }

    try {
      setLocalError({});
      setFileUploaded(true);

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawData.length < 2) {
        setLocalError({ file: 'File Excel phải có ít nhất 2 dòng (header + dữ liệu)' });
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      const processedData = processExcelDataClass(
        jsonData,
        existingClasses,
        existingCourses,
        existingPrograms
      );

      onClose();

      if (processedData.length === 0) {
        setLocalError({ file: 'Không có dữ liệu hợp lệ nào trong file Excel' });
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

      setPreviewData(processedData);
      setShowPreview(true);

    } catch (error) {
      console.error('Error reading Excel file:', error);
      setLocalError({ file: 'Lỗi khi đọc file Excel. Vui lòng kiểm tra lại' });
      setFileUploaded(false);
    } finally {
      e.target.value = '';
    }
  };

  const handleClassSizeChange = (value) => {
    setNewClass((prev) => ({ ...prev, class_size: value }));
    setLocalError({});
  };

  const incrementClassSize = () => {
    const current = parseInt(newClass.class_size) || 0;
    handleClassSizeChange(Math.min(current + 5, 100).toString());
  };

  const decrementClassSize = () => {
    const current = parseInt(newClass.class_size) || 0;
    handleClassSizeChange(Math.max(current - 5, 0).toString());
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
              Thêm Lớp Học Mới
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
                    value={newClass.class_id}
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
                    value={newClass.class_name}
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
                      value={newClass.class_size}
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
                      value={newClass.class_size}
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
                              disabled={!newClass.class_size || parseInt(newClass.class_size) <= 1}
                            >
                              <KeyboardArrowDown />
                            </IconButton>
                            <IconButton
                              onClick={incrementClassSize}
                              size="small"
                              disabled={parseInt(newClass.class_size) >= 100}
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
                  value={existingCourses?.find(course => course.course_id === newClass.course_id) || null}
                  onChange={(event, newValue) => {
                    setNewClass(prev => ({
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
                  value={existingPrograms?.find(program => program.program_id === newClass.program_id) || null}
                  onChange={(event, newValue) => {
                    setNewClass(prev => ({
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
            {activeStep === 0 && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudUpload />}
                component="label"
              >
                Nhập từ Excel
                <input
                  type="file"
                  hidden
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                />
              </Button>
            )}
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
                startIcon={loading ? <CircularProgress size={20} /> : <Add />}
              >
                {loading ? 'Đang xử lý...' : 'Thêm lớp học'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <PreviewClassModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        fetchClasses={fetchClasses}
        existingCourses={existingCourses}
        existingPrograms={existingPrograms}
      />
    </>
  );
}