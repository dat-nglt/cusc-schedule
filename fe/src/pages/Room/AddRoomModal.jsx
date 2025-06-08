
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
} from '@mui/material';

const AddRoomModal = ({ open, onClose, onAddRoom }) => {
  const [formData, setFormData] = useState({
    maPhongHoc: '',
    tenPhongHoc: '',
    toaNha: '',
    tang: '',
    sucChua: '',
    loaiPhongHoc: '',
    trangThai: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!Object.values(formData).every((value) => value)) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onAddRoom({
      id: Date.now(), // Tạm dùng timestamp làm ID
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm phòng học</DialogTitle>
      <DialogContent>
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