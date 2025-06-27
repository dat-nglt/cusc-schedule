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
  Box,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const AddClassModal = ({ open, onClose, onAddClass, existingClasses = [] }) => {
  const [formData, setFormData] = useState({
    maLopHoc: '',
    maHocVien: '',
    maKhoaHoc: '',
    siSoLop: '',
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

    const isDuplicate = existingClasses.some(
      (cls) => cls.maLopHoc === formData.maLopHoc
    );
    if (isDuplicate) {
      setError(`Mã lớp học "${formData.maLopHoc}" đã tồn tại!`);
      return;
    }

    onAddClass({
      id: Date.now(),
      ...formData,
      thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
      thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    setFormData({
      maLopHoc: '',
      maHocVien: '',
      maKhoaHoc: '',
      siSoLop: '',
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
        const maLopHoc = row['Mã lớp học'];
        const isDuplicate = existingClasses.some((cls) => cls.maLopHoc === maLopHoc);

        if (isDuplicate) {
          duplicated.push(maLopHoc);
        } else {
          imported.push({
            id: Date.now() + Math.random(),
            maLopHoc,
            maHocVien: row['Mã học viên'],
            maKhoaHoc: row['Mã khóa học'],
            siSoLop: row['Sĩ số lớp'],
            trangThai: row['Trạng thái'],
            thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
            thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
          });
        }
      });

      if (duplicated.length > 0) {
        alert(`Các mã lớp học sau đã tồn tại và bị bỏ qua:\n${duplicated.join(', ')}`);
      }

      imported.forEach(onAddClass);
      onClose();
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Thêm lớp học
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
          label="Mã lớp học"
          name="maLopHoc"
          value={formData.maLopHoc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Mã học viên"
          name="maHocVien"
          value={formData.maHocVien}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Mã khóa học"
          name="maKhoaHoc"
          value={formData.maKhoaHoc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Sĩ số lớp"
          name="siSoLop"
          type="number"
          value={formData.siSoLop}
          onChange={handleChange}
        />
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

export default AddClassModal;
