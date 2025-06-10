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

const EditRoomModal = ({ open, onClose, room, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    maPhongHoc: '',
    tenPhongHoc: '',
    toaNha: '',
    tang: '',
    sucChua: '',
    loaiPhongHoc: '',
    trangThai: '',
  });

  useEffect(() => {
    if (room) {
      setFormData({
        id: room.id,
        maPhongHoc: room.maPhongHoc,
        tenPhongHoc: room.tenPhongHoc,
        toaNha: room.toaNha,
        tang: room.tang,
        sucChua: room.sucChua,
        loaiPhongHoc: room.loaiPhongHoc,
        trangThai: room.trangThai,
      });
    }
  }, [room]);

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
          marginTop: '20px', // Khoảng cách 10px từ đỉnh màn hình (bao gồm header)
        },
      }}
    >
      <DialogTitle>Chỉnh sửa phòng học</DialogTitle>
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
          label="Mã phòng học"
          name="maPhongHoc"
          value={formData.maPhongHoc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tên phòng học"
          name="tenPhongHoc"
          value={formData.tenPhongHoc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tòa nhà"
          name="toaNha"
          value={formData.toaNha}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tầng"
          name="tang"
          type="number"
          value={formData.tang}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Sức chứa"
          name="sucChua"
          type="number"
          value={formData.sucChua}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
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
        <FormControl fullWidth margin="normal">
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
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoomModal;