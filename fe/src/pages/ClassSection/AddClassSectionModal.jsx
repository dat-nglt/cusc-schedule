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
  Class,
  School,
  Assignment,
  People,
  CheckCircle,
  Error as ErrorIcon,
  PlayCircleFilled,
  PauseCircleFilled
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

const statusOptions = [
  { value: 'Hoạt động', color: 'success', icon: <PlayCircleFilled /> },
  { value: 'Không hoạt động', color: 'error', icon: <PauseCircleFilled /> }
];

const steps = ['Thông tin lớp học phần', 'Thông tin bổ sung'];

export default function AddClassSectionModal({
  open,
  onClose,
  onAddClassSection,
  existingClassSections,
  error: apiError,
  loading,
  message
}) {
  const [newClassSection, setNewClassSection] = useState({
    maLopHocPhan: '',
    maLopHoc: '',
    maHocPhan: '',
    tenLopHocPhan: '',
    siSoToiDa: '',
    trangThai: 'Hoạt động',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [localError, setLocalError] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!newClassSection.maLopHocPhan || !newClassSection.maLopHoc || !newClassSection.maHocPhan) {
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
    setNewClassSection((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const validateClassSection = () => {
    if (!newClassSection.tenLopHocPhan || !newClassSection.siSoToiDa) {
      setLocalError('Vui lòng điền đầy đủ thông tin bổ sung');
      return false;
    }

    const siSoToiDa = parseInt(newClassSection.siSoToiDa, 10);
    if (isNaN(siSoToiDa)) {
      setLocalError('Sĩ số tối đa phải là số');
      return false;
    }

    if (siSoToiDa <= 0) {
      setLocalError('Sĩ số tối đa phải lớn hơn 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateClassSection()) {
      return;
    }

    const isDuplicate = existingClassSections.some(
      (classSection) => classSection.maLopHocPhan === newClassSection.maLopHocPhan
    );
    if (isDuplicate) {
      setLocalError(`Mã lớp học phần "${newClassSection.maLopHocPhan}" đã tồn tại`);
      return;
    }

    const classSectionToAdd = {
      ...newClassSection,
      siSoToiDa: parseInt(newClassSection.siSoToiDa, 10),
      id: Date.now(),
      thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
      thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    await onAddClassSection(classSectionToAdd);

    if (!apiError && !loading) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setNewClassSection({
      maLopHocPhan: '',
      maLopHoc: '',
      maHocPhan: '',
      tenLopHocPhan: '',
      siSoToiDa: '',
      trangThai: 'Hoạt động',
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
      const expectedHeader = ['Mã lớp học phần', 'Mã lớp học', 'Mã học phần', 'Tên lớp học phần', 'Sĩ số tối đa', 'Trạng thái'];

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

      const imported = [];
      const duplicated = [];
      const invalidRows = [];

      jsonData.forEach((row, index) => {
        const maLopHocPhan = row['Mã lớp học phần']?.toString().trim() || '';
        const maLopHoc = row['Mã lớp học']?.toString().trim() || '';
        const maHocPhan = row['Mã học phần']?.toString().trim() || '';
        const tenLopHocPhan = row['Tên lớp học phần']?.toString().trim() || '';
        const siSoToiDa = parseInt(row['Sĩ số tối đa'], 10);
        const trangThai = row['Trạng thái']?.toString().trim() || 'Hoạt động';

        if (!maLopHocPhan || !maLopHoc || !maHocPhan || !tenLopHocPhan || isNaN(siSoToiDa)) {
          invalidRows.push(index + 2);
          return;
        }

        if (siSoToiDa <= 0) {
          invalidRows.push(index + 2);
          return;
        }

        if (!statusOptions.some(opt => opt.value === trangThai)) {
          invalidRows.push(index + 2);
          return;
        }

        const isDuplicate = existingClassSections.some(
          (classSection) => classSection.maLopHocPhan === maLopHocPhan
        );

        if (isDuplicate) {
          duplicated.push(maLopHocPhan);
        } else {
          imported.push({
            id: Date.now() + Math.random(),
            maLopHocPhan,
            maLopHoc,
            maHocPhan,
            tenLopHocPhan,
            siSoToiDa,
            trangThai,
            thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
            thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
          });
        }
      });

      let errorMessage = '';
      if (duplicated.length > 0) {
        errorMessage += `Các mã lớp học phần đã tồn tại: ${duplicated.join(', ')}. `;
      }
      if (invalidRows.length > 0) {
        errorMessage += `Các hàng không hợp lệ: ${invalidRows.join(', ')}.`;
      }

      if (errorMessage) {
        setLocalError(errorMessage);
      }

      if (imported.length > 0) {
        imported.forEach(onAddClassSection);
        if (!errorMessage) {
          resetForm();
          onClose();
        }
      } else if (!errorMessage) {
        setLocalError('Không có dữ liệu hợp lệ nào trong file Excel');
      }

    } catch (error) {
      console.error('Error reading Excel file:', error);
      setLocalError('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại');
      setFileUploaded(false);
    } finally {
      e.target.value = '';
    }
  };

  return (
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
          <Class sx={{ fontSize: 28, mr: 2 }} />
          <Typography variant="h6" fontWeight="600">
            Thêm Lớp Học Phần
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
                label="Mã lớp học phần"
                name="maLopHocPhan"
                value={newClassSection.maLopHocPhan}
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
                label="Mã lớp học"
                name="maLopHoc"
                value={newClassSection.maLopHoc}
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
                label="Mã học phần"
                name="maHocPhan"
                value={newClassSection.maHocPhan}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Assignment color="action" />
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
                label="Tên lớp học phần"
                name="tenLopHocPhan"
                value={newClassSection.tenLopHocPhan}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Sĩ số tối đa"
                name="siSoToiDa"
                type="number"
                value={newClassSection.siSoToiDa}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <People color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth required sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="trangThai"
                  value={newClassSection.trangThai}
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
              {loading ? 'Đang xử lý...' : 'Thêm lớp học phần'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};