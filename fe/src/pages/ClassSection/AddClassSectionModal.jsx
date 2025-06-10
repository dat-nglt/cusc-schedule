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

const AddClassSectionModal = ({ open, onClose, onAddClassSection }) => {
  const [formData, setFormData] = useState({
    maLopHocPhan: '',
    maLopHoc: '',
    maHocPhan: '',
    tenLopHocPhan: '',
    siSoToiDa: '',
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
    onAddClassSection({
      id: Date.now(),
      ...formData,
      thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
      thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
    });
    setFormData({
      maLopHocPhan: '',
      maLopHoc: '',
      maHocPhan: '',
      tenLopHocPhan: '',
      siSoToiDa: '',
      trangThai: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm lớp học phần</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          label="Mã lớp học phần"
          name="maLopHocPhan"
          value={formData.maLopHocPhan}
          onChange={handleChange}
        />
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
          label="Mã học phần"
          name="maHocPhan"
          value={formData.maHocPhan}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Tên lớp học phần"
          name="tenLopHocPhan"
          value={formData.tenLopHocPhan}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Sĩ số tối đa"
          name="siSoToiDa"
          type="number"
          value={formData.siSoToiDa}
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

export default AddClassSectionModal;