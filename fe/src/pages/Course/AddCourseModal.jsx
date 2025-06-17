import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const AddCourseModal = ({ open, onClose, onAddCourse, existingCourses }) => {
  const [newCourse, setNewCourse] = useState({
    maKhoaHoc: '',
    tenKhoaHoc: '',
    thoiGianBatDau: '',
    thoiGianKetThuc: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = () => {
    if (
      !newCourse.maKhoaHoc ||
      !newCourse.tenKhoaHoc ||
      !newCourse.thoiGianBatDau ||
      !newCourse.thoiGianKetThuc
    ) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const isDuplicate = existingCourses.some(
      (course) => course.maKhoaHoc === newCourse.maKhoaHoc
    );
    if (isDuplicate) {
      setError(`Mã khóa học "${newCourse.maKhoaHoc}" đã tồn tại!`);
      return;
    }

    const thoiGianBatDau = new Date(newCourse.thoiGianBatDau);
    const thoiGianKetThuc = new Date(newCourse.thoiGianKetThuc);
    if (thoiGianKetThuc <= thoiGianBatDau) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu!');
      return;
    }

    const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const courseToAdd = {
      ...newCourse,
      id: Date.now(),
      stt: 0,
      thoiGianTao: currentDateTime,
      thoiGianCapNhat: currentDateTime,
    };

    onAddCourse(courseToAdd);
    setNewCourse({
      maKhoaHoc: '',
      tenKhoaHoc: '',
      thoiGianBatDau: '',
      thoiGianKetThuc: '',
    });
    setError('');
    onClose();
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Vui lòng chọn một file Excel!');
      return;
    }

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setError('Chỉ hỗ trợ file Excel (.xlsx, .xls)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (!json || json.length <= 1) {
          setError('File Excel không chứa dữ liệu hoặc thiếu hàng dữ liệu!');
          return;
        }

        const header = json[0].map(h => h?.toString().trim());
        const expectedHeader = ['Mã khóa học', 'Tên khóa học', 'Thời gian bắt đầu', 'Thời gian kết thúc'];
        if (!expectedHeader.every((h, i) => h === header[i])) {
          setError('Định dạng cột không đúng! Cần: Mã khóa học, Tên khóa học, Thời gian bắt đầu, Thời gian kết thúc');
          return;
        }

        const imported = [];
        const duplicated = [];
        const invalidRows = [];

        json.slice(1).forEach((row, index) => {
          const maKhoaHoc = row[0]?.toString().trim();
          const tenKhoaHoc = row[1]?.toString().trim();
          const thoiGianBatDau = row[2]?.toString().trim();
          const thoiGianKetThuc = row[3]?.toString().trim();

          // Kiểm tra dữ liệu hợp lệ
          if (!maKhoaHoc || !tenKhoaHoc || !thoiGianBatDau || !thoiGianKetThuc) {
            invalidRows.push(index + 2);
            return;
          }

          const startDate = new Date(thoiGianBatDau);
          const endDate = new Date(thoiGianKetThuc);
          if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) {
            invalidRows.push(index + 2);
            return;
          }

          const isDuplicate = existingCourses.some(
            (course) => course.maKhoaHoc === maKhoaHoc
          );

          if (isDuplicate) {
            duplicated.push(maKhoaHoc);
          } else {
            const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
            imported.push({
              id: Date.now() + Math.random(),
              maKhoaHoc,
              tenKhoaHoc,
              thoiGianBatDau,
              thoiGianKetThuc,
              stt: 0,
              thoiGianTao: currentDateTime,
              thoiGianCapNhat: currentDateTime,
            });
          }
        });

        let errorMessage = '';
        if (duplicated.length > 0) {
          errorMessage += `Các mã khóa học đã tồn tại và bị bỏ qua: ${duplicated.join(', ')}. `;
        }
        if (invalidRows.length > 0) {
          errorMessage += `Các hàng không hợp lệ (thiếu dữ liệu hoặc ngày không hợp lệ): ${invalidRows.join(', ')}.`;
        }

        if (errorMessage) {
          setError(errorMessage);
        }

        if (imported.length > 0) {
          imported.forEach(onAddCourse);
          if (!errorMessage) {
            onClose();
          }
        } else if (!errorMessage) {
          setError('Không có khóa học hợp lệ nào để thêm!');
        }
      } catch (err) {
        console.error('Error reading Excel file:', err);
        setError(`Lỗi khi đọc file Excel: ${err.message}. Vui lòng kiểm tra định dạng file!`);
      }
    };

    reader.onerror = () => {
      setError('Lỗi khi đọc file Excel! Vui lòng thử lại.');
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Thêm khóa học mới</Typography>
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
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Mã khóa học"
            name="maKhoaHoc"
            value={newCourse.maKhoaHoc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Tên khóa học"
            name="tenKhoaHoc"
            value={newCourse.tenKhoaHoc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="thoiGianBatDau"
            type="date"
            value={newCourse.thoiGianBatDau}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Thời gian kết thúc"
            name="thoiGianKetThuc"
            type="date"
            value={newCourse.thoiGianKetThuc}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCourseModal;