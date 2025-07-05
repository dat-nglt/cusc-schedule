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
import PreviewBreakScheduleModal from './PreviewBreakScheduleModal';

const validStatuses = ['Hoạt động', 'Ngừng hoạt động'];

export default function AddBreakScheduleModal({ open, onClose, onAddBreakSchedule, onImportSuccess, existingBreakSchedules }) {
  const [newBreakSchedule, setNewBreakSchedule] = useState({
    break_id: '',
    break_type: '',
    break_start_date: '',
    break_end_date: '',
    status: 'Hoạt động',
  });

  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBreakSchedule((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = () => {
    if (!newBreakSchedule.break_id || !newBreakSchedule.break_type || !newBreakSchedule.break_start_date || !newBreakSchedule.break_end_date) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const startDate = new Date(newBreakSchedule.break_start_date);
    const endDate = new Date(newBreakSchedule.break_end_date);
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

    const isDuplicate = existingBreakSchedules.some((schedule) => schedule.break_id === newBreakSchedule.break_id);
    if (isDuplicate) {
      setError(`Mã lịch nghỉ "${newBreakSchedule.break_id}" đã tồn tại!`);
      return;
    }

    const scheduleToAdd = {
      ...newBreakSchedule,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAddBreakSchedule(scheduleToAdd);
    setNewBreakSchedule({
      break_id: '',
      break_type: '',
      break_start_date: '',
      break_end_date: '',
      status: 'Hoạt động',
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
      const expectedHeader = ['Mã lịch nghỉ', 'Loại lịch nghỉ', 'Thời gian bắt đầu', 'Thời gian kết thúc', 'Trạng thái'];
      if (!expectedHeader.every((h, i) => h === headers[i])) {
        setError('Định dạng cột không đúng! Cần: Mã lịch nghỉ, Loại lịch nghỉ, Thời gian bắt đầu, Thời gian kết thúc, Trạng thái');
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
        break_id: row['Mã lịch nghỉ'] || '',
        break_type: row['Loại lịch nghỉ'] || '',
        break_start_date: row['Thời gian bắt đầu'] || '',
        break_end_date: row['Thời gian kết thúc'] || '',
        status: row['Trạng thái'] || 'Hoạt động',
        rowIndex: index + 2,
        errors: [],
      }));

      const errors = [];
      processedData.forEach((schedule, index) => {
        if (!schedule.break_id || !schedule.break_type || !schedule.break_start_date || !schedule.break_end_date) {
          schedule.errors.push('missing_required');
          errors.push(index + 2);
        }
        const startDate = new Date(schedule.break_start_date);
        const endDate = new Date(schedule.break_end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5);
        if (isNaN(startDate) || isNaN(endDate)) {
          schedule.errors.push('invalid_date');
          errors.push(index + 2);
        } else if (startDate > endDate) {
          schedule.errors.push('invalid_date');
          errors.push(index + 2);
        } else if (endDate > maxFutureDate) {
          schedule.errors.push('invalid_date');
          errors.push(index + 2);
        }
        if (!validStatuses.includes(schedule.status)) {
          schedule.errors.push('invalid_status');
          errors.push(index + 2);
        }
        const isDuplicate = existingBreakSchedules.some(s => s.break_id === schedule.break_id);
        if (isDuplicate) {
          schedule.errors.push('duplicate_id');
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
      onImportSuccess(); // Call fetchBreakSchedules to refresh the list
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
            <Typography variant="h6">Thêm lịch nghỉ mới</Typography>
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
              label="Mã lịch nghỉ"
              name="break_id"
              value={newBreakSchedule.break_id}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Loại lịch nghỉ"
              name="break_type"
              value={newBreakSchedule.break_type}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Thời gian bắt đầu"
              name="break_start_date"
              type="date"
              value={newBreakSchedule.break_start_date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Thời gian kết thúc"
              name="break_end_date"
              type="date"
              value={newBreakSchedule.break_end_date}
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
                value={newBreakSchedule.status}
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

      <PreviewBreakScheduleModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        onImportSuccess={handleImportSuccess}
      />
    </>
  );
}