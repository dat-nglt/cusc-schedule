import React, { useState } from 'react';
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
  Paper,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  School, // Changed from Class to School for consistency with Course
  Class, // This will be for Class Name
  Group, // Icon for Class Size
  PlaylistAddCheck,
  CheckCircle,
  Error as ErrorIcon,
  PlayCircleFilled,
  PauseCircleFilled,
  Add,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewClassModal from './PreviewClassModal';

const statusOptions = [
  { value: 'Hoạt động', color: 'success', icon: <PlayCircleFilled />, db: 'active' },
  { value: 'Tạm ngưng', color: 'warning', icon: <PauseCircleFilled />, db: 'suspended' },
  { value: 'Ngưng hoạt động', color: 'error', icon: <PauseCircleFilled />, db: 'inactive' }
];

const steps = ['Thông tin cơ bản', 'Khóa học và trạng thái'];

export default function AddClassModal({
  open,
  onClose,
  onAddClass,
  onImportSuccess,
  existingClasses,
  existingCourses,
  existingPrograms,
  error: apiError, // Renamed 'error' prop to 'apiError' for clarity
  loading,
  message,
}) {
  const [newClass, setNewClass] = useState({
    class_id: '',
    class_name: '',
    class_size: '',
    status: 'Hoạt động',
    course_id: '',
    program_id: '',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState(''); // Renamed 'error' state to 'localError'
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false); // New state for file upload feedback

  const handleNext = () => {
    if (activeStep === 0) {
      if (!newClass.class_id || !newClass.class_name || !newClass.class_size) {
        setLocalError('Vui lòng điền đầy đủ thông tin cơ bản');
        return;
      }
      const classSize = parseInt(newClass.class_size, 10);
      if (isNaN(classSize) || classSize <= 0) {
        setLocalError('Sĩ số phải là số nguyên dương!');
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
    setNewClass((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleCourseChange = (event, newValue) => {
    setNewClass((prev) => ({ ...prev, course_id: newValue ? newValue.course_id : '' }));
    setLocalError('');
  };

  const handleProgramChange = (e) => {
    const { value } = e.target;
    setNewClass((prev) => ({ ...prev, program_id: value }));
    setLocalError('');
  };

  const validateClassData = (classItem) => {
    const errors = [];
    if (!classItem.class_id || !classItem.class_name || !classItem.class_size || !classItem.course_id || !classItem.program_id) {
      errors.push('missing_required');
    }

    const classSize = parseInt(classItem.class_size, 10);
    if (isNaN(classSize) || classSize <= 0) {
      errors.push('invalid_size');
    }

    if (!statusOptions.some(opt => opt.value === classItem.status)) {
      errors.push('invalid_status');
    }

    // Check if course_id exists in existingCourses (for import validation)
    if (classItem.course_id && !(existingCourses || []).some(course => course.course_id === classItem.course_id)) {
      errors.push('invalid_course_id');
    }

    // Check if program_id exists in existingPrograms (for import validation)
    if (classItem.program_id && !(existingPrograms || []).some(program => program.program_id === classItem.program_id)) {
      errors.push('invalid_program_id');
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!newClass.course_id) {
      setLocalError('Vui lòng chọn khóa học');
      return;
    }

    if (!newClass.program_id) {
      setLocalError('Vui lòng chọn chương trình');
      return;
    }

    const validationErrors = validateClassData(newClass);
    if (validationErrors.length > 0) {
      if (validationErrors.includes('missing_required')) {
        setLocalError('Vui lòng điền đầy đủ thông tin');
      } else if (validationErrors.includes('invalid_size')) {
        setLocalError('Sĩ số phải là số nguyên dương!');
      } else if (validationErrors.includes('invalid_status')) {
        setLocalError('Trạng thái không hợp lệ');
      } else if (validationErrors.includes('invalid_course_id')) {
        setLocalError('Mã khóa học không tồn tại!');
      } else if (validationErrors.includes('invalid_program_id')) {
        setLocalError('Mã chương trình không tồn tại!');
      }
      return;
    }

    const isDuplicate = (existingClasses || []).some(
      (classItem) => classItem.class_id === newClass.class_id
    );
    if (isDuplicate) {
      setLocalError(`Mã lớp học "${newClass.class_id}" đã tồn tại!`);
      return;
    }

    // Chuyển trạng thái sang tiếng Anh trước khi lưu
    const statusObj = statusOptions.find(opt => opt.value === newClass.status);
    const dbStatus = statusObj ? statusObj.db : 'active';

    const classToAdd = {
      ...newClass,
      status: dbStatus,
      class_size: parseInt(newClass.class_size, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await onAddClass(classToAdd);

    if (!apiError && !loading) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setNewClass({
      class_id: '',
      class_name: '',
      class_size: '',
      status: 'Hoạt động',
      course_id: '',
      program_id: '',
    });
    setActiveStep(0);
    setLocalError('');
    setFileUploaded(false);
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLocalError('Vui lòng chọn một file Excel!');
      return;
    }

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setLocalError('Chỉ hỗ trợ file Excel (.xlsx, .xls)!');
      e.target.value = '';
      return;
    }

    try {
      setLocalError('');
      setFileUploaded(true);

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawData.length < 2) {
        setLocalError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

      const headers = rawData[0];
      const expectedHeader = ['Mã lớp học', 'Tên lớp học', 'Sĩ số', 'Trạng thái', 'Mã khóa học', 'Mã chương trình'];

      const lowerCaseHeaders = headers.map(h => String(h).toLowerCase().trim());
      const lowerCaseExpectedHeader = expectedHeader.map(h => String(h).toLowerCase().trim());

      if (!lowerCaseExpectedHeader.every(expectedH => lowerCaseHeaders.includes(expectedH))) {
        setLocalError(`Định dạng cột không đúng! Cần các cột: ${expectedHeader.join(', ')}`);
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

      const dataRows = rawData.slice(1);

      // Step 1: Map rows to objects
      const classObjects = dataRows.map((row, index) => {
        const obj = {};
        headers.forEach((header, idx) => {
          obj[String(header).trim()] = row[idx] || '';
        });
        return {
          class_id: obj['Mã lớp học'] || '',
          class_name: obj['Tên lớp học'] || '',
          class_size: obj['Sĩ số'] || '',
          status: obj['Trạng thái'] || 'Hoạt động',
          course_id: obj['Mã khóa học'] || '',
          program_id: obj['Mã chương trình'] || '',
          rowIndex: index + 2,
        };
      });

      // Step 2: Add errors and duplicate checks
      const processedData = classObjects.map((classItem, index, arr) => {
        const validationErrors = validateClassData(classItem);

        const isDuplicateExisting = (existingClasses || []).some(c => c.class_id === classItem.class_id);
        if (isDuplicateExisting) {
          validationErrors.push('Mã lớp học đã tồn tại');
        }

        const isDuplicateInPreview = arr.slice(0, index).some(c => c.class_id === classItem.class_id);
        if (isDuplicateInPreview) {
          validationErrors.push('duplicate_id_in_file');
        }

        return { ...classItem, errors: validationErrors };
      });

      // Luôn hiển thị PreviewClassModal, kể cả khi không có dòng hợp lệ
      setPreviewData(processedData);
      setShowPreview(true);

    } catch (error) {
      console.error('Error reading Excel file:', error);
      setLocalError('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại');
      setFileUploaded(false);
    } finally {
      e.target.value = '';
    }
  };

  const handleImportSuccess = (result) => {
    if (result.imported && result.imported.length > 0) {
      onImportSuccess();
    }
    setShowPreview(false);
    setPreviewData([]);
    setFileUploaded(false);
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
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #115293 100%)',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Box display="flex" alignItems="center">
            <Class sx={{ fontSize: 28, mr: 2 }} />
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
            {(apiError || localError) && (
              <Fade in={!!(apiError || localError)}>
                <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
                  {apiError || localError}
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
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3,
                }}
              >
                <TextField
                  label="Mã lớp học"
                  name="class_id"
                  value={newClass.class_id}
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
                  label="Tên lớp học"
                  name="class_name"
                  value={newClass.class_name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaylistAddCheck color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Sĩ số"
                  name="class_size"
                  type="number"
                  value={newClass.class_size}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    inputProps: { min: 1 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Group color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3,
                }}
              >
                <Autocomplete
                  options={existingCourses || []}
                  getOptionLabel={(option) => option.course_id || ''}
                  value={existingCourses?.find((c) => c.course_id === newClass.course_id) || null}
                  onChange={handleCourseChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mã khóa học"
                      name="course_id"
                      variant="outlined"
                      required
                      fullWidth
                      disabled={loading}
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
                  freeSolo
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option.course_id} - {option.course_name}
                    </li>
                  )}
                />
                <FormControl fullWidth required>
                  <InputLabel>Mã chương trình</InputLabel>
                  <Select
                    name="program_id"
                    value={newClass.program_id}
                    onChange={handleProgramChange}
                    label="Mã chương trình"
                    disabled={loading}
                    startAdornment={
                      <InputAdornment position="start">
                        <School color="action" />
                      </InputAdornment>
                    }
                  >
                    {existingPrograms && existingPrograms.map((program) => (
                      <MenuItem key={program.program_id} value={program.program_id}>
                        {program.program_id} - {program.program_name}
                      </MenuItem>
                    ))}
                    {!existingPrograms || existingPrograms.length === 0 ? (
                      <MenuItem disabled>
                        <em>Không có chương trình</em>
                      </MenuItem>
                    ) : null
                    }
                  </Select>
                </FormControl>
                <FormControl fullWidth required sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={newClass.status}
                    onChange={handleChange}
                    label="Trạng thái"
                    disabled={loading}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box display="flex" alignItems="center">
                          {option.icon}
                          <Chip
                            label={option.value}
                            size="small"
                            color={option.color}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #eee',
          }}
        >
          <Box>
            {activeStep === 0 && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudUpload />}
                component="label"
                disabled={loading}
              >
                Nhập từ Excel
                <input
                  type="file"
                  hidden
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  disabled={loading}
                />
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined" disabled={loading}>
                Quay lại
              </Button>
            )}

            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} variant="contained" color="primary" disabled={loading}>
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
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
}