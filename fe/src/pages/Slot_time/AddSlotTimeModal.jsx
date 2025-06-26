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
  Box,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const AddSlotTimeModal = ({ open, onClose, onAddSlotTime, existingSlotTimes = [] }) => {
  const [newSlotTime, setNewSlotTime] = useState({
    maKhungGio: '',
    tenKhungGio: '',
    buoiHoc: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSlotTime((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const cleanText = (value) => {
    if (typeof value === 'string') {
      return value.trim().normalize('NFC');
    }
    return '';
  };

  const normalizeBuoiHoc = (text) => {
    const cleaned = cleanText(text).toLowerCase();
    if (cleaned.includes('sáng')) return 'Sáng';
    if (cleaned.includes('chiều')) return 'Chiều';
    if (cleaned.includes('tối') || cleaned.includes('tối')) return 'Tối';
    return '';
  };

  const parseTime = (value) => {
    if (typeof value === 'number') {
      const totalMinutes = Math.round(value * 24 * 60);
      const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
      const minutes = String(totalMinutes % 60).padStart(2, '0');
      return `${hours}:${minutes}`;
    } else if (typeof value === 'string') {
      return value.trim();
    }
    return '';
  };

  const handleSubmit = () => {
    const isDuplicate = existingSlotTimes.some(
      (slot) => slot.maKhungGio === newSlotTime.maKhungGio
    );

    if (!Object.values(newSlotTime).every((v) => v)) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (isDuplicate) {
      setError(`Mã khung giờ "${newSlotTime.maKhungGio}" đã tồn tại!`);
      return;
    }

    onAddSlotTime({
      ...newSlotTime,
      id: Date.now(),
      thoiGianTao: new Date().toISOString().slice(0, 19).replace('T', ' '),
      thoiGianCapNhat: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });

    setNewSlotTime({
      maKhungGio: '',
      tenKhungGio: '',
      buoiHoc: '',
      thoiGianBatDau: '',
      thoiGianKetThuc: '',
    });
    onClose();
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const imported = [];
      const duplicated = [];

      rows.forEach((row) => {
        const maKhungGio = cleanText(row['Mã khung giờ']);
        if (existingSlotTimes.some((s) => s.maKhungGio === maKhungGio)) {
          duplicated.push(maKhungGio);
        } else {
          imported.push({
            id: Date.now() + Math.random(),
            maKhungGio,
            tenKhungGio: cleanText(row['Tên khung giờ']),
            buoiHoc: normalizeBuoiHoc(row['Buổi học']),
            thoiGianBatDau: parseTime(row['Thời gian bắt đầu']),
            thoiGianKetThuc: parseTime(row['Thời gian kết thúc']),
            thoiGianTao: new Date().toISOString().slice(0, 19).replace('T', ' '),
            thoiGianCapNhat: new Date().toISOString().slice(0, 19).replace('T', ' '),
          });
        }
      });

      if (duplicated.length > 0) {
        alert(`Bỏ qua các mã khung giờ đã tồn tại:\n${duplicated.join(', ')}`);
      }

      imported.forEach(onAddSlotTime);
      onClose();
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Thêm khung giờ mới
          <label htmlFor="upload-slot-time">
            <input
              id="upload-slot-time"
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={handleImportExcel}
            />
            <Button
              variant="outlined"
              component="span"
              size="small"
              startIcon={<UploadFileIcon />}
            >
              Thêm tự động
            </Button>
          </label>
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
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
