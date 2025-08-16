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
} from '@mui/material';
import {
  Close,
  CloudUpload,
  MeetingRoom, // Icon for room
  LocationOn,  // Icon for location
  AirlineSeatReclineExtra, // Icon for capacity
  Category,    // Icon for type
  Info,        // Icon for note
  CheckCircle,
  Error as ErrorIcon,
  PlayCircleFilled,
  PauseCircleFilled,
  Add, // For the Add button
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { processExcelDataRoom } from '../../utils/ExcelValidation'; // Assuming this utility is robust
import PreviewRoomModal from './PreviewRoomModal';

// Define options for room types and statuses
const roomTypeOptions = [
  { value: 'Lý thuyết', label: 'Lý thuyết' },
  { value: 'Thực hành', label: 'Thực hành' },
  { value: 'Phòng hội thảo', label: 'Phòng hội thảo' }, // Added as a potential option
];

const roomStatusOptions = [
  { value: 'Hoạt động', color: 'success', icon: <PlayCircleFilled />, db: 'active' },
  { value: 'Tạm ngưng', color: 'warning', icon: <PauseCircleFilled />, db: 'suspended' },
  { value: 'Ngưng hoạt động', color: 'error', icon: <PauseCircleFilled />, db: 'inactive' }
];

const steps = ['Thông tin cơ bản', 'Thông tin bổ sung'];

const AddRoomModal = ({ open, onClose, onAddRoom, existingRooms, apiError, loading, message, fetchRooms }) => {
  const [formData, setFormData] = useState({
    room_id: '',
    room_name: '',
    location: '',
    capacity: '',
    type: '',
    status: 'Hoạt động', // Default status
    note: '',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  // Effect to reset form/errors when modal opens/closes
  useEffect(() => {
    if (open) {
      setLocalError('');
      // apiError and message are handled by parent, so don't clear here.
    } else {
      resetForm();
    }
  }, [open]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.room_id || !formData.room_name || !formData.location) {
        setLocalError('Vui lòng điền đầy đủ thông tin cơ bản!');
        return;
      }
      const isDuplicate = existingRooms.some(
        (room) => room.room_id === formData.room_id
      );
      if (isDuplicate) {
        setLocalError(`Mã phòng học "${formData.room_id}" đã tồn tại!`);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(''); // Clear local error on input change
  };

  const validateRoom = () => {
    if (!formData.capacity || !formData.type || !formData.status) {
      setLocalError('Vui lòng điền đầy đủ thông tin bổ sung!');
      return false;
    }

    const capacity = parseInt(formData.capacity, 10);
    if (isNaN(capacity) || capacity <= 0) {
      setLocalError('Sức chứa phải là số nguyên dương!');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateRoom()) {
      return;
    }

    // Chuyển trạng thái sang tiếng Anh trước khi lưu
    const statusObj = roomStatusOptions.find(opt => opt.value === formData.status);
    const dbStatus = statusObj ? statusObj.db : 'active';

    const roomToAdd = {
      ...formData,
      status: dbStatus,
      capacity: parseInt(formData.capacity, 10),
      id: Date.now(), // Ensure a unique ID for new entries
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // The onAddRoom function from parent should handle setting loading and message/error
    await onAddRoom(roomToAdd);

    // If onAddRoom is successful and `loading` becomes false (after API call completes),
    // and there is no `apiError`, then reset the form and close.
    // This assumes `onAddRoom` updates `loading` and `apiError` props.
    // We might need to check the outcome directly if `onAddRoom` doesn't provide it
    // or rely on `useEffect` to react to `message` or `apiError` changes.
    // For now, let's assume parent handles closing on success.
    // If not, you might need a local success state.
    if (!apiError && !loading) { // This check might be tricky if `onAddRoom` is async and doesn't update props immediately
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      room_id: '',
      room_name: '',
      location: '',
      capacity: '',
      type: '',
      status: 'Hoạt động',
      note: '',
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
      const dataRows = rawData.slice(1);

      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      const processedData = processExcelDataRoom(jsonData, existingRooms);

      if (processedData.length === 0) {
        setLocalError('Không có dữ liệu hợp lệ nào trong file Excel');
        e.target.value = '';
        setFileUploaded(false);
        return;
      }

      setPreviewData(processedData);
      setShowPreview(true);
      onClose();

    } catch (error) {
      console.error('Error reading Excel file:', error);
      setLocalError('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại');
      setFileUploaded(false);
    } finally {
      e.target.value = '';
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewData([]);
    // After preview, if no rooms were added, you might want to re-open AddRoomModal
    // or handle success/error messages at a higher level.
    // For now, we just close the preview.
    fetchRooms(); // Re-fetch rooms to update the list after potential additions from preview
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
            <MeetingRoom sx={{ fontSize: 28, mr: 2 }} />
            <Typography variant="h6" fontWeight="600">
              Thêm Phòng Học
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
                  label="Mã phòng học"
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MeetingRoom color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Tên phòng học"
                  name="room_name"
                  value={formData.room_name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MeetingRoom color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Vị trí"
                  name="location"
                  placeholder="Ví dụ: Tầng 2, Tòa A"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
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
                <TextField
                  label="Sức chứa"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AirlineSeatReclineExtra color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth required>
                  <InputLabel>Loại phòng học</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Loại phòng học"
                    disabled={loading}
                    startAdornment={
                      <InputAdornment position="start">
                        <Category color="action" />
                      </InputAdornment>
                    }
                  >
                    {roomTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth required sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Trạng thái"
                    disabled={loading}
                    startAdornment={
                      <InputAdornment position="start">
                        <Info color="action" />
                      </InputAdornment>
                    }
                  >
                    {roomStatusOptions.map((option) => (
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
                <TextField
                  fullWidth
                  label="Ghi chú"
                  name="note"
                  multiline
                  rows={2}
                  value={formData.note}
                  onChange={handleChange}
                  variant="outlined"
                  disabled={loading}
                  sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Info color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
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
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
              >
                {loading ? 'Đang thêm...' : 'Thêm phòng học'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* Preview Modal for Excel Import */}
      <PreviewRoomModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        fetchRooms={fetchRooms} // Pass fetchRooms to refresh list after import
      // You might need to pass onAddRoom or a specific import function here
      // depending on how PreviewRoomModal is designed to confirm adding.
      />
    </>
  );
};

export default AddRoomModal;