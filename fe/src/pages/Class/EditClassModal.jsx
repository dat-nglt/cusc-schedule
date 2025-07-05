import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const EditClassModal = ({ open, onClose, classItem, onSave }) => {
  const [editedClass, setEditedClass] = useState({
    class_id: '',
    class_name: '',
    class_size: '',
    status: '',
    course_id: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (classItem) {
      console.log('Class data received:', classItem); // Debug giá trị ban đầu
      setEditedClass({
        class_id: classItem.class_id || '',
        class_name: classItem.class_name || '',
        class_size: classItem.class_size || '',
        status: classItem.status || 'Hoạt động',
        course_id: classItem.course_id || '',
        created_at: classItem.created_at || '',
        updated_at: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
    }
  }, [classItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !editedClass.class_id ||
      !editedClass.class_name ||
      !editedClass.class_size ||
      !editedClass.course_id
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const classSize = parseInt(editedClass.class_size, 10);
    if (isNaN(classSize) || classSize <= 0) {
      alert('Sĩ số phải là số nguyên dương!');
      return;
    }

    onSave(editedClass);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          margin: 0,
          maxHeight: 'calc(100% - 64px)',
          top: '40px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Chỉnh sửa lớp học</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Mã lớp học"
            name="class_id"
            value={editedClass.class_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Tên lớp học"
            name="class_name"
            value={editedClass.class_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Sĩ số"
            name="class_size"
            type="number"
            value={editedClass.class_size}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            InputProps={{ inputProps: { min: 1 } }}
          />
          <FormControl fullWidth variant="outlined" required>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={editedClass.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="Hoạt động">Hoạt động</MenuItem>
              <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Mã khóa học"
            name="course_id"
            value={editedClass.course_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }}>
          Hủy
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClassModal;