
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
} from '@mui/material';

const EditSlotTimeModal = ({ open, onClose, slotTime, onSave }) => {
  const [editedSlotTime, setEditedSlotTime] = useState(slotTime || {});

  useEffect(() => {
    setEditedSlotTime(slotTime || {});
  }, [slotTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSlotTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...editedSlotTime,
      thoiGianCapNhat: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    onClose();
  };

  if (!slotTime) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa khung giờ</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Mã khung giờ"
          name="maKhungGio"
          value={editedSlotTime.maKhungGio || ''}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Tên khung giờ"
          name="tenKhungGio"
          value={editedSlotTime.tenKhungGio || ''}
          onChange={handleChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Buổi học</InputLabel>
          <Select
            name="buoiHoc"
            value={editedSlotTime.buoiHoc || ''}
            onChange={handleChange}
            label="Buổi học"
          >
            <MenuItem value="Sáng">Sáng</MenuItem>
            <MenuItem value="Chiều">Chiều</MenuItem>
            <MenuItem value="Tối">Tối</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Thời gian bắt đầu (HH:mm)"
          name="thoiGianBatDau"
          value={editedSlotTime.thoiGianBatDau || ''}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Thời gian kết thúc (HH:mm)"
          name="thoiGianKetThuc"
          value={editedSlotTime.thoiGianKetThuc || ''}
          onChange={handleChange}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSlotTimeModal;