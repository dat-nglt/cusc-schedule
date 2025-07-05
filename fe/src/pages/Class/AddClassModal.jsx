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
  Autocomplete,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import PreviewClassModal from './PreviewClassModal';

const validStatuses = ['Hoạt động', 'Ngừng hoạt động'];

export default function AddClassModal({ open, onClose, onAddClass, onImportSuccess, existingClasses, existingCourses }) {
  const [newClass, setNewClass] = useState({
    class_id: '',
    class_name: '',
    class_size: '',
    status: 'Hoạt động',
    course_id: '',
  });

  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCourseChange = (event, newValue) => {
    setNewClass((prev) => ({ ...prev, course_id: newValue ? newValue.course_id : '' }));
    setError('');
  };

  const handleSubmit = () => {
    if (!newClass.class_id || !newClass.class_name || !newClass.class_size || !newClass.course_id) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const classSize = parseInt(newClass.class_size, 10);
    if (isNaN(classSize) || classSize <= 0) {
      setError('Sĩ số phải là số nguyên dương!');
      return;
    }

    const isDuplicate = (existingClasses || []).some((classItem) => classItem.class_id === newClass.class_id);
    if (isDuplicate) {
      setError(`Mã lớp học "${newClass.class_id}" đã tồn tại!`);
      return;
    }

    const classToAdd = {
      ...newClass,
      class_size: classSize,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAddClass(classToAdd);
    setNewClass({
      class_id: '',
      class_name: '',
      class_size: '',
      status: 'Hoạt động',
      course_id: '',
    });
    setError('');
    onClose();
  };

  const handleImportExcel = async (e) => {
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

    try {
      setError('');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawData.length < 2) {
        setError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
        return;
      }

      const headers = rawData[0];
      const expectedHeader = ['Mã lớp học', 'Tên lớp học', 'Sĩ số', 'Trạng thái', 'Mã khóa học'];
      if (!expectedHeader.every((h, i) => h === headers[i])) {
        setError('Định dạng cột không đúng! Cần: Mã lớp học, Tên lớp học, Sĩ số, Trạng thái, Mã khóa học');
        return;
      }

      const dataRows = rawData.slice(1);
      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      const processedData = jsonData.map((row, index) => ({
        class_id: row['Mã lớp học'] || '',
        class_name: row['Tên lớp học'] || '',
        class_size: row['Sĩ số'] || '',
        status: row['Trạng thái'] || 'Hoạt động',
        course_id: row['Mã khóa học'] || '',
        rowIndex: index + 2,
        errors: [],
      }));

      const errors = [];
      processedData.forEach((classItem, index) => {
        if (!classItem.class_id || !classItem.class_name || !classItem.class_size || !classItem.course_id) {
          classItem.errors.push('missing_required');
          errors.push(index + 2);
        }
        const classSize = parseInt(classItem.class_size, 10);
        if (isNaN(classSize) || classSize <= 0) {
          classItem.errors.push('invalid_size');
          errors.push(index + 2);
        }
        if (!validStatuses.includes(classItem.status)) {
          classItem.errors.push('invalid_status');
          errors.push(index + 2);
        }
        const isDuplicate = (existingClasses || []).some(c => c.class_id === classItem.class_id);
        if (isDuplicate) {
          classItem.errors.push('duplicate_id');
          errors.push(index + 2);
        }
      });

      if (errors.length > 0) {
        setError(`Các hàng không hợp lệ: ${errors.join(', ')}`);
      }

      setPreviewData(processedData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      setError('Lỗi khi đọc file Excel! Vui lòng kiểm tra format file.');
    }

    e.target.value = '';
  };

  const handleImportSuccess = (result) => {
    const { imported, message: resultMessage } = result;

    if (imported && imported.length > 0) {
      setError('');
      onImportSuccess(); // Call fetchClasses to refresh the list
    } else if (resultMessage) {
      setError(resultMessage);
    }

    setShowPreview(false);
    setPreviewData([]);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewData([]);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Thêm lớp học mới</Typography>
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
              label="Mã lớp học"
              name="class_id"
              value={newClass.class_id}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Tên lớp học"
              name="class_name"
              value={newClass.class_name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Sĩ số"
              name="class_size"
              type="number"
              value={newClass.class_size}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
            <FormControl fullWidth required>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={newClass.status}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
            <Autocomplete
              options={existingCourses || []}
              getOptionLabel={(option) => option.course_id || ''}
              value={existingCourses?.find((c) => c.course_id === newClass.course_id) || null}
              onChange={handleCourseChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Mã khóa học"
                  name="course_id"
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
              freeSolo // Cho phép nhập thủ công
              renderOption={(props, option) => (
                <li {...props}>
                  {option.course_id} - {option.course_name}
                </li>
              )}
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

      <PreviewClassModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
}