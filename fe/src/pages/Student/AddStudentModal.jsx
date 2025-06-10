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

export default function AddStudentModal({ open, onClose, onAddStudent }) {
    const [newStudent, setNewStudent] = useState({
        maHocVien: '',
        hoTen: '',
        maLop: '',
        khoaHoc: '',
        trangThai: 'Đang học',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (
            !newStudent.maHocVien ||
            !newStudent.hoTen ||
            !newStudent.maLop ||
            !newStudent.khoaHoc
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const studentToAdd = {
            id: Date.now(),
            stt: 0,
            maHocVien: newStudent.maHocVien,
            hoTen: newStudent.hoTen,
            maLop: newStudent.maLop,
            khoaHoc: newStudent.khoaHoc,
            trangThai: newStudent.trangThai,
            thoiGianTao: currentDateTime,
            thoiGianCapNhat: currentDateTime,
        };

        onAddStudent(studentToAdd);
        setNewStudent({
            maHocVien: '',
            hoTen: '',
            maLop: '',
            khoaHoc: '',
            trangThai: 'Đang học',
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Thêm sinh viên mới</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học viên"
                        name="maHocVien"
                        value={newStudent.maHocVien}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Họ tên"
                        name="hoTen"
                        value={newStudent.hoTen}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Mã lớp"
                        name="maLop"
                        value={newStudent.maLop}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Khóa học</InputLabel>
                        <Select
                            name="khoaHoc"
                            value={newStudent.khoaHoc}
                            onChange={handleChange}
                            label="Khóa học"
                        >
                            {availableCourses.map((course) => (
                                <MenuItem key={course} value={course}>
                                    {course}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="trangThai"
                            value={newStudent.trangThai}
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
                <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}>
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    )
}
