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
  IconButton,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import { processExcelDataRoom } from '../../utils/ExcelValidation';
import PreviewRoomModal from './PreviewRoomModal';

const AddRoomModal = ({ open, onClose, onAddRoom, existingRooms, error, loading, message, fetchRooms }) => {
  const [formData, setFormData] = useState({
    room_id: '',
    room_name: '',
    location: '',
    capacity: '',
    type: '',
    status: '',
    note: '',
  });

  const [localError, setLocalError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async () => {
    if (!Object.values(formData).every((value) => value)) {
      setLocalError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const isDuplicate = existingRooms.some(
      (room) => room.room_id === formData.room_id
    );
    if (isDuplicate) {
      setLocalError(`Mã phòng học "${formData.room_id}" đã tồn tại!`);
      return;
    }

    const roomToAdd = {
      ...formData,
      capacity: parseInt(formData.capacity) || 0,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await onAddRoom(roomToAdd);

    setFormData({
      room_id: '',
      room_name: '',
      location: '',
      capacity: '',
      type: '',
      status: '',
      note: '',
    });
    setLocalError('');
    onClose();
  };

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
      setLocalError('');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (rawData.length < 2) {
        setLocalError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
        return;
      }

      const headers = rawData[0];
      const dataRows = rawData.slice(1);

      const jsonData = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      const processedData = processExcelDataRoom(jsonData, existingRooms);

      if (processedData.length === 0) {
        setLocalError('Không có dữ liệu hợp lệ trong file Excel!');
        return;
      }

      setPreviewData(processedData);
      setShowPreview(true);
      onClose();

    } catch (error) {
      console.error('Error reading Excel file:', error);
      setLocalError('Lỗi khi đọc file Excel! Vui lòng kiểm tra format file.');
    }

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
            <Typography variant="h6">Thêm phòng học</Typography>
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
              fullWidth
              label="Mã phòng học"
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Tên phòng học"
              name="room_name"
              value={formData.room_name}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Vị trí"
              name="location"
              placeholder="Ví dụ: Tầng 2, Tòa A"
              value={formData.location}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Sức chứa"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <FormControl fullWidth required>
              <InputLabel id="loai-phong-hoc-label">Loại phòng học</InputLabel>
              <Select
                labelId="loai-phong-hoc-label"
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Loại phòng học"
              >
                <MenuItem value="Lý thuyết">Lý thuyết</MenuItem>
                <MenuItem value="Thực hành">Thực hành</MenuItem>
                {/* <MenuItem value="Phòng hội thảo">Phòng hội thảo</MenuItem> */}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="trang-thai-label">Trạng thái</InputLabel>
              <Select
                labelId="trang-thai-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="Sẵn sàng">Sẵn sàng</MenuItem>
                <MenuItem value="Bảo trì">Bảo trì</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Ghi chú"
              name="note"
              multiline
              rows={2}
              value={formData.note}
              onChange={handleChange}
              variant="outlined"
            />
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
      <PreviewRoomModal
        open={showPreview}
        onClose={handleClosePreview}
        previewData={previewData}
        fetchRooms={fetchRooms}
      />
    </>
  );
};

export default AddRoomModal;
