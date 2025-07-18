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
    Alert,
    CircularProgress,
} from '@mui/material';

export default function EditStudentModal({ open, onClose, student, onSave, error, loading }) {
    const [editedStudent, setEditedStudent] = useState({
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

    useEffect(() => {
        if (student) {
            setEditedStudent({
                student_id: student.student_id || '',
                name: student.name || '',
                email: student.email || '',
                day_of_birth: student.day_of_birth || '',
                gender: student.gender || '',
                address: student.address || '',
                phone_number: student.phone_number || '',
                class: student.class || '',
                admission_year: student.admission_year || '',
                status: student.status || 'Đang học',
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (
            !editedStudent.student_id ||
            !editedStudent.name ||
            !editedStudent.email ||
            !editedStudent.day_of_birth ||
            !editedStudent.gender ||
            !editedStudent.address ||
            !editedStudent.phone_number ||
            !editedStudent.class ||
            !editedStudent.admission_year
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedStudent.email)) {
            alert('Email không hợp lệ!');
            return;
        }

        // Kiểm tra số điện thoại format
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(editedStudent.phone_number)) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra ngày hợp lệ
        const birthDate = new Date(editedStudent.day_of_birth);
        const admissionDate = new Date(editedStudent.admission_year);
        const today = new Date();

        if (birthDate >= today) {
            alert('Ngày sinh không hợp lệ!');
            return;
        }

        if (admissionDate > today) {
            alert('Ngày nhập học không được là ngày tương lai!');
            return;
        }

        const updatedStudentData = {
            student_id: editedStudent.student_id,
            name: editedStudent.name,
            email: editedStudent.email,
            day_of_birth: editedStudent.day_of_birth,
            gender: editedStudent.gender,
            address: editedStudent.address,
            phone_number: editedStudent.phone_number,
            class: editedStudent.class,
            admission_year: editedStudent.admission_year,
            status: editedStudent.status,
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onSave được truyền từ component cha
        await onSave(updatedStudentData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa sinh viên</Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học viên"
                        name="student_id"
                        value={editedStudent.student_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={true}
                    />
                    <TextField
                        label="Họ tên"
                        name="name"
                        value={editedStudent.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={editedStudent.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Ngày sinh"
                        name="day_of_birth"
                        type="date"
                        value={editedStudent.day_of_birth}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth required disabled={loading}>
                        <InputLabel>Giới tính</InputLabel>
                        <Select
                            name="gender"
                            value={editedStudent.gender}
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
                        value={editedStudent.phone_number}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Địa chỉ"
                        name="address"
                        value={editedStudent.address}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                        sx={{ gridColumn: { md: 'span 2' } }}
                    />
                    <TextField
                        label="Mã lớp"
                        name="class"
                        value={editedStudent.class}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Ngày nhập học"
                        name="admission_year"
                        type="date"
                        value={editedStudent.admission_year}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth required disabled={loading}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="status"
                            value={editedStudent.status}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Đang học">Đang học</MenuItem>
                            <MenuItem value="Đã nghỉ học">Đã nghỉ học</MenuItem>
                            <MenuItem value="Đã tốt nghiệp">Đã tốt nghiệp</MenuItem>
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
                    {loading ? 'Đang lưu...' : 'Lưu'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
