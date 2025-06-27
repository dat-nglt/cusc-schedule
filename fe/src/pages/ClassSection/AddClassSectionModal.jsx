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
  Typography,
  Box,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const validStatuses = ['Hoạt động', 'Không hoạt động'];

const AddClassSectionModal = ({ open, onClose, onAddClassSection, existingClassSections }) => {
  const [formData, setFormData] = useState({
    maLopHocPhan: '',
    maLopHoc: '',
    maHocPhan: '',
    tenLopHocPhan: '',
    siSoToiDa: '',
    trangThai: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = () => {
    if (!Object.values(formData).every((value) => value)) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const isDuplicate = existingClassSections.some(
      (classSection) => classSection.maLopHocPhan === formData.maLopHocPhan
    );
    if (isDuplicate) {
      setError(`Mã lớp học phần "${formData.maLopHocPhan}" đã tồn tại!`);
      return;
    }

    const siSoToiDa = parseInt(formData.siSoToiDa, 10);
    if (isNaN(siSoToiDa) || siSoToiDa <= 0) {
      setError('Sĩ số tối đa phải là số dương!');
      return;
    }

    onAddClassSection({
      id: Date.now(),
      ...formData,
      siSoToiDa,
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
        const expectedHeader = ['Mã lớp học phần', 'Mã lớp học', 'Mã học phần', 'Tên lớp học phần', 'Sĩ số tối đa', 'Trạng thái'];
        if (!expectedHeader.every((h, i) => h === header[i])) {
          setError('Định dạng cột không đúng! Cần: Mã lớp học phần, Mã lớp học, Mã học phần, Tên lớp học phần, Sĩ số tối đa, Trạng thái');
          return;
        }

        const imported = [];
        const duplicated = [];
        const invalidRows = [];

        json.slice(1).forEach((row, index) => {
          const maLopHocPhan = row[0]?.toString().trim();
          const maLopHoc = row[1]?.toString().trim();
          const maHocPhan = row[2]?.toString().trim();
          const tenLopHocPhan = row[3]?.toString().trim();
          const siSoToiDa = parseInt(row[4], 10);
          const trangThai = row[5]?.toString().trim() || 'Hoạt động';

          // Kiểm tra dữ liệu hợp lệ
          if (!maLopHocPhan || !maLopHoc || !maHocPhan || !tenLopHocPhan || isNaN(siSoToiDa)) {
            invalidRows.push(index + 2);
            return;
          }

          if (siSoToiDa <= 0) {
            invalidRows.push(index + 2);
            return;
          }

          if (!validStatuses.includes(trangThai)) {
            invalidRows.push(index + 2);
            return;
          }

          const isDuplicate = existingClassSections.some(
            (classSection) => classSection.maLopHocPhan === maLopHocPhan
          );

          if (isDuplicate) {
            duplicated.push(maLopHocPhan);
          } else {
            imported.push({
              id: Date.now() + Math.random(),
              maLopHocPhan,
              maLopHoc,
              maHocPhan,
              tenLopHocPhan,
              siSoToiDa,
              trangThai,
              thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
              thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
            });
          }
        });

        let errorMessage = '';
        if (duplicated.length > 0) {
          errorMessage += `Các mã lớp học phần đã tồn tại và bị bỏ qua: ${duplicated.join(', ')}. `;
        }
        if (invalidRows.length > 0) {
          errorMessage += `Các hàng không hợp lệ (thiếu dữ liệu hoặc giá trị không đúng): ${invalidRows.join(', ')}.`;
        }

        if (errorMessage) {
          setError(errorMessage);
        }

        if (imported.length > 0) {
          imported.forEach(onAddClassSection);
          if (!errorMessage) {
            onClose();
          }
        } else if (!errorMessage) {
          setError('Không có lớp học phần hợp lệ nào để thêm!');
        }

        console.log('Imported class sections:', imported);
        console.log('Duplicated class sections:', duplicated);
        console.log('Invalid rows:', invalidRows);
        console.log('Excel header:', header);
        console.log('Raw JSON data:', json);
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
          <Typography variant="h6">Thêm lớp học phần</Typography>
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
        <TextField
          fullWidth
          margin="dense"
          label="Mã lớp học phần"
          name="maLopHocPhan"
          value={formData.maLopHocPhan}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          label="Mã lớp học"
          name="maLopHoc"
          value={formData.maLopHoc}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          label="Mã học phần"
          name="maHocPhan"
          value={formData.maHocPhan}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          label="Tên lớp học phần"
          name="tenLopHocPhan"
          value={formData.tenLopHocPhan}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="dense"
          label="Sĩ số tối đa"
          name="siSoToiDa"
          type="number"
          value={formData.siSoToiDa}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="dense" required>
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

export default AddClassSectionModal;