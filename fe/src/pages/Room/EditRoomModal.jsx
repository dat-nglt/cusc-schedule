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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';

const EditRoomModal = ({ open, onClose, room, onSave, error, loading }) => {
  const [formData, setFormData] = useState({
    room_id: '',
    room_name: '',
    location: '',
    capacity: '',
    type: '',
    status: '',
    note: '',
  });

  useEffect(() => {
    if (room) {
      setFormData({
        room_id: room.room_id || '',
        room_name: room.room_name || '',
        location: room.location || '',
        capacity: room.capacity || '',
        type: room.type || '',
        status: room.status || '',
        note: room.note || '',
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.room_id ||
      !formData.room_name ||
      !formData.location ||
      !formData.capacity ||
      !formData.type ||
      !formData.status
    ) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Validate room name length
    if (formData.room_name.length < 2) {
      alert('Tên phòng học phải có ít nhất 2 ký tự!');
      return;
    }

    // Validate capacity
    const capacity = Number(formData.capacity);
    if (isNaN(capacity) || capacity <= 0 || capacity > 1000) {
      alert('Sức chứa phải là số dương và không quá 1000!');
      return;
    }

    const updatedRoomData = {
      room_id: formData.room_id,
      room_name: formData.room_name,
      location: formData.location,
      capacity: capacity,
      type: formData.type,
      status: formData.status,
      note: formData.note,
      updated_at: new Date().toISOString(),
    };

    // Gọi hàm onSave được truyền từ component cha
    await onSave(updatedRoomData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Chỉnh sửa phòng học</Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Mã phòng học"
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            disabled={true}
          />
          <TextField
            label="Tên phòng học"
            name="room_name"
            value={formData.room_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
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
          />
          <TextField
            label="Sức chứa"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <FormControl fullWidth required>
            <InputLabel>Loại phòng học</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Loại phòng học"
            >
              <MenuItem value="Lý thuyết">Phòng học lý thuyết</MenuItem>
              <MenuItem value="Thực hành">Phòng thực hành</MenuItem>
              {/* <MenuItem value="Phòng hội thảo">Phòng hội thảo</MenuItem> */}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="Sẵn sàng">Sẵn sàng</MenuItem>
              <MenuItem value="Bảo trì">Bảo trì</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ghi chú"
            name="note"
            multiline
            rows={2}
            value={formData.note}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
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

export default EditRoomModal;