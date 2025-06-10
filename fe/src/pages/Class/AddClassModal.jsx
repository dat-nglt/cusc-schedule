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

const AddClassModal = ({ open, onClose, onAddClass }) => {
  const [formData, setFormData] = useState({
    maLopHoc: '',
    maHocVien: '',
    maKhoaHoc: '',
    siSoLop: '',
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
    onAddClass({
      id: Date.now(), // Tạm dùng timestamp làm ID
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm lớp học</DialogTitle>
      <DialogContent>
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