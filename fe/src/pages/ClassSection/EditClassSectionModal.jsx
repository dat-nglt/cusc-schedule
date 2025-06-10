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

const EditClassSectionModal = ({ open, onClose, cls, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    maLopHocPhan: '',
    maLopHoc: '',
    maHocPhan: '',
    tenLopHocPhan: '',
    siSoToiDa: '',
    trangThai: '',
  });

  useEffect(() => {
    if (cls) {
      setFormData({
        id: cls.id,
        maLopHocPhan: cls.maLopHocPhan,
        maLopHoc: cls.maLopHoc,
        maHocPhan: cls.maHocPhan,
        tenLopHocPhan: cls.tenLopHocPhan,
        siSoToiDa: cls.siSoToiDa,
        trangThai: cls.trangThai,
      });
    }
  }, [cls]);

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
      <DialogTitle>Chỉnh sửa lớp học phần</DialogTitle>
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
          label="Mã lớp học phần"
          name="maLopHocPhan"
          value={formData.maLopHocPhan}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mã lớp học"
          name="maLopHoc"
          value={formData.maLopHoc}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mã học phần"
          name="maHocPhan"
          value={formData.maHocPhan}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Tên lớp học phần"
          name="tenLopHocPhan"
          value={formData.tenLopHocPhan}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Sĩ số tối đa"
          name="siSoToiDa"
          type="number"
          value={formData.siSoToiDa}
          onChange={handleChange}
        />
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

export default EditClassSectionModal;