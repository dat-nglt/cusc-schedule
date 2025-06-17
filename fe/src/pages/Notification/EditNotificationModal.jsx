import React, { useState, useEffect } from 'react';
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
  Typography,
} from '@mui/material';

const EditNotificationModal = ({ open, onClose, notification, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    maThongBao: '',
    tieuDe: '',
    noiDung: '',
    loaiThongBao: '',
    mucDoUuTien: '',
    kenhGui: '',
    thoiGianGui: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (notification) {
      setFormData({
        id: notification.id,
        maThongBao: notification.maThongBao,
        tieuDe: notification.tieuDe,
        noiDung: notification.noiDung,
        loaiThongBao: notification.loaiThongBao,
        mucDoUuTien: notification.mucDoUuTien,
        kenhGui: notification.kenhGui,
        thoiGianGui: notification.thoiGianGui,
      });
      setError('');
    }
  }, [notification]);

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
    onSave({
      ...formData,
      thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          marginTop: '20px',
        },
      }}
    >
      <DialogTitle>Chỉnh sửa thông báo</DialogTitle>
      <DialogContent
        sx={{
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: 2,
        }}
      >
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          margin="normal"
          label="Mã thông báo"
          name="maThongBao"
          value={formData.maThongBao}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tiêu đề"
          name="tieuDe"
          value={formData.tieuDe}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Nội dung"
          name="noiDung"
          multiline
          rows={4}
          value={formData.noiDung}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="loai-thong-bao-label">Loại thông báo</InputLabel>
          <Select
            labelId="loai-thong-bao-label"
            name="loaiThongBao"
            value={formData.loaiThongBao}
            onChange={handleChange}
            label="Loại thông báo"
          >
            <MenuItem value="Họp lớp">Họp lớp</MenuItem>
            <MenuItem value="Lịch học">Lịch học</MenuItem>
            <MenuItem value="Sự kiện">Sự kiện</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
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
        <FormControl fullWidth margin="normal">
          <InputLabel id="kenh-gui-label">Kênh gửi</InputLabel>
          <Select
            labelId="kenh-gui-label"
            name="kenhGui"
            value={formData.kenhGui}
            onChange={handleChange}
            label="Kênh gửi"
          >
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Thời gian gửi"
          name="thoiGianGui"
          type="datetime-local"
          value={formData.thoiGianGui}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Hủy chỉnh sửa thông báo">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" aria-label="Lưu thông báo">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNotificationModal;