import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const AddRoomModal = ({ open, onClose, onAddRoom, existingRooms }) => {
  const [formData, setFormData] = useState({
    maPhongHoc: '',
    tenPhongHoc: '',
    toaNha: '',
    tang: '',
    sucChua: '',
    loaiPhongHoc: '',
    trangThai: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = () => {
    if (!Object.values(formData).every((value) => value)) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const isDuplicate = existingRooms.some(
      (room) => room.maPhongHoc === formData.maPhongHoc
    );
    if (isDuplicate) {
      setError(`Mã phòng học "${formData.maPhongHoc}" đã tồn tại!`);
      return;
    }

    onAddRoom({
      id: Date.now(),
      ...formData,
      thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
      thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    setFormData({
      maPhongHoc: '',
      tenPhongHoc: '',
      toaNha: '',
      tang: '',
      sucChua: '',
      loaiPhongHoc: '',
      trangThai: '',
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
      const json = XLSX.utils.sheet_to_json(sheet);

      const imported = [];
      const duplicated = [];

      json.forEach((row) => {
        const maPhongHoc = row['Mã phòng học'];
        const isDuplicate = existingRooms.some((room) => room.maPhongHoc === maPhongHoc);

        if (isDuplicate) {
          duplicated.push(maPhongHoc);
        } else {
          imported.push({
            id: Date.now() + Math.random(),
            maPhongHoc,
            tenPhongHoc: row['Tên phòng học'],
            toaNha: row['Tòa nhà'],
            tang: row['Tầng'],
            sucChua: row['Sức chứa'],
            loaiPhongHoc: row['Loại phòng học'],
            trangThai: row['Trạng thái'],
            thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
            thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
          });
        }
      });

      if (duplicated.length > 0) {
        alert(
          `Các mã phòng học sau đã tồn tại và bị bỏ qua:\n${duplicated.join(', ')}`
        );
      }

      imported.forEach(onAddRoom);
      onClose();
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Thêm phòng học
          <label htmlFor="excel-upload">
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx, .xls"
              hidden
              onChange={handleImportExcel}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadFileIcon />}
              size="small"
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
          margin="dense"
          label="Mã phòng học"
          name="maPhongHoc"
          value={formData.maPhongHoc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Tên phòng học"
          name="tenPhongHoc"
          value={formData.tenPhongHoc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Tòa nhà"
          name="toaNha"
          value={formData.toaNha}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Tầng"
          name="tang"
          type="number"
          value={formData.tang}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Sức chứa"
          name="sucChua"
          type="number"
          value={formData.sucChua}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="loai-phong-hoc-label">Loại phòng học</InputLabel>
          <Select
            labelId="loai-phong-hoc-label"
            name="loaiPhongHoc"
            value={formData.loaiPhongHoc}
            onChange={handleChange}
            label="Loại phòng học"
          >
            <MenuItem value="Phòng lý thuyết">Phòng lý thuyết</MenuItem>
            <MenuItem value="Phòng thực hành">Phòng thực hành</MenuItem>
            <MenuItem value="Phòng hội thảo">Phòng hội thảo</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="trang-thai-label">Trạng thái</InputLabel>
          <Select
            labelId="trang-thai-label"
            name="trangThai"
            value={formData.trangThai}
            onChange={handleChange}
            label="Trạng thái"
          >
            <MenuItem value="Hoạt động">Hoạt động</MenuItem>
            <MenuItem value="Không hoạt động">Không hoạt động</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoomModal;
