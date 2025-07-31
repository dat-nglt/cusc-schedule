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
  Paper
} from '@mui/material';
import {
  Close,
  CloudUpload,
  School,
  Class,
  DateRange,
  PlaylistAddCheck,
  CheckCircle,
  Error as ErrorIcon,
  PlayCircleFilled,
  PauseCircleFilled,
  Add
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewCourseModal from './PreviewCourseModal';

const statusOptions = [
  { value: 'Hoạt động', color: 'success', icon: <PlayCircleFilled /> },
  { value: 'Ngừng hoạt động', color: 'error', icon: <PauseCircleFilled /> }
];

const steps = ['Thông tin cơ bản', 'Thời gian và trạng thái'];

export default function AddCourseModal({ 
  open, 
  onClose, 
  onAddCourse, 
  onImportSuccess, 
  existingCourses, 
  error: apiError, 
  loading, 
  message 
}) {
  const [newCourse, setNewCourse] = useState({
    course_id: '',
    course_name: '',
    start_date: '',
    end_date: '',
    status: 'Hoạt động',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!newCourse.course_id || !newCourse.course_name) {
        setLocalError('Vui lòng điền đầy đủ thông tin cơ bản');
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
    setNewCourse((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const validateCourseData = (course) => {
    const errors = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxFutureDate = new Date(today);
    maxFutureDate.setFullYear(today.getFullYear() + 5);

    if (!course.course_id || !course.course_name || !course.start_date || !course.end_date) {
      errors.push('missing_required');
    }

    const startDate = new Date(course.start_date);
    const endDate = new Date(course.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      errors.push('invalid_date_format');
    } else {
      if (startDate > endDate) {
        errors.push('start_after_end');
      }
      if (endDate > maxFutureDate) {
        errors.push('end_too_far_future');
      }
    }

    if (!statusOptions.some(opt => opt.value === course.status)) {
      errors.push('invalid_status');
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!newCourse.start_date || !newCourse.end_date) {
      setLocalError('Vui lòng điền đầy đủ thông tin thời gian');
      return;
    }

    const validationErrors = validateCourseData(newCourse);
    if (validationErrors.length > 0) {
      if (validationErrors.includes('missing_required')) {
        setLocalError('Vui lòng điền đầy đủ thông tin');
      } else if (validationErrors.includes('invalid_date_format') || validationErrors.includes('start_after_end') || validationErrors.includes('end_too_far_future')) {
        setLocalError('Ngày không hợp lệ. Vui lòng kiểm tra lại');
      } else if (validationErrors.includes('invalid_status')) {
        setLocalError('Trạng thái không hợp lệ');
      }
      return;
    }

    const isDuplicate = existingCourses.some(
      (course) => course.course_id === newCourse.course_id
    );
    if (isDuplicate) {
      setLocalError(`Mã khóa học "${newCourse.course_id}" đã tồn tại`);
      return;
    }

    const courseToAdd = {
      ...newCourse,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await onAddCourse(courseToAdd);
    
    if (!apiError && !loading) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setNewCourse({
      course_id: '',
      course_name: '',
      start_date: '',
      end_date: '',
      status: 'Hoạt động',
    });
    setActiveStep(0);
    setLocalError('');
    setFileUploaded(false);
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLocalError('Vui lòng chọn một file Excel');
      return;
    }

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setLocalError('Chỉ hỗ trợ file Excel (.xlsx, .xls)');
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
        setLocalError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)');
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

      const headers = rawData[0];
      const expectedHeader = ['Mã khóa học', 'Tên khóa học', 'Thời gian bắt đầu', 'Thời gian kết thúc', 'Trạng thái'];

      const lowerCaseHeaders = headers.map(h => String(h).toLowerCase().trim());
      const lowerCaseExpectedHeader = expectedHeader.map(h => String(h).toLowerCase().trim());

      if (!lowerCaseExpectedHeader.every(expectedH => lowerCaseHeaders.includes(expectedH))) {
        setLocalError(`Định dạng cột không đúng! Cần các cột: ${expectedHeader.join(', ')}`);
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

      const dataRows = rawData.slice(1);
      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[String(header).trim()] = row[index] || '';
        });
        return obj;
      });

      const processedData = jsonData.map((row, index) => {
        const course = {
          course_id: row['Mã khóa học'] || '',
          course_name: row['Tên khóa học'] || '',
          start_date: row['Thời gian bắt đầu'] ? new Date(row['Thời gian bắt đầu']).toISOString().split('T')[0] : '',
          end_date: row['Thời gian kết thúc'] ? new Date(row['Thời gian kết thúc']).toISOString().split('T')[0] : '',
          status: row['Trạng thái'] || 'Hoạt động',
          rowIndex: index + 2,
          errors: [],
        };

        const validationErrors = validateCourseData(course);
        const isDuplicateExisting = existingCourses.some(c => c.course_id === course.course_id);
        if (isDuplicateExisting) {
          validationErrors.push('duplicate_id_existing');
        }

        const isDuplicateInPreview = processedData.slice(0, index).some(c => c.course_id === course.course_id);
        if (isDuplicateInPreview) {
          validationErrors.push('duplicate_id_in_file');
        }

        return { ...course, errors: validationErrors };
      });

      const validPreviewData = processedData.filter(item => item.errors.length === 0);

      if (validPreviewData.length === 0) {
        setLocalError('Không có dữ liệu hợp lệ nào trong file Excel');
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

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
              Thêm Khóa Học Mới
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
                <Alert 
                  severity="error" 
                  icon={<ErrorIcon />}
                  sx={{ mb: 2 }}
                >
                  {apiError || localError}
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
                  label="Mã khóa học"
                  name="course_id"
                  value={newCourse.course_id}
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
                <TextField
                  label="Tên khóa học"
                  name="course_name"
                  value={newCourse.course_name}
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
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3 
              }}>
                <TextField
                  label="Ngày bắt đầu"
                  name="start_date"
                  type="date"
                  value={newCourse.start_date}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Ngày kết thúc"
                  name="end_date"
                  type="date"
                  value={newCourse.end_date}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth required sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={newCourse.status}
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
                {loading ? 'Đang xử lý...' : 'Thêm khóa học'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <PreviewCourseModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
}