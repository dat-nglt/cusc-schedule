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
    CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import PreviewStudentModal from './PreviewStudentModal';
import { processExcelDataStudent } from '../../utils/ExcelValidation';



export default function AddStudentModal({ open, onClose, onAddStudent, existingStudents }) {
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

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setError('');
        setMessage('');
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
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        // Kiểm tra email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newStudent.email)) {
            setError('Email không hợp lệ!');
            return;
        }

        // Kiểm tra số điện thoại format
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(newStudent.phone_number)) {
            setError('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra trùng mã học viên
        const isDuplicate = existingStudents.some(
            (student) => student.student_id === newStudent.student_id
        );
        if (isDuplicate) {
            setError(`Mã học viên "${newStudent.student_id}" đã tồn tại!`);
            return;
        }

        // Kiểm tra ngày hợp lệ
        const birthDate = new Date(newStudent.day_of_birth);
        const today = new Date();

        if (birthDate >= today) {
            setError('Ngày sinh không hợp lệ!');
            return;
        }
        const studentToAdd = {
            ...newStudent,
            id: Date.now(),
            google_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onAddStudent(studentToAdd);
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
        setError('');
        setMessage('');
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
            setError(''); // Clear previous errors
            setMessage(''); // Clear previous messages
            // Đọc file Excel
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Chuyển đổi sang JSON
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (rawData.length < 2) {
                setError('File Excel phải có ít nhất 2 dòng (header + dữ liệu)!');
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
                setError('Không có dữ liệu hợp lệ trong file Excel!');
                return;
            }

            // Hiển thị preview
            setPreviewData(processedData);
            setShowPreview(true);

        } catch (error) {
            console.error('Error reading Excel file:', error);
            setError('Lỗi khi đọc file Excel! Vui lòng kiểm tra định dạng file.');
        }
        // Reset file input
        e.target.value = '';
    };

    const handleImportSuccess = (result) => {
        const { imported, message: resultMessage } = result;

        if (imported && imported.length > 0) {
            // Add imported students to the list
            imported.forEach(student => onAddStudent(student));

            // Hiển thị thông báo thành công
            setMessage(`Thêm thành công ${imported.length} học viên`);
            setError('');
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
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    {message && (
                        <div
                            style={{
                                marginBottom: '16px',
                                color: '#4caf50',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                padding: '8px',
                                backgroundColor: '#f1f8e9',
                                border: '1px solid #4caf50',
                                borderRadius: '4px'
                            }}
                        >
                            {message}
                        </div>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
                            label="Mã lớp"
                            name="class"
                            value={newStudent.class}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Năm nhập học</InputLabel>
                            <Select
                                name="admission_year"
                                value={newStudent.admission_year}
                                onChange={handleChange}
                                label="Năm nhập học"
                            >
                                <MenuItem value="2025">2025</MenuItem>
                                <MenuItem value="2024">2024</MenuItem>
                                <MenuItem value="2023">2023</MenuItem>
                                <MenuItem value="2022">2022</MenuItem>
                                <MenuItem value="2021">2021</MenuItem>
                                <MenuItem value="2020">2020</MenuItem>
                                <MenuItem value="2019">2019</MenuItem>
                            </Select>
                        </FormControl>
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
                    <Button onClick={onClose} variant="outlined" sx={{ color: '#1976d2' }}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                    >
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
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