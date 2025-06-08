
import React, { useState } from 'react';
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

const AddSlotTimeModal = ({ open, onClose, onAddSlotTime }) => {
  const [newSlotTime, newSlotTimesetNewSlotTime] = useState({
    maKhungGio: '',
    tenKhungGio: '',
    buoiHoc: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    newSlotTimesetNewSlotTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onAddSlotTime({
      ...newSlotTime,
      id: Date.now(), // Tạo ID tạm thời
      thoiGianTao: new Date().toISOString().slice(0, 19).replace('T', ' '),
      thoiGianCapNhat: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });
    newSlotTimesetNewSlotTime({
      maKhungGio: '',
      tenKhungGio: '',
      buoiHoc: '',
      thoiGianBatDau: '',
      thoiGianKetThuc: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm khung giờ mới</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Mã khung giờ"
          name="maKhungGio"
          value={newSlotTime.maKhungGio}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Tên khung giờ"
          name="tenKhungGio"
          value={newSlotTime.tenKhungGio}
          onChange={handleChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Buổi học</InputLabel>
          <Select
            name="buoiHoc"
            value={newSlotTime.buoiHoc}
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
          value={newSlotTime.thoiGianBatDau}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Thời gian kết thúc (HH:mm)"
          name="thoiGianKetThuc"
          value={newSlotTime.thoiGianKetThuc}
          onChange={handleChange}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSlotTimeModal;