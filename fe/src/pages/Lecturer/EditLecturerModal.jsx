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
import { updateLecturer } from '../../api/lecturerAPI';

export default function EditLecturerModal({ open, onClose, lecturer, onSave }) {
    const [editedLecturer, setEditedLecturer] = useState({
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

    useEffect(() => {
        if (lecturer) {
            setEditedLecturer({
                lecturer_id: lecturer.lecturer_id || '',
                name: lecturer.name || '',
                email: lecturer.email || '',
                day_of_birth: lecturer.day_of_birth || '',
                gender: lecturer.gender || '',
                address: lecturer.address || '',
                phone_number: lecturer.phone_number || '',
                department: lecturer.department || '',
                hire_date: lecturer.hire_date || '',
                degree: lecturer.degree || '',
                status: lecturer.status || 'Hoạt động',
            });
        }
    }, [lecturer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLecturer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (
            !editedLecturer.lecturer_id ||
            !editedLecturer.name ||
            !editedLecturer.email ||
            !editedLecturer.day_of_birth ||
            !editedLecturer.gender ||
            !editedLecturer.address ||
            !editedLecturer.phone_number ||
            !editedLecturer.department ||
            !editedLecturer.hire_date ||
            !editedLecturer.degree
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editedLecturer.email)) {
            alert('Email không hợp lệ!');
            return;
        }

        // Kiểm tra số điện thoại format
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(editedLecturer.phone_number)) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }

        // Kiểm tra ngày hợp lệ
        const birthDate = new Date(editedLecturer.day_of_birth);
        const hireDate = new Date(editedLecturer.hire_date);
        const today = new Date();

        if (birthDate >= today) {
            alert('Ngày sinh không hợp lệ!');
            return;
        }

        if (hireDate > today) {
            alert('Ngày tuyển dụng không được là ngày tương lai!');
            return;
        }

        try {
            const updatedLecturerData = {
                lecturer_id: editedLecturer.lecturer_id,
                name: editedLecturer.name,
                email: editedLecturer.email,
                day_of_birth: editedLecturer.day_of_birth,
                gender: editedLecturer.gender,
                address: editedLecturer.address,
                phone_number: editedLecturer.phone_number,
                department: editedLecturer.department,
                hire_date: editedLecturer.hire_date,
                degree: editedLecturer.degree,
                status: editedLecturer.status,
            };

            const response = await updateLecturer(lecturer.lecturer_id, updatedLecturerData);

            if (response && response.data) {
                onSave(response.data.data);
                onClose();
                alert('Cập nhật giảng viên thành công!');
            }
        } catch (error) {
            console.error('Error updating lecturer:', error);
            alert('Lỗi khi cập nhật giảng viên: ' + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa giảng viên</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã giảng viên"
                        name="lecturer_id"
                        value={editedLecturer.lecturer_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Họ tên"
                        name="name"
                        value={editedLecturer.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={editedLecturer.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Ngày sinh"
                        name="day_of_birth"
                        type="date"
                        value={editedLecturer.day_of_birth}
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
                            value={editedLecturer.gender}
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
                        value={editedLecturer.phone_number}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Địa chỉ"
                        name="address"
                        value={editedLecturer.address}
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
                            value={editedLecturer.department}
                            onChange={handleChange}
                            label="Khoa"
                        >
                            <MenuItem value="Khoa Công Nghệ Thông Tin">Khoa Công Nghệ Thông Tin</MenuItem>
                            <MenuItem value="Khoa Kỹ Thuật">Khoa Kỹ Thuật</MenuItem>
                            <MenuItem value="Khoa Quản Trị Kinh Doanh">Khoa Quản Trị Kinh Doanh</MenuItem>
                            <MenuItem value="Khoa Công Nghệ Thực Phẩm">Khoa Công Nghệ Thực Phẩm</MenuItem>
                            <MenuItem value="Khoa Xây Dựng">Khoa Xây Dựng</MenuItem>
                            <MenuItem value="Khoa Cơ Khí">Khoa Cơ Khí</MenuItem>
                            <MenuItem value="Khoa Điện - Điện Tử">Khoa Điện - Điện Tử</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Ngày tuyển dụng"
                        name="hire_date"
                        type="date"
                        value={editedLecturer.hire_date}
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
                            value={editedLecturer.degree}
                            onChange={handleChange}
                            label="Bằng cấp"
                        >
                            <MenuItem value="Cử nhân">Cử nhân</MenuItem>
                            <MenuItem value="Thạc sỹ">Thạc sỹ</MenuItem>
                            <MenuItem value="Tiến sỹ">Tiến sỹ</MenuItem>
                            <MenuItem value="Giáo sư">Giáo sư</MenuItem>
                            <MenuItem value="Phó Giáo sư">Phó Giáo sư</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="status"
                            value={editedLecturer.status}
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
