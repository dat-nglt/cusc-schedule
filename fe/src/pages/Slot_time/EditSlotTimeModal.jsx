import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const availableTypes = ['Sáng', 'Chiều', 'Tối'];
const availableStatuses = ['Hoạt động', 'Tạm ngưng', 'Đã hủy'];

const EditSlotTimeModal = ({ open, onClose, slotTime, onSave, error, loading }) => {
  const [editedSlotTime, setEditedSlotTime] = useState({
    slot_id: '',
    slot_name: '',
    start_time: '',
    end_time: '',
    type: '',
    description: '',
    status: 'Hoạt động',
  });

  useEffect(() => {
    if (slotTime) {
      setEditedSlotTime({
        slot_id: slotTime.slot_id || '',
        slot_name: slotTime.slot_name || '',
        start_time: slotTime.start_time || '',
        end_time: slotTime.end_time || '',
        type: slotTime.type || '',
        description: slotTime.description || '',
        status: slotTime.status || 'Hoạt động',
      });
    }
  }, [slotTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSlotTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !editedSlotTime.slot_id ||
      !editedSlotTime.slot_name ||
      !editedSlotTime.start_time ||
      !editedSlotTime.end_time ||
      !editedSlotTime.type
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Validate slot name length
    if (editedSlotTime.slot_name.length < 3) {
      alert('Tên khung giờ phải có ít nhất 3 ký tự!');
      return;
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(editedSlotTime.start_time) || !timeRegex.test(editedSlotTime.end_time)) {
      alert('Định dạng thời gian không hợp lệ! Sử dụng định dạng HH:MM:SS');
      return;
    }

    // Check if start time is before end time
    const startTime = new Date(`2000-01-01T${editedSlotTime.start_time}`);
    const endTime = new Date(`2000-01-01T${editedSlotTime.end_time}`);
    if (startTime >= endTime) {
      alert('Thời gian bắt đầu phải trước thời gian kết thúc!');
      return;
    }

    const updatedSlotTimeData = {
      ...editedSlotTime,
      updated_at: new Date().toISOString(),
    };

    await onSave(updatedSlotTimeData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Chỉnh sửa khung giờ</Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Mã khung giờ"
            name="slot_id"
            value={editedSlotTime.slot_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            disabled={true}
          />
          <TextField
            label="Tên khung giờ"
            name="slot_name"
            value={editedSlotTime.slot_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu (HH:MM:SS)"
            name="start_time"
            value={editedSlotTime.start_time}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            placeholder="07:00:00"
          />
          <TextField
            label="Thời gian kết thúc (HH:MM:SS)"
            name="end_time"
            value={editedSlotTime.end_time}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            placeholder="09:00:00"
          />
          <FormControl fullWidth required>
            <InputLabel>Buổi học</InputLabel>
            <Select
              name="type"
              value={editedSlotTime.type}
              onChange={handleChange}
              label="Buổi học"
            >
              {availableTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Mô tả"
            name="description"
            value={editedSlotTime.description}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            multiline
            rows={2}
          />
          <FormControl fullWidth required>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={editedSlotTime.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              {availableStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSlotTimeModal;