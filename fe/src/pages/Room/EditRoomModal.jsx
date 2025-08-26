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
  Alert,
  CircularProgress,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  InputAdornment,
  Fade,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import {
  Close,
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
  Save,
  Notes
} from '@mui/icons-material';

const steps = ['Thông tin cơ bản', 'Thông tin bổ sung'];

const roomStatusOptions = [
  { value: 'active', label: 'Hoạt động', color: 'success', icon: <PlayArrow /> },
  { value: 'maintenance', label: 'Bảo trì', color: 'warning', icon: <Pause /> },
  { value: 'inactive', label: 'Không hoạt động', color: 'error', icon: <Stop /> }
];

// Bộ dữ liệu vị trí phòng học
const locationOptions = [
  { value: 'a_floor_1', label: 'Tầng 1', building: 'Tòa A' },
  { value: 'a_floor_2', label: 'Tầng 2', building: 'Tòa A' },
  { value: 'a_floor_3', label: 'Tầng 3', building: 'Tòa A' },
  { value: 'a_floor_4', label: 'Tầng 4', building: 'Tòa A' },
  { value: 'a_floor_5', label: 'Tầng 5', building: 'Tòa A' },
  { value: 'b_floor_1', label: 'Tầng 1', building: 'Tòa B' },
  { value: 'b_floor_2', label: 'Tầng 2', building: 'Tòa B' },
  { value: 'b_floor_3', label: 'Tầng 3', building: 'Tòa B' },
  { value: 'b_floor_4', label: 'Tầng 4', building: 'Tòa B' },
  { value: 'c_floor_1', label: 'Tầng 1', building: 'Tòa C' },
  { value: 'c_floor_2', label: 'Tầng 2', building: 'Tòa C' },
  { value: 'c_floor_3', label: 'Tầng 3', building: 'Tòa C' },
  { value: 'd_practice_area', label: 'Khu thực hành', building: 'Tòa D' },
  { value: 'e_lecture_hall', label: 'Khu giảng đường', building: 'Tòa E' },
  { value: 'f_conference_hall', label: 'Khu hội thảo', building: 'Tòa F' }
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

export default function EditRoomModal({
  open,
  onClose,
  onSave,
  roomData,
  existingRooms,
  error,
  loading,
  message
}) {
  const [editedRoom, setEditedRoom] = useState({
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
  const [currentBuilding, setCurrentBuilding] = useState(Object.keys(locationGroups)[0]);
  const [showCustomLocation, setShowCustomLocation] = useState(false);

  // Cập nhật dữ liệu khi roomData thay đổi
  useEffect(() => {
    console.log(editedRoom);

    if (roomData && open) {
      setEditedRoom({
        room_id: roomData.room_id || '',
        room_name: roomData.room_name || '',
        location: roomData.location || '',
        custom_location: roomData.custom_location || '',
        capacity: roomData.capacity || '',
        type: roomData.type || '',
        status: roomData.status || 'active',
        note: roomData.note || '',
      });

      // Xác định building hiện tại dựa trên location
      if (roomData.location) {
        const locationObj = locationOptions.find(loc => loc.value === roomData.location);
        if (locationObj) {
          setCurrentBuilding(locationObj.building);
        } else {
          setCurrentBuilding('custom');
        }
      }
    }
  }, [roomData, open]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRoom((prev) => ({ ...prev, [name]: value }));
    setLocalError({});
  };

  const handleBack = () => {
    setLocalError({});
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    // Sử dụng custom_location nếu có, ngược lại dùng location
    const finalLocation = editedRoom.custom_location || editedRoom.location;
    const roomToValidate = { ...editedRoom, location: finalLocation };

    const formErrors =
      (roomToValidate, existingRooms, true);

    setLocalError(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const roomToUpdate = {
        ...editedRoom,
        location: finalLocation,
        capacity: parseInt(editedRoom.capacity),
        updated_at: new Date().toISOString(),
      };

      // Xóa custom_location khỏi object trước khi gửi
      delete roomToUpdate.custom_location;

      await onSave(roomToUpdate);

      if (!error && !loading) {
        onClose();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật phòng học:", err);
      setLocalError({ submit: "Không thể cập nhật phòng học, vui lòng thử lại." });
    }
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
    const isSameLocation = editedRoom.location === locationValue;

    // Cập nhật giá trị location + label + building
    setEditedRoom({
      ...editedRoom,
      location: isSameLocation ? '' : selectedOption.value,
      location_label: isSameLocation ? '' : selectedOption.label,
      building: isSameLocation ? '' : selectedOption.building,
      custom_location: isSameLocation
        ? ''
        : `${selectedOption.label} - ${selectedOption.building}` // label - building
    });
  };

  // Hàm xử lý khi thay đổi giá trị custom location
  const handleCustomLocationChange = (event) => {
    setEditedRoom({
      ...editedRoom,
      custom_location: event.target.value,
      location: '',
    });

    setCurrentBuilding('custom');
  };

  // Xử lý thay đổi sức chứa từ toggle button
  const handleCapacityChange = (capacity) => {
    setEditedRoom({
      ...editedRoom,
      capacity: capacity
    });
  };

  // Xử lý thay đổi loại phòng từ toggle button
  const handleTypeChange = (type) => {
    setEditedRoom({
      ...editedRoom,
      type: type
    });
  };

  // Xử lý thay đổi trạng thái từ toggle button
  const handleStatusChange = (status) => {
    setEditedRoom({
      ...editedRoom,
      status: status
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
    <Dialog
      open={open}
      onClose={onClose} validateRoomField
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
            Chỉnh Sửa Phòng Học
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
                  value={editedRoom.room_id}
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
                  value={editedRoom.room_name}
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
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Vị trí phòng học
                </Typography>

                {/* Tabs cho các tòa nhà */}
                <Tabs
                  value={currentBuilding}
                  onChange={(e, newValue) => setCurrentBuilding(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    mb: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      minWidth: 'auto',
                      px: 1,
                      fontSize: '0.9rem',
                    },
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
                        elevation={editedRoom.location === location.value ? 2 : 0}
                        onClick={() => handleLocationSelect(location.value)}
                        sx={{
                          flex: 1,
                          p: 1,
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: editedRoom.location === location.value ? 'primary.main' : 'divider',
                          backgroundColor: editedRoom.location === location.value ? 'primary.light' : 'background.paper',
                          color: editedRoom.location === location.value ? 'primary.contrastText' : 'text.primary',
                          '&:hover': {
                            backgroundColor: editedRoom.location === location.value ? 'primary.light' : 'action.hover',
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
                    value={editedRoom.custom_location || ''}
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
                {(editedRoom.location || editedRoom.custom_location) && (
                  <Alert
                    severity="success"
                    icon={<LocationOn />}
                    sx={{ mt: 2 }}
                  >
                    Đã chọn: {editedRoom.custom_location || getLocationLabel(editedRoom.location)}
                  </Alert>
                )}
              </Box>
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
                    value={editedRoom.capacity}
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
                          fontWeight: editedRoom.capacity === capacity ? 'bold' : 'normal'
                        }}
                      >
                        {capacity}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>

                  <TextField
                    name="capacity"
                    type="number"
                    value={editedRoom.capacity}
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
                  value={editedRoom.type}
                  exclusive
                  onChange={(e, value) => value !== null && handleTypeChange(value)}
                  aria-label="loại phòng"
                  fullWidth
                >
                  <ToggleButton
                    value="practice"
                    sx={{
                      fontWeight: editedRoom.type === 'practice' ? 'bold' : 'normal'
                    }}
                  >
                    Phòng thực hành
                  </ToggleButton>
                  <ToggleButton
                    value="theory"
                    sx={{
                      fontWeight: editedRoom.type === 'theory' ? 'bold' : 'normal'
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
                  value={editedRoom.status}
                  exclusive
                  onChange={(e, value) => value !== null && handleStatusChange(value)}
                  aria-label="trạng thái phòng"
                  fullWidth
                >
                  {roomStatusOptions.map((option) => (
                    <>
                      <ToggleButton
                        key={option.value}
                        value={option.value}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontWeight: editedRoom.status === option.value ? 'bold' : 'normal',
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
                          variant={editedRoom.status === option.value ? "filled" : "outlined"}
                          sx={{
                            fontWeight: 'medium',
                            backgroundColor: editedRoom.status === option.value ? option.color + '.main' : 'transparent',
                            color: editedRoom.status === option.value ? option.color + '.contrastText' : 'inherit'
                          }}
                        />
                      </ToggleButton>
                    </>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* Ghi chú */}
              <TextField
                label="Ghi chú"
                name="note"
                value={editedRoom.note}
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
          {/* Có thể thêm nút xóa phòng học ở đây nếu cần */}
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
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật phòng học'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}