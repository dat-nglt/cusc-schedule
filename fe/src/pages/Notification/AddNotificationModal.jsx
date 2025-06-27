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

const AddNotificationModal = ({ open, onClose, onAddNotification, existingNotifications }) => {
  const [formData, setFormData] = useState({
    maThongBao: '',
    tieuDeNoiDung: '',
    loaiThongBao: '',
    mucDoUuTien: '',
    kenhGui: '',
    thoiGianGui: '',
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

    const isDuplicate = existingNotifications.some(
      (notification) => notification.maThongBao === formData.maThongBao
    );
    if (isDuplicate) {
      setError(`Mã thông báo "${formData.maThongBao}" đã tồn tại!`);
      return;
    }

    onAddNotification({
      id: Date.now(),
      ...formData,
      thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
      thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });

    setFormData({
      maThongBao: '',
      tieuDeNoiDung: '',
      loaiThongBao: '',
      mucDoUuTien: '',
      kenhGui: '',
      thoiGianGui: '',
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
        const maThongBao = row['Mã thông báo'];
        const isDuplicate = existingNotifications.some(
          (notification) => notification.maThongBao === maThongBao
        );

        if (isDuplicate) {
          duplicated.push(maThongBao);
        } else {
          imported.push({
            id: Date.now() + Math.random(),
            maThongBao,
            tieuDeNoiDung: row['Tiêu đề nội dung'],
            loaiThongBao: row['Loại thông báo'],
            mucDoUuTien: row['Mức độ ưu tiên'],
            kenhGui: row['Kênh gửi'],
            thoiGianGui: row['Thời gian gửi'],
            thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
            thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
          });
        }
      });

      if (duplicated.length > 0) {
        alert(
          `Các mã thông báo sau đã tồn tại và bị bỏ qua:\n${duplicated.join(', ')}`
        );
      }

      imported.forEach(onAddNotification);
      onClose();
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Thêm thông báo
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
          label="Mã thông báo"
          name="maThongBao"
          value={formData.maThongBao}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Tiêu đề nội dung"
          name="tieuDeNoiDung"
          value={formData.tieuDeNoiDung}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="loai-thong-bao-label">Loại thông báo</InputLabel>
          <Select
            labelId="loai-thong-bao-label"
            name="loaiThongBao"
            value={formData.loaiThongBao}
            onChange={handleChange}
            label="Loại thông báo"
          >
            <MenuItem value="Sự kiện">Sự kiện</MenuItem>
            <MenuItem value="Học tập">Học tập</MenuItem>
            <MenuItem value="Hành chính">Hành chính</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="muc-do-uu-tien-label">Mức độ ưu tiên</InputLabel>
          <Select
            labelId="muc-do-uu-tien-label"
            name="mucDoUuTien"
            value={formData.mucDoUuTien}
            onChange={handleChange}
            label="Mức độ ưu tiên"
          >
            <MenuItem value="Cao">Cao</MenuItem>
            <MenuItem value="Trung bình">Trung bình</MenuItem>
            <MenuItem value="Thấp">Thấp</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="kenh-gui-label">Kênh gửi</InputLabel>
          <Select
            labelId="kenh-gui-label"
            name="kenhGui"
            value={formData.kenhGui}
            onChange={handleChange}
            label="Kênh gửi"
          >
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="App">App</MenuItem>
            <MenuItem value="SMS">SMS</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="dense"
          label="Thời gian gửi"
          name="thoiGianGui"
          type="datetime-local"
          value={formData.thoiGianGui}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
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

export default AddNotificationModal;