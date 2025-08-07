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
  Chip,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Close,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  CalendarToday as CalendarIcon,
  ToggleOn as StatusIcon
} from '@mui/icons-material';

const breakTypes = [
  { value: 'holiday', label: 'Ngày lễ' },
  { value: 'semester_break', label: 'Nghỉ giữa kỳ' },
  { value: 'summer_break', label: 'Nghỉ hè' },
  { value: 'winter_break', label: 'Nghỉ đông' },
  { value: 'other', label: 'Khác' }
];

const statusOptions = [
  { value: 'active', label: 'Hoạt động', color: 'success' },
  { value: 'inactive', label: 'Ngừng hoạt động', color: 'error' }
];

export default function EditBreakScheduleModal({ open, onClose, breakSchedule, onSave }) {
  const [editedBreakSchedule, setEditedBreakSchedule] = useState({
    break_id: '',
    break_type: '',
    break_start_date: '',
    break_end_date: '',
    status: 'inactive',
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    if (breakSchedule) {
      setEditedBreakSchedule({
        break_id: breakSchedule.break_id || '',
        break_type: breakSchedule.break_type || '',
        break_start_date: breakSchedule.break_start_date?.split('T')[0] || '',
        break_end_date: breakSchedule.break_end_date?.split('T')[0] || '',
        status: breakSchedule.status || 'inactive',
        created_at: breakSchedule.created_at || '',
        updated_at: new Date().toISOString()
      });
    }
  }, [breakSchedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBreakSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validate dates
    if (new Date(editedBreakSchedule.break_start_date) > new Date(editedBreakSchedule.break_end_date)) {
      alert('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }

    if (!editedBreakSchedule.break_type || 
        !editedBreakSchedule.break_start_date || 
        !editedBreakSchedule.break_end_date) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const updatedData = {
      ...editedBreakSchedule,
      updated_at: new Date().toISOString()
    };

    onSave(updatedData);
    onClose();
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
          <EventIcon sx={{ fontSize: 28, mr: 2 }} />
          <Typography variant="h6" fontWeight="600">
            Chỉnh sửa lịch nghỉ
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
          <TextField
            label="Mã lịch nghỉ"
            name="break_id"
            value={editedBreakSchedule.break_id}
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
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth>
            <InputLabel>Loại lịch nghỉ</InputLabel>
            <Select
              name="break_type"
              value={editedBreakSchedule.break_type}
              onChange={handleChange}
              label="Loại lịch nghỉ"
              startAdornment={
                <InputAdornment position="start">
                  <EventIcon color="action" />
                </InputAdornment>
              }
            >
              {breakTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Ngày bắt đầu"
              name="break_start_date"
              type="date"
              value={editedBreakSchedule.break_start_date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventAvailableIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Ngày kết thúc"
              name="break_end_date"
              type="date"
              value={editedBreakSchedule.break_end_date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventBusyIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={editedBreakSchedule.status}
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
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1, px: 3 }}
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}