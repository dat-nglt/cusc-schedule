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
} from '@mui/material';

const EditNotificationModal = ({ open, onClose, notification, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    maThongBao: '',
    tieuDeNoiDung: '',
    loaiThongBao: '',
    mucDoUuTien: '',
    kenhGui: '',
    thoiGianGui: '',
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        id: notification.id,
        maThongBao: notification.maThongBao,
        tieuDeNoiDung: notification.tieuDeNoiDung,
        loaiThongBao: notification.loaiThongBao,
        mucDoUuTien: notification.mucDoUuTien,
        kenhGui: notification.kenhGui,
        thoiGianGui: notification.thoiGianGui,
      });
    }
  }, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!Object.values(formData).every((value) => value)) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onSave({
      ...formData,
      thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
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
          label="Tiêu đề nội dung"
          name="tieuDeNoiDung"
          value={formData.tieuDeNoiDung}
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
            <MenuItem value="Sự kiện">Sự kiện</MenuItem>
            <MenuItem value="Học tập">Học tập</MenuItem>
            <MenuItem value="Hành chính">Hành chính</MenuItem>
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
            <MenuItem value="App">App</MenuItem>
            <MenuItem value="SMS">SMS</MenuItem>
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
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNotificationModal;