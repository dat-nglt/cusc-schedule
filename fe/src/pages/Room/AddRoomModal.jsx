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
  Avatar,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  InputAdornment,
  Fade,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Close,
  CloudUpload,
  MeetingRoom,
  LocationOn,
  AirlineSeatReclineExtra,
  Category,
  Info,
  CheckCircle,
  Error as ErrorIcon,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Notes
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import PreviewRoomModal from './PreviewRoomModal';
import { processExcelDataRoom } from '../../utils/ExcelValidation';
import { generateRoomId } from '../../utils/generateLecturerId';
import { validateRoomField } from '../../utils/addValidation';

const steps = ['Thông tin cơ bản', 'Thông tin bổ sung'];

const roomTypeOptions = [
  { value: 'theory', label: 'Lý thuyết' },
  { value: 'practice', label: 'Thực hành' },
  { value: 'lab', label: 'Phòng lab' },
  { value: 'conference', label: 'Hội nghị' }
];

const roomStatusOptions = [
  { value: 'active', label: 'Hoạt động', color: 'success', icon: <PlayArrow /> },
  { value: 'maintenance', label: 'Bảo trì', color: 'warning', icon: <Pause /> },
  { value: 'inactive', label: 'Không hoạt động', color: 'error', icon: <Stop /> }
];

// Bộ dữ liệu vị trí phòng học
const locationOptions = [
  { value: 'tầng_1', label: 'Tầng 1', building: 'Tòa A' },
  { value: 'tầng_2', label: 'Tầng 2', building: 'Tòa A' },
  { value: 'tầng_3', label: 'Tầng 3', building: 'Tòa A' },
  { value: 'tầng_4', label: 'Tầng 4', building: 'Tòa A' },
  { value: 'tầng_5', label: 'Tầng 5', building: 'Tòa A' },
  { value: 'tầng_1_b', label: 'Tầng 1', building: 'Tòa B' },
  { value: 'tầng_2_b', label: 'Tầng 2', building: 'Tòa B' },
  { value: 'tầng_3_b', label: 'Tầng 3', building: 'Tòa B' },
  { value: 'tầng_4_b', label: 'Tầng 4', building: 'Tòa B' },
  { value: 'tầng_1_c', label: 'Tầng 1', building: 'Tòa C' },
  { value: 'tầng_2_c', label: 'Tầng 2', building: 'Tòa C' },
  { value: 'tầng_3_c', label: 'Tầng 3', building: 'Tòa C' },
  { value: 'khu_thực_hành', label: 'Khu thực hành', building: 'Tòa D' },
  { value: 'khu_giảng_đường', label: 'Khu giảng đường', building: 'Tòa E' },
  { value: 'khu_hội_thảo', label: 'Khu hội thảo', building: 'Tòa F' }
];

// Nhóm vị trí theo tòa nhà
const locationGroups = {
  'Tòa A': locationOptions.filter(loc => loc.building === 'Tòa A'),
  'Tòa B': locationOptions.filter(loc => loc.building === 'Tòa B'),
  'Tòa C': locationOptions.filter(loc => loc.building === 'Tòa C'),
  'Khu chức năng': locationOptions.filter(loc =>
    ['Tòa D', 'Tòa E', 'Tòa F'].includes(loc.building)
  )
};

export default function AddRoomModal({ open, onClose, onAddRoom, existingRooms, error, loading, message, fetchRooms }) {
  const [newRoom, setNewRoom] = useState({
    room_id: '',
    room_name: '',
    location: '',
    custom_location: '',
    capacity: '',
    type: '',
    status: 'active',
    note: '',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState(Object.keys(locationGroups)[0]);

  const handleNext = () => {
    // let hasError = false;
    // let errors = {};

    // if (activeStep === 0) {
    //   const step1Fields = ["room_id", "room_name", "location"];
    //   const allErrors = validateRoomField(newRoom, existingRooms);

    //   step1Fields.forEach((field) => {
    //     if (allErrors[field]) {
    //       errors[field] = allErrors[field];
    //       hasError = true;
    //     }
    //   });
    // }

    // setLocalError(errors);

    // if (!hasError) {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
    setLocalError({});
  };

  const handleBack = () => {
    setLocalError({});
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (open) {
      const roomID = generateRoomId();
      setNewRoom((prev) => ({ ...prev, room_id: roomID }));
      setShowCustomLocation(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    // Sử dụng custom_location nếu có, ngược lại dùng location
    const finalLocation = newRoom.custom_location || newRoom.location;
    const roomToValidate = { ...newRoom, location: finalLocation };

    const formErrors = validateRoomField(roomToValidate, existingRooms);

    setLocalError(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const roomToAdd = {
        ...newRoom,
        location: finalLocation,
        capacity: parseInt(newRoom.capacity),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Xóa custom_location khỏi object trước khi gửi
      delete roomToAdd.custom_location;

      console.log(roomToAdd);


      await onAddRoom(roomToAdd);

      if (!error && !loading) {
        resetForm();
        onClose();
      }
    } catch (err) {
      console.error("Lỗi khi thêm phòng học:", err);
      setLocalError({ submit: "Không thể thêm phòng học, vui lòng thử lại." });
    }
  };

  const resetForm = () => {
    setNewRoom({
      room_id: '',
      room_name: '',
      location: '',
      custom_location: '',
      capacity: '',
      type: '',
      status: 'active',
      note: '',
    });
    setActiveStep(0);
    setLocalError({});
    setFileUploaded(false);
    setShowCustomLocation(false);
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

      const processedData = processExcelDataRoom(jsonData, existingRooms);
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

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewData([]);
    setFileUploaded(false);
  };

  // Hàm xử lý khi chọn một vị trí từ danh sách
  const handleLocationSelect = (locationValue) => {
    // Tìm option tương ứng theo value
    const selectedOption = locationOptions.find(
      (option) => option.value === locationValue
    );

    if (!selectedOption) return; // Nếu không tìm thấy thì thoát luôn

    // Nếu đang ở chế độ custom location, tắt nó đi
    if (showCustomLocation) {
      setShowCustomLocation(false);
    }

    // Nếu chọn lại cùng 1 location thì reset
    const isSameLocation = newRoom.location === locationValue;

    // Cập nhật giá trị location + label + building
    setNewRoom({
      ...newRoom,
      location: isSameLocation ? '' : selectedOption.value,
      location_label: isSameLocation ? '' : selectedOption.label,
      building: isSameLocation ? '' : selectedOption.building,
      custom_location: isSameLocation
        ? ''
        : `${selectedOption.label} - ${selectedOption.building}` // label - building
    });
  };



  // Hàm xử lý khi bật/tắt chế độ nhập vị trí tùy chỉnh
  const handleCustomLocationToggle = (event) => {
    const isChecked = event.target.checked;
    setShowCustomLocation(isChecked);

    if (isChecked) {
      // Khi bật chế độ custom, reset location đã chọn trước đó
      setNewRoom({
        ...newRoom,
        location: '',
        custom_location: newRoom.custom_location || ''
      });
    } else {
      // Khi tắt chế độ custom, giữ nguyên location đã chọn hoặc reset cả hai
      setNewRoom({
        ...newRoom,
        custom_location: ''
      });
    }
  };

  // Xử lý thay đổi sức chứa từ toggle button
  const handleCapacityChange = (capacity) => {
    setNewRoom({
      ...newRoom,
      capacity: capacity
    });
  };

  // Xử lý thay đổi loại phòng từ toggle button
  const handleTypeChange = (type) => {
    setNewRoom({
      ...newRoom,
      type: type
    });
  };

  // Xử lý thay đổi trạng thái từ toggle button
  const handleStatusChange = (status) => {
    setNewRoom({
      ...newRoom,
      status: status
    });
  };

  // Hàm xử lý khi thay đổi giá trị custom location
  const handleCustomLocationChange = (event) => {
    setNewRoom({
      ...newRoom,
      custom_location: event.target.value
    });
  };

  // Hàm lấy nhãn hiển thị cho vị trí đã chọn
  const getLocationLabel = (locationValue) => {
    for (const building of Object.values(locationGroups)) {
      for (const location of building) {
        if (location.value === locationValue) {
          return location.label;
        }
      }
    }
    return locationValue;
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
            maxHeight: '90vh',
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
            <MeetingRoom sx={{ fontSize: 28, mr: 2 }} />
            <Typography variant="h6" fontWeight="600">
              Thêm Phòng Học Mới
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
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}>
                <Box
                  sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}
                >
                  <TextField
                    label="Mã phòng học"
                    name="room_id"
                    value={newRoom.room_id}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    required
                    InputProps={{
                      readOnly: true,
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
                    value={newRoom.room_name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MeetingRoom color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <InputLabel>Vị trí phòng học</InputLabel>
                <FormControl fullWidth required>
                  <Box>
                    {/* Tabs cho các tòa nhà */}
                    <Tabs
                      value={currentBuilding}
                      onChange={(e, newValue) => setCurrentBuilding(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        mb: 1,
                        '& .MuiTab-root': {
                          minWidth: 'auto',
                          px: 1,
                          fontSize: '0.8rem'
                        }
                      }}
                    >
                      {Object.keys(locationGroups).map((building) => (
                        <Tab key={building} label={building} value={building} />
                      ))}
                      <Tab label="Khác" value="custom" />
                    </Tabs>

                    {/* Nội dung cho tab được chọn */}
                    {currentBuilding !== 'custom' ? (
                      <Box sx={{
                        display: 'flex',
                        maxHeight: '200px',
                        overflow: 'auto',
                        gap: 1,
                      }}>
                        {locationGroups[currentBuilding]?.map((location) => (
                          <Paper
                            key={location.value}
                            elevation={newRoom.location === location.value ? 2 : 0}
                            onClick={() => handleLocationSelect(location.value)}
                            sx={{
                              flex: 1,
                              p: 1,
                              textAlign: 'center',
                              cursor: 'pointer',
                              border: '1px solid',
                              borderColor: newRoom.location === location.value ? 'primary.main' : 'divider',
                              backgroundColor: newRoom.location === location.value ? 'primary.light' : 'background.paper',
                              color: newRoom.location === location.value ? 'primary.contrastText' : 'text.primary',
                              '&:hover': {
                                backgroundColor: newRoom.location === location.value ? 'primary.light' : 'action.hover',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Typography variant="body2">{location.label}</Typography>
                          </Paper>
                        ))}
                      </Box>
                    ) : (
                      <TextField
                        label="Nhập vị trí tùy chỉnh"
                        value={newRoom.custom_location || ''}
                        onChange={handleCustomLocationChange}
                        fullWidth
                        required
                        sx={{ mt: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}

                    {/* Hiển thị vị trí đã chọn */}
                    {(newRoom.location || newRoom.custom_location) && (
                      <Alert
                        severity="success"
                        icon={<LocationOn />}
                        sx={{ mt: 2 }}
                      >
                        Đã chọn: {newRoom.custom_location || getLocationLabel(newRoom.location)}
                      </Alert>
                    )}
                  </Box>
                </FormControl>
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Sức chứa với toggle buttons */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AirlineSeatReclineExtra fontSize="small" />
                    Sức chứa
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ToggleButtonGroup
                      value={newRoom.capacity}
                      exclusive
                      onChange={(e, value) => value !== null && handleCapacityChange(value)}
                      aria-label="sức chứa"
                    >
                      {[20, 25, 30, 35, 40, 45, 50, 55, 60].map((capacity) => (
                        <ToggleButton
                          key={capacity}
                          value={capacity}
                          sx={{
                            minWidth: '60px',
                            py: 1,
                            fontWeight: newRoom.capacity === capacity ? 'bold' : 'normal'
                          }}
                        >
                          {capacity}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>

                    <TextField
                      name="capacity"
                      type="number"
                      value={newRoom.capacity}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      required
                      sx={{
                        width: '100px',
                        flex: 1,

                      }}
                      inputProps={{
                        min: 1,
                        style: { textAlign: 'center' }
                      }}
                    />
                  </Box>
                </Box>

                {/* Loại phòng với toggle buttons */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Category fontSize="small" />
                    Loại phòng
                  </Typography>
                  <ToggleButtonGroup
                    value={newRoom.type}
                    exclusive
                    onChange={(e, value) => value !== null && handleTypeChange(value)}
                    aria-label="loại phòng"
                    fullWidth
                  >
                    <ToggleButton
                      value="practice"
                      sx={{
                        fontWeight: newRoom.type === 'practice' ? 'bold' : 'normal'
                      }}
                    >
                      Phòng thực hành
                    </ToggleButton>
                    <ToggleButton
                      value="theory"
                      sx={{
                        fontWeight: newRoom.type === 'theory' ? 'bold' : 'normal'
                      }}
                    >
                      Phòng lý thuyết
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Trạng thái */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info fontSize="small" />
                    Trạng thái
                  </Typography>
                  <ToggleButtonGroup
                    value={newRoom.status}
                    exclusive
                    onChange={(e, value) => value !== null && handleStatusChange(value)}
                    aria-label="trạng thái phòng"
                    fullWidth
                  >
                    {roomStatusOptions.map((option) => (
                      <ToggleButton
                        key={option.value}
                        value={option.value}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontWeight: newRoom.status === option.value ? 'bold' : 'normal',
                          borderColor: option.color + '.main',
                          '&.Mui-selected': {
                            backgroundColor: option.color + '.light',
                            color: option.color + '.dark',
                            '&:hover': {
                              backgroundColor: option.color + '.light',
                            }
                          }
                        }}
                      >
                        {option.icon}
                        <Chip
                          label={option.label}
                          size="small"
                          color={option.color}
                          variant={newRoom.status === option.value ? "filled" : "outlined"}
                          sx={{
                            fontWeight: 'medium',
                            backgroundColor: newRoom.status === option.value ? option.color + '.main' : 'transparent',
                            color: newRoom.status === option.value ? option.color + '.contrastText' : 'inherit'
                          }}
                        />
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
                {/* Ghi chú */}
                <TextField
                  label="Ghi chú"
                  name="note"
                  value={newRoom.note}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={1}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Notes fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
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
                {loading ? 'Đang xử lý...' : 'Thêm phòng học'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      <PreviewRoomModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        fetchRooms={fetchRooms}
      />
    </>
  );
}