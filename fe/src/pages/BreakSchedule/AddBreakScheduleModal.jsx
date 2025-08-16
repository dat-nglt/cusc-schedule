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
  Event,
  EventAvailable,
  EventBusy,
  CalendarToday,
  CheckCircle,
  Error as ErrorIcon,
  Warning
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewBreakScheduleModal from './PreviewBreakScheduleModal';

const statusOptions = [
  { value: 'Hoạt động', color: 'success', icon: <EventAvailable />, db: 'active' },
  { value: 'Ngừng hoạt động', color: 'error', icon: <EventBusy />, db: 'inactive' }
];

const steps = ['Thông tin cơ bản', 'Thời gian hoạt động'];

export default function AddBreakScheduleModal({ 
  open, 
  onClose, 
  onAddBreakSchedule, 
  onImportSuccess, 
  existingBreakSchedules, 
  loading, 
  error: apiError, 
  message: apiMessage 
}) {
  const [newBreakSchedule, setNewBreakSchedule] = useState({
    break_id: '',
    break_type: '',
    break_start_date: '',
    break_end_date: '',
    status: 'Hoạt động',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!newBreakSchedule.break_id || !newBreakSchedule.break_type) {
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
    setNewBreakSchedule((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async () => {
    if (!newBreakSchedule.break_start_date || !newBreakSchedule.break_end_date) {
      setLocalError('Vui lòng điền đầy đủ thông tin thời gian');
      return;
    }

    const startDate = new Date(newBreakSchedule.break_start_date);
    const endDate = new Date(newBreakSchedule.break_end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxFutureDate = new Date(today);
    maxFutureDate.setFullYear(today.getFullYear() + 5);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setLocalError('Định dạng ngày không hợp lệ');
      return;
    }

    if (startDate > endDate) {
      setLocalError('Thời gian bắt đầu không được sau thời gian kết thúc');
      return;
    }

    if (startDate < today) {
      setLocalError('Thời gian bắt đầu không được ở quá khứ');
      return;
    }

    if (endDate > maxFutureDate) {
      setLocalError('Thời gian kết thúc không được quá 5 năm trong tương lai');
      return;
    }

    const isDuplicate = existingBreakSchedules.some(
      (schedule) => schedule.break_id === newBreakSchedule.break_id
    );
    if (isDuplicate) {
      setLocalError(`Mã lịch nghỉ "${newBreakSchedule.break_id}" đã tồn tại`);
      return;
    }

    // Chuyển trạng thái sang tiếng Anh trước khi lưu
    const statusObj = statusOptions.find(opt => opt.value === newBreakSchedule.status);
    const dbStatus = statusObj ? statusObj.db : 'active';

    const scheduleToAdd = {
      ...newBreakSchedule,
      status: dbStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await onAddBreakSchedule(scheduleToAdd);
    
    if (!apiError && !loading) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setNewBreakSchedule({
      break_id: '',
      break_type: '',
      break_start_date: '',
      break_end_date: '',
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
      const expectedHeader = ['Mã lịch nghỉ', 'Loại lịch nghỉ', 'Thời gian bắt đầu', 'Thời gian kết thúc', 'Trạng thái'];

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
        const schedule = {
          break_id: row['Mã lịch nghỉ'] || '',
          break_type: row['Loại lịch nghỉ'] || '',
          break_start_date: row['Thời gian bắt đầu'] ? new Date(row['Thời gian bắt đầu']).toISOString().split('T')[0] : '',
          break_end_date: row['Thời gian kết thúc'] ? new Date(row['Thời gian kết thúc']).toISOString().split('T')[0] : '',
          status: row['Trạng thái'] || 'Hoạt động',
          rowIndex: index + 2,
          errors: [],
        };

        if (!schedule.break_id || !schedule.break_type || !schedule.break_start_date || !schedule.break_end_date) {
          schedule.errors.push('missing_required');
        }

        const startDate = new Date(schedule.break_start_date);
        const endDate = new Date(schedule.break_end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          schedule.errors.push('invalid_date_format');
        } else {
          if (startDate > endDate) {
            schedule.errors.push('start_after_end');
          }
          if (startDate < today) {
            schedule.errors.push('start_in_past');
          }
          if (endDate > maxFutureDate) {
            schedule.errors.push('end_too_far_future');
          }
        }

        if (!statusOptions.some(opt => opt.value === schedule.status)) {
          schedule.errors.push('invalid_status');
        }

        const isDuplicateExisting = existingBreakSchedules.some(s => s.break_id === schedule.break_id);
        if (isDuplicateExisting) {
          schedule.errors.push('duplicate_id_existing');
        }

        const isDuplicateInPreview = processedData.slice(0, index).some(s => s.break_id === schedule.break_id);
        if (isDuplicateInPreview) {
          schedule.errors.push('duplicate_id_in_file');
        }

        return schedule;
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

  const handleImportSuccessCallback = (result) => {
    onImportSuccess();
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
            <Event sx={{ fontSize: 28, mr: 2 }} />
            <Typography variant="h6" fontWeight="600">
              Thêm Lịch Nghỉ Mới
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
            {apiMessage && (
              <Fade in={!!apiMessage}>
                <Alert 
                  severity="success" 
                  icon={<CheckCircle />}
                  sx={{ mb: 2 }}
                >
                  {apiMessage}
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
                  label="Mã lịch nghỉ"
                  name="break_id"
                  value={newBreakSchedule.break_id}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Loại lịch nghỉ"
                  name="break_type"
                  value={newBreakSchedule.break_type}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
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
                  label="Thời gian bắt đầu"
                  name="break_start_date"
                  type="date"
                  value={newBreakSchedule.break_start_date}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Thời gian kết thúc"
                  name="break_end_date"
                  type="date"
                  value={newBreakSchedule.break_end_date}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth required sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={newBreakSchedule.status}
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
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Đang xử lý...' : 'Thêm lịch nghỉ'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <PreviewBreakScheduleModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        onImportSuccess={handleImportSuccessCallback}
        existingBreakSchedules={existingBreakSchedules}
        onAddBreakSchedule={onAddBreakSchedule}
      />
    </>
  );
}