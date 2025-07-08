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
import PreviewStudentModal from './PreviewStudentModal';
import { processExcelDataStudent } from '../../utils/ExcelValidation';

export default function AddStudentModal({ open, onClose, onAddStudent, existingStudents, error, loading, message }) {
    const [newStudent, setNewStudent] = useState({
        student_id: '',
        name: '',
        email: '',
        day_of_birth: '',
        gender: '',
        address: '',
        phone_number: '',
        class: '',
        admission_year: '',
        status: 'Đang học',
    });

    const [localError, setLocalError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setLocalError('');
    };

    const handleSubmit = async () => {
        if (
            !newStudent.student_id ||
            !newStudent.name ||
            !newStudent.email ||
            !newStudent.day_of_birth ||
            !newStudent.gender ||
            !newStudent.address ||
            !newStudent.phone_number ||
            !newStudent.class ||
            !newStudent.admission_year
        ) {
            setLocalError('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        // Kiểm tra email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newStudent.email)) {
            setLocalError('Email không hợp lệ!');
            return;
        }

        // Kiểm tra số điện thoại format
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(newStudent.phone_number)) {
            setLocalError('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra trùng mã học viên
        const isDuplicate = existingStudents.some(
            (student) => student.student_id === newStudent.student_id
        );
        if (isDuplicate) {
            setLocalError(`Mã học viên "${newStudent.student_id}" đã tồn tại!`);
            return;
        }
        // kiểm tra trùng email
        const isEmailDuplicate = existingStudents.some(
            (student) => student.email === newStudent.email
        );
        if (isEmailDuplicate) {
            setLocalError(`Email "${newStudent.email}" đã tồn tại!`);
            return;
        }
        // kiểm tra trùng số điện thoại
        const isPhoneDuplicate = existingStudents.some(
            (student) => student.phone_number === newStudent.phone_number
        );
        if (isPhoneDuplicate) {
            setLocalError(`Số điện thoại "${newStudent.phone_number}" đã tồn tại!`);
            return;
        }
        // Kiểm tra ngày hợp lệ
        const birthDate = new Date(newStudent.day_of_birth);
        const today = new Date();

        if (birthDate >= today) {
            setLocalError('Ngày sinh không hợp lệ!');
            return;
        }
        const studentToAdd = {
            ...newStudent,
            id: Date.now(),
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onAddStudent được truyền từ component cha
        await onAddStudent(studentToAdd);

        setNewStudent({
            student_id: '',
            name: '',
            email: '',
            day_of_birth: '',
            gender: '',
            address: '',
            phone_number: '',
            class: '',
            admission_year: '',
            status: 'Đang học',
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
            const processedData = processExcelDataStudent(jsonData, existingStudents);

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
            setLocalError('Lỗi khi đọc file Excel! Vui lòng kiểm tra định dạng file.');
        }
        // Reset file input
        e.target.value = '';
    };

    const handleImportSuccess = (result) => {
        const { imported } = result;

        if (imported && imported.length > 0) {
            // Add imported students to the list
            imported.forEach(student => onAddStudent(student));
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
                        <Typography variant="h6">Thêm học viên mới</Typography>
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
                            label="Mã học viên"
                            name="student_id"
                            value={newStudent.student_id}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Họ tên"
                            name="name"
                            value={newStudent.name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={newStudent.email}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Ngày sinh"
                            name="day_of_birth"
                            type="date"
                            value={newStudent.day_of_birth}
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
                                value={newStudent.gender}
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
                            value={newStudent.phone_number}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Địa chỉ"
                            name="address"
                            value={newStudent.address}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            sx={{ gridColumn: { md: 'span 2' } }}
                        />
                        <TextField
                            label="Mã lớp"
                            name="class"
                            value={newStudent.class}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Ngày nhập học"
                            name="admission_year"
                            type="date"
                            value={newStudent.admission_year}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                            disabled={loading}
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={newStudent.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="Đang học">Đang học</MenuItem>
                                <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                                <MenuItem value="Tốt nghiệp">Tốt nghiệp</MenuItem>
                                <MenuItem value="Bảo lưu">Bảo lưu</MenuItem>
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
            <PreviewStudentModal
                open={showPreview}
                onClose={handleClosePreview}
                previewData={previewData}
                onImportSuccess={handleImportSuccess}
                existingStudents={existingStudents}
            />
        </>
    );
}