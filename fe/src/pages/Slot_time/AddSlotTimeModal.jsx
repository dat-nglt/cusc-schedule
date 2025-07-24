import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import PreviewSlotTimeModal from './PreviewSlotTimeModal';
import { processExcelDataTimeslot } from '../../utils/ExcelValidation';

const AddSlotTimeModal = ({ open, onClose, onAddSlotTime, existingSlotTimes = [], error, loading, message, fetchSlotTimes }) => {
  const [newSlotTime, setNewSlotTime] = useState({
    slot_id: '',
    slot_name: '',
    start_time: '',
    end_time: '',
    type: '',
    description: '',
    status: 'Hoạt động',
  });

  const [localError, setLocalError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSlotTime((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async () => {
    if (
      !newSlotTime.slot_id ||
      !newSlotTime.slot_name ||
      !newSlotTime.start_time ||
      !newSlotTime.end_time ||
      !newSlotTime.type
    ) {
      setLocalError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Kiểm tra mã khung giờ có hợp lệ hay không
    const isDuplicate = existingSlotTimes.some(
      (slot) => slot.slot_id === newSlotTime.slot_id
    );

    if (isDuplicate) {
      setLocalError(`Mã khung giờ "${newSlotTime.slot_id}" đã tồn tại!`);
      return;
    }

    const slotTimeToAdd = {
      ...newSlotTime,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Gọi hàm onAddSlotTime được truyền từ component cha
    await onAddSlotTime(slotTimeToAdd);

    setNewSlotTime({
      slot_id: '',
      slot_name: '',
      start_time: '',
      end_time: '',
      type: '',
      description: '',
      status: 'Hoạt động',
    });
    setLocalError('');
    onClose();
  };

  // Hàm xử lý import file Excel
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLocalError('Vui lòng chọn một file Excel!');
      return;
    }

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setLocalError('Chỉ hỗ trợ file Excel (.xlsx, .xls)!');
      return;
    }

    try {
      setLocalError(''); // Clear previous errors
      // Đọc file Excel
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Chuyển đổi sang JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawData.length < 2) {
        setLocalError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
        return;
      }

      // Lấy header và data
      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      // Chuyển đổi thành object với header làm key
      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      // Xử lý và validate dữ liệu
      const processedData = processExcelDataTimeslot(jsonData, existingSlotTimes);

      if (processedData.length === 0) {
        setLocalError('Không có dữ liệu hợp lệ trong file Excel!');
        return;
      }

      // Hiển thị preview
      setPreviewData(processedData);
      setShowPreview(true);
      onClose();

    } catch (error) {
      console.error('Error reading Excel file:', error);
      setLocalError('Lỗi khi đọc file Excel! Vui lòng kiểm tra format file.');
    }

    // Reset file input
    e.target.value = '';
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewData([]);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Thêm khung giờ mới</Typography>
            <label htmlFor="excel-upload-slot">
              <input
                id="excel-upload-slot"
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
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || localError}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Mã khung giờ"
              name="slot_id"
              value={newSlotTime.slot_id}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
            <TextField
              label="Tên khung giờ"
              name="slot_name"
              value={newSlotTime.slot_name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Buổi học</InputLabel>
              <Select
                name="type"
                value={newSlotTime.type}
                onChange={handleChange}
                label="Buổi học"
              >
                <MenuItem value="Sáng">Sáng</MenuItem>
                <MenuItem value="Chiều">Chiều</MenuItem>
                <MenuItem value="Tối">Tối</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Thời gian bắt đầu (HH:mm)"
              name="start_time"
              value={newSlotTime.start_time}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              placeholder="07:00"
            />
            <TextField
              label="Thời gian kết thúc (HH:mm)"
              name="end_time"
              value={newSlotTime.end_time}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              placeholder="09:00"
            />
            <TextField
              label="Mô tả"
              name="description"
              value={newSlotTime.description}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              multiline
              rows={2}
            />
            <FormControl fullWidth required>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={newSlotTime.status}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <PreviewSlotTimeModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        fetchSlotTimes={fetchSlotTimes}
      />
    </>
  );
};

export default AddSlotTimeModal;
