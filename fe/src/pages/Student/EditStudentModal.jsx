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
  Fade
} from '@mui/material';
import {
  Close,
  Badge as BadgeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Transgender as GenderIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Class as ClassIcon,
  School as SchoolIcon,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';

const statusOptions = [
  { value: 'Đang học', color: 'success', db: 'studying' },
  { value: 'Tạm nghỉ', color: 'warning', db: 'break' },
  { value: 'Đã nghỉ học', color: 'error', db: 'dropped' },
  { value: 'Đã tốt nghiệp', color: 'info', db: 'graduated' },
  { value: 'Bảo lưu', color: 'warning', db: 'reserve' }
];

const steps = ['Thông tin cá nhân', 'Thông tin liên hệ', 'Thông tin học tập'];

export default function EditStudentModal({ open, onClose, student, onSave, error, loading, classes }) {
  const [editedStudent, setEditedStudent] = useState({
    student_id: '',
    name: '',
    email: '',
    day_of_birth: '',
    gender: '',
    address: '',
    phone_number: '',
    class: '',
    admission_year: '',
    status: 'Đang học',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (student) {
      // Chuyển trạng thái từ tiếng Anh sang tiếng Việt để hiển thị
      let viStatus = 'Đang học';
      const statusMap = {
        studying: 'Đang học',
        break: 'Tạm nghỉ',
        dropped: 'Đã nghỉ học',
        graduated: 'Đã tốt nghiệp',
        reserve: 'Bảo lưu'
      };
      if (student.status && statusMap[student.status]) {
        viStatus = statusMap[student.status];
      } else if (student.status && statusOptions.some(opt => opt.value === student.status)) {
        viStatus = student.status;
      }
      setEditedStudent({
        student_id: student.student_id || '',
        name: student.name || '',
        email: student.account.email || '',
        day_of_birth: student.day_of_birth || '',
        gender: student.gender || '',
        address: student.address || '',
        phone_number: student.phone_number || '',
        class: student.class.class_id || '',
        admission_year: student.admission_year || '',
        status: viStatus,
      });
      setActiveStep(0);
      setLocalError('');
    }
  }, [student]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!editedStudent.student_id || !editedStudent.name || !editedStudent.day_of_birth || !editedStudent.gender) {
        setLocalError('Vui lòng điền đầy đủ thông tin cá nhân');
        return;
      }
    } else if (activeStep === 1) {
      if (!editedStudent.email || !editedStudent.phone_number || !editedStudent.address) {
        setLocalError('Vui lòng điền đầy đủ thông tin liên hệ');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedStudent.email)) {
        setLocalError('Email không hợp lệ');
        return;
      }

      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(editedStudent.phone_number)) {
        setLocalError('Số điện thoại phải có 10-11 chữ số');
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
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async () => {
    if (!editedStudent.class || !editedStudent.admission_year) {
      setLocalError('Vui lòng điền đầy đủ thông tin học tập');
      return;
    }

    const birthDate = new Date(editedStudent.day_of_birth);
    const admissionDate = new Date(editedStudent.admission_year);
    const today = new Date();

    if (birthDate >= today) {
      setLocalError('Ngày sinh không hợp lệ');
      return;
    }

    if (admissionDate > today) {
      setLocalError('Ngày nhập học không hợp lệ');
      return;
    }

    // Chuyển trạng thái sang tiếng Anh trước khi lưu
    const statusObj = statusOptions.find(opt => opt.value === editedStudent.status);
    const dbStatus = statusObj ? statusObj.db : 'studying';

    const updatedStudentData = {
      ...editedStudent,
      status: dbStatus,
      updated_at: new Date().toISOString(),
    };

    try {
      await onSave(updatedStudentData);
      onClose(); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      // Error sẽ được xử lý bởi component cha
    }
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
          overflow: 'hidden'
        }
      }}
    >
      {/* Header with gradient and shadow */}
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
          <SchoolIcon sx={{ fontSize: 28, mr: 2 }} />
          <Typography variant="h6" fontWeight="600">
            Chỉnh sửa thông tin sinh viên
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
        {/* Stepper */}
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

        {/* Error/Success messages */}
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
        </Box>

        {/* Form content - changes based on activeStep */}
        <Box sx={{ p: 3 }}>
          {activeStep === 0 && (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3
            }}>
              <TextField
                label="Mã sinh viên"
                name="student_id"
                value={editedStudent.student_id}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Họ và tên"
                name="name"
                value={editedStudent.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Ngày sinh"
                name="day_of_birth"
                type="date"
                value={editedStudent.day_of_birth}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={editedStudent.gender}
                  onChange={handleChange}
                  label="Giới tính"
                  startAdornment={
                    <InputAdornment position="start">
                      <GenderIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3
            }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={editedStudent.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Số điện thoại"
                name="phone_number"
                value={editedStudent.phone_number}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Địa chỉ"
                name="address"
                value={editedStudent.address}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
              />
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3
            }}>
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Lớp</InputLabel>
                <Select
                  name="class"
                  value={editedStudent.class}
                  onChange={handleChange}
                  label="Lớp"
                  startAdornment={
                    <InputAdornment position="start">
                      <ClassIcon color="action" />
                    </InputAdornment>
                  }
                >
                  {classes && classes.map((classItem) => (
                    <MenuItem key={classItem.class_id} value={classItem.class_id}>
                      {classItem.class_name || classItem.class_id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Ngày nhập học"
                name="admission_year"
                type="date"
                value={editedStudent.admission_year}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth required disabled={loading}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={editedStudent.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        label={option.value}
                        size="small"
                        color={option.color}
                        sx={{ mr: 1 }}
                      />
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
        justifyContent: 'flex-end',
        gap: 2,
        borderTop: '1px solid #eee'
      }}>
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
            {loading ? 'Đang lưu...' : 'Cập nhật'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}