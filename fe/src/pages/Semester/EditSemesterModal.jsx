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
  Chip,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Close,
  CalendarToday as CalendarIcon,
  Event as EventIcon,
  EventAvailable as StartDateIcon,
  EventBusy as EndDateIcon,
  School as SchoolIcon,
  ToggleOn as StatusIcon
} from '@mui/icons-material';

const statusOptions = [
  { value: 'Đang triển khai', label: 'Đang triển khai', color: 'info' },
  { value: 'Đang mở đăng ký', label: 'Đang mở đăng ký', color: 'success' },
  { value: 'Đang diễn ra', label: 'Đang diễn ra', color: 'warning' },
  { value: 'Tạm dừng', label: 'Tạm dừng', color: 'error' },
  { value: 'Đã kết thúc', label: 'Đã kết thúc', color: 'default' }
];

export default function EditSemesterModal({ open, onClose, semester, onSave, error, loading }) {
  const [editedSemester, setEditedSemester] = useState({
    semester_id: '',
    semester_name: '',
    start_date: '',
    end_date: '',
    status: 'Đang triển khai'
  });

  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (semester) {
      setEditedSemester({
        semester_id: semester.semester_id || '',
        semester_name: semester.semester_name || '',
        start_date: semester.start_date?.split('T')[0] || '',
        end_date: semester.end_date?.split('T')[0] || '',
        status: semester.status || 'Đang triển khai'
      });
    }
    setDateError('');
  }, [semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSemester(prev => ({ ...prev, [name]: value }));
    setDateError('');
  };

  const validateDates = () => {
    if (!editedSemester.start_date || !editedSemester.end_date) return true;
    
    const startDate = new Date(editedSemester.start_date);
    const endDate = new Date(editedSemester.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate >= endDate) {
      setDateError('Ngày bắt đầu phải trước ngày kết thúc');
      return false;
    }

    if (editedSemester.status === 'Đang triển khai' && startDate < today) {
      setDateError('Ngày bắt đầu không được là ngày trong quá khứ');
      return false;
    }

    if (endDate < today && editedSemester.status !== 'Đã kết thúc') {
      setDateError('Ngày kết thúc không được là ngày trong quá khứ');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateDates()) return;

    if (!editedSemester.semester_name) {
      setDateError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const updatedSemesterData = {
      ...editedSemester,
      updated_at: new Date().toISOString()
    };

    await onSave(updatedSemesterData);
    if (!error) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header with gradient */}
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
            Chỉnh sửa học kỳ
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

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {dateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dateError}
            </Alert>
          )}

          <TextField
            label="Mã học kỳ"
            name="semester_id"
            value={editedSemester.semester_id}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Tên học kỳ"
            name="semester_name"
            value={editedSemester.semester_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Ngày bắt đầu"
              name="start_date"
              type="date"
              value={editedSemester.start_date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StartDateIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Ngày kết thúc"
              name="end_date"
              type="date"
              value={editedSemester.end_date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EndDateIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={editedSemester.status}
              onChange={handleChange}
              label="Trạng thái"
              startAdornment={
                <InputAdornment position="start">
                  <StatusIcon color="action" />
                </InputAdornment>
              }
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Chip
                    label={option.label}
                    size="small"
                    color={option.color}
                    sx={{ mr: 1 }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        borderTop: '1px solid #eee'
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 1, px: 3 }}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1, px: 3 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}