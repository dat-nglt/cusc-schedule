import React, { useState, useEffect } from 'react';
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

export default function EditStudentModal({ open, onClose, student, onSave }) {
    const [editedStudent, setEditedStudent] = useState({
        maHocVien: '',
        hoTen: '',
        maLop: '',
        khoaHoc: '',
        trangThai: 'Đang học',
    });

    useEffect(() => {
        if (student) {
            setEditedStudent({
                maHocVien: student.maHocVien || '',
                hoTen: student.hoTen || '',
                maLop: student.maLop || '',
                khoaHoc: student.khoaHoc || '',
                trangThai: student.trangThai || 'Đang học',
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (
            !editedStudent.maHocVien ||
            !editedStudent.hoTen ||
            !editedStudent.maLop ||
            !editedStudent.khoaHoc
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const updatedStudent = {
            ...student,
            maHocVien: editedStudent.maHocVien,
            hoTen: editedStudent.hoTen,
            maLop: editedStudent.maLop,
            khoaHoc: editedStudent.khoaHoc,
            trangThai: editedStudent.trangThai,
            thoiGianCapNhat: currentDateTime,
        };

        onSave(updatedStudent);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa sinh viên</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học viên"
                        name="maHocVien"
                        value={editedStudent.maHocVien}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Họ tên"
                        name="hoTen"
                        value={editedStudent.hoTen}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Mã lớp"
                        name="maLop"
                        value={editedStudent.maLop}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Khóa học</InputLabel>
                        <Select
                            name="khoaHoc"
                            value={editedStudent.khoaHoc}
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
                            value={editedStudent.trangThai}
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
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    )
}
