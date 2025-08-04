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
} from '@mui/material';

// Cần làm tiếp

const EditBreakScheduleModal = ({ open, onClose, breakSchedule, onSave }) => {
  const [editedBreakSchedule, setEditedBreakSchedule] = useState({
    break_id: '',
    break_type: '',
    break_start_date: '',
    break_end_date: '',
    status: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (breakSchedule) {
      console.log('BreakSchedule data received:', breakSchedule); // Debug giá trị ban đầu
      setEditedBreakSchedule({
        break_id: breakSchedule.break_id || '',
        break_type: breakSchedule.break_type || '',
        break_start_date: breakSchedule.break_start_date || '',
        break_end_date: breakSchedule.break_end_date || '',
        status: breakSchedule.status || 'inactive', // Đặt mặc định nếu không có
        created_at: breakSchedule.created_at || '',
        updated_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
    }
  }, [breakSchedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBreakSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !editedBreakSchedule.break_id ||
      !editedBreakSchedule.break_type ||
      !editedBreakSchedule.break_start_date ||
      !editedBreakSchedule.break_end_date ||
      !editedBreakSchedule.status
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onSave(editedBreakSchedule);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          margin: 0,
          maxHeight: 'calc(100% - 64px)',
          top: '40px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Chỉnh sửa lịch nghỉ</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Mã lịch nghỉ"
            name="break_id"
            value={editedBreakSchedule.break_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Loại lịch nghỉ"
            name="break_type"
            value={editedBreakSchedule.break_type}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="break_start_date"
            type="date"
            value={editedBreakSchedule.break_start_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian kết thúc"
            name="break_end_date"
            type="date"
            value={editedBreakSchedule.break_end_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={editedBreakSchedule.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }}>
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBreakScheduleModal;