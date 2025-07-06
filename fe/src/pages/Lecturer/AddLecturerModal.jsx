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
    Alert,
    CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import PreviewLecturerModal from './PreviewLecturerModal';
import { processExcelDataLecturer } from '../../utils/ExcelValidation';

const availableDepartments = [
    'Khoa Công Nghệ Thông Tin',
    'Khoa Kỹ Thuật',
    'Khoa Quản Trị Kinh Doanh',
    'Khoa Công Nghệ Thực Phẩm',
    'Khoa Xây Dựng',
    'Khoa Cơ Khí',
    'Khoa Điện - Điện Tử'
];

const availableDegrees = [
    'Cử nhân',
    'Thạc sỹ',
    'Tiến sỹ',
    'Giáo sư',
    'Phó Giáo sư'
];

export default function AddLecturerModal({ open, onClose, onAddLecturer, existingLecturers, error, loading, message }) {
    const [newLecturer, setNewLecturer] = useState({
        lecturer_id: '',
        name: '',
        email: '',
        day_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        department: '',
        hire_date: '',
        degree: '',
        status: 'Hoạt động',
    });

    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLecturer((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        if (
            !newLecturer.lecturer_id ||
            !newLecturer.name ||
            !newLecturer.email ||
            !newLecturer.day_of_birth ||
            !newLecturer.gender ||
            !newLecturer.address ||
            !newLecturer.phone_number ||
            !newLecturer.department ||
            !newLecturer.hire_date ||
            !newLecturer.degree
        ) {
            setLocalError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newLecturer.email)) {
            setLocalError('Email không hợp lệ!');
            return;
        }

        // Kiểm tra số điện thoại format
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(newLecturer.phone_number)) {
            setLocalError('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra trùng mã giảng viên
        const isDuplicate = existingLecturers.some(
            (lecturer) => lecturer.lecturer_id === newLecturer.lecturer_id
        );
        if (isDuplicate) {
            setLocalError(`Mã giảng viên "${newLecturer.lecturer_id}" đã tồn tại!`);
            return;
        }

        // Kiểm tra ngày hợp lệ
        const birthDate = new Date(newLecturer.day_of_birth);
        const hireDate = new Date(newLecturer.hire_date);
        const today = new Date();

        if (birthDate >= today) {
            setLocalError('Ngày sinh không hợp lệ!');
            return;
        }

        if (hireDate > today) {
            setLocalError('Ngày tuyển dụng không được là ngày tương lai!');
            return;
        }

        const lecturerToAdd = {
            ...newLecturer,
            id: Date.now(),
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onAddLecturer được truyền từ component cha
        await onAddLecturer(lecturerToAdd);

        setNewLecturer({
            lecturer_id: '',
            name: '',
            email: '',
            day_of_birth: '',
            gender: '',
            address: '',
            phone_number: '',
            department: '',
            hire_date: '',
            degree: '',
            status: 'Hoạt động',
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
            const processedData = processExcelDataLecturer(jsonData, existingLecturers);

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

    const handleImportSuccess = (result) => {
        const { imported } = result;

        if (imported && imported.length > 0) {
            // Add imported lecturers to the list
            imported.forEach(lecturer => onAddLecturer(lecturer));
            onClose();
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
                        <Typography variant="h6">Thêm giảng viên mới</Typography>
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
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                        <TextField
                            label="Mã giảng viên"
                            name="lecturer_id"
                            value={newLecturer.lecturer_id}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Họ tên"
                            name="name"
                            value={newLecturer.name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={newLecturer.email}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Ngày sinh"
                            name="day_of_birth"
                            type="date"
                            value={newLecturer.day_of_birth}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Giới tính</InputLabel>
                            <Select
                                name="gender"
                                value={newLecturer.gender}
                                onChange={handleChange}
                                label="Giới tính"
                            >
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Số điện thoại"
                            name="phone_number"
                            value={newLecturer.phone_number}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Địa chỉ"
                            name="address"
                            value={newLecturer.address}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ gridColumn: { md: 'span 2' } }}
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Khoa</InputLabel>
                            <Select
                                name="department"
                                value={newLecturer.department}
                                onChange={handleChange}
                                label="Khoa"
                            >
                                {availableDepartments.map((dept) => (
                                    <MenuItem key={dept} value={dept}>
                                        {dept}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Ngày tuyển dụng"
                            name="hire_date"
                            type="date"
                            value={newLecturer.hire_date}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Bằng cấp</InputLabel>
                            <Select
                                name="degree"
                                value={newLecturer.degree}
                                onChange={handleChange}
                                label="Bằng cấp"
                            >
                                {availableDegrees.map((degree) => (
                                    <MenuItem key={degree} value={degree}>
                                        {degree}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={newLecturer.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                                <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
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
            <PreviewLecturerModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                onImportSuccess={handleImportSuccess}
                existingLecturers={existingLecturers}
            />
        </>
    );
}