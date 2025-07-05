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
import { importStudents } from '../../api/studentAPI';

const availableCourses = [
    'Công nghệ thông tin',
    'Công nghệ thực phẩm',
    'Kỹ thuật cơ khí',
    'Kỹ thuật điện',
    'Quản lý công nghiệp',
    'Tự động hóa',
    'Quản lý xây dựng',
    'Kỹ thuật điện tử',
    'An toàn thông tin'
];

const validStatuses = ['Đang học', 'Tạm nghỉ', 'Tốt nghiệp', 'Bảo lưu'];

export default function AddStudentModal({ open, onClose, onAddStudent, existingStudents }) {
    const [newStudent, setNewStudent] = useState({
        student_id: '',
        name: '',
        class: '',
        admission_year: '',
        status: 'Đang học',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async () => {
        if (
            !newStudent.student_id ||
            !newStudent.name ||
            !newStudent.class ||
            !newStudent.admission_year
        ) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            setLoading(true);
            await onAddStudent(newStudent);
            setNewStudent({
                student_id: '',
                name: '',
                class: '',
                admission_year: '',
                status: 'Đang học',
            });
            setError('');
            onClose();
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm học viên. Vui lòng thử lại!');
            console.error('Error adding student:', error);
        } finally {
            setLoading(false);
        }
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
            setLoading(true);
            await importStudents(file);
            onClose();
        } catch (error) {
            setError(`Lỗi khi nhập dữ liệu: ${error.message}`);
            console.error('Error importing students:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                            disabled={loading}
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
                        label="Mã học viên"
                        name="student_id"
                        value={newStudent.student_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Họ tên"
                        name="name"
                        value={newStudent.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Mã lớp"
                        name="class"
                        value={newStudent.class}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <FormControl fullWidth required disabled={loading}>
                        <InputLabel>Năm nhập học</InputLabel>
                        <Select
                            name="admission_year"
                            value={newStudent.admission_year}
                            onChange={handleChange}
                            label="Năm nhập học"
                        >
                            {availableCourses.map((course) => (
                                <MenuItem key={course} value={course}>
                                    {course}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required disabled={loading}>
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
                >
                    {loading ? <CircularProgress size={24} /> : 'Thêm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}