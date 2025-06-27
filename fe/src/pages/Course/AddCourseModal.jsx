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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const validStatuses = ['Hoạt động', 'Ngừng hoạt động'];

export default function AddCourseModal({ open, onClose, onAddCourse, existingCourses }) {
  const [newCourse, setNewCourse] = useState({
    course_id: '',
    course_name: '',
    start_date: '',
    end_date: '',
    status: 'Hoạt động',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = () => {
    if (!newCourse.course_id || !newCourse.course_name || !newCourse.start_date || !newCourse.end_date) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const startDate = new Date(newCourse.start_date);
    const endDate = new Date(newCourse.end_date);
    const today = new Date();
    const maxFutureDate = new Date(today);
    maxFutureDate.setFullYear(today.getFullYear() + 5);

    if (isNaN(startDate) || isNaN(endDate)) {
      setError('Định dạng ngày không hợp lệ!');
      return;
    }

    if (startDate > endDate) {
      setError('Thời gian bắt đầu không được lớn hơn thời gian kết thúc!');
      return;
    }

    if (endDate > maxFutureDate) {
      setError('Thời gian kết thúc không được quá 5 năm trong tương lai!');
      return;
    }

    const isDuplicate = existingCourses.some((course) => course.course_id === newCourse.course_id);
    if (isDuplicate) {
      setError(`Mã khóa học "${newCourse.course_id}" đã tồn tại!`);
      return;
    }

    const courseToAdd = {
      ...newCourse,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAddCourse(courseToAdd);
    setNewCourse({
      course_id: '',
      course_name: '',
      start_date: '',
      end_date: '',
      status: 'Hoạt động',
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
        const expectedHeader = ['Mã khóa học', 'Tên khóa học', 'Thời gian bắt đầu', 'Thời gian kết thúc', 'Trạng thái'];
        if (!expectedHeader.every((h, i) => h === header[i])) {
          setError('Định dạng cột không đúng! Cần: Mã khóa học, Tên khóa học, Thời gian bắt đầu, Thời gian kết thúc, Trạng thái');
          return;
        }

        const imported = [];
        const duplicated = [];
        const invalidRows = [];

        json.slice(1).forEach((row, index) => {
          const course_id = row[0]?.toString().trim();
          const course_name = row[1]?.toString().trim();
          const start_date = row[2]?.toString().trim();
          const end_date = row[3]?.toString().trim();
          const status = row[4]?.toString().trim() || 'Hoạt động';

          if (!course_id || !course_name || !start_date || !end_date) {
            invalidRows.push(index + 2);
            return;
          }

          if (!validStatuses.includes(status)) {
            invalidRows.push(index + 2);
            return;
          }

          const startDate = new Date(start_date);
          const endDate = new Date(end_date);
          const today = new Date();
          const maxFutureDate = new Date(today);
          maxFutureDate.setFullYear(today.getFullYear() + 5);

          if (isNaN(startDate) || isNaN(endDate)) {
            invalidRows.push(index + 2);
            return;
          }

          if (startDate > endDate) {
            invalidRows.push(index + 2);
            return;
          }

          if (endDate > maxFutureDate) {
            invalidRows.push(index + 2);
            return;
          }

          const isDuplicate = existingCourses.some((course) => course.course_id === course_id);
          if (isDuplicate) {
            duplicated.push(course_id);
          } else {
            imported.push({
              id: Date.now() + Math.random(),
              course_id,
              course_name,
              start_date,
              end_date,
              status,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        });

        let errorMessage = '';
        if (duplicated.length > 0) {
          errorMessage += `Các mã khóa học đã tồn tại và bị bỏ qua: ${duplicated.join(', ')}. `;
        }
        if (invalidRows.length > 0) {
          errorMessage += `Các hàng không hợp lệ: ${invalidRows.join(', ')}.`;
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
          <TextField
            label="Mã khóa học"
            name="course_id"
            value={newCourse.course_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Tên khóa học"
            name="course_name"
            value={newCourse.course_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            label="Thời gian bắt đầu"
            name="start_date"
            type="date"
            value={newCourse.start_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Thời gian kết thúc"
            name="end_date"
            type="date"
            value={newCourse.end_date}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth required>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={newCourse.status}
              onChange={handleChange}
              label="Trạng thái"
            >
              <MenuItem value="Hoạt động">Hoạt động</MenuItem>
              <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>
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
}