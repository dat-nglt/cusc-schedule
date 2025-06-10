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

export default function EditSubjectModal({ open, onClose, subject, onSave }) {
    const [editedSubject, setEditedSubject] = useState({
        maHocPhan: '',
        tenHocPhan: '',
        soTietLyThuyet: 0,
        soTietThucHanh: 0,
        trangThai: 'Đang hoạt động',
    });

    useEffect(() => {
        if (subject) {
            setEditedSubject({
                maHocPhan: subject.maHocPhan || '',
                tenHocPhan: subject.tenHocPhan || '',
                soTietLyThuyet: subject.soTietLyThuyet || 0,
                soTietThucHanh: subject.soTietThucHanh || 0,
                trangThai: subject.trangThai || 'Đang hoạt động',
            });
        }
    }, [subject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSubject((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (
            !editedSubject.maHocPhan ||
            !editedSubject.tenHocPhan ||
            editedSubject.soTietLyThuyet < 0 ||
            editedSubject.soTietThucHanh < 0
        ) {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const updatedSubject = {
            ...subject,
            maHocPhan: editedSubject.maHocPhan,
            tenHocPhan: editedSubject.tenHocPhan,
            soTietLyThuyet: parseInt(editedSubject.soTietLyThuyet),
            soTietThucHanh: parseInt(editedSubject.soTietThucHanh),
            trangThai: editedSubject.trangThai,
            thoiGianCapNhat: currentDateTime,
        };

        onSave(updatedSubject);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa học phần</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học phần"
                        name="maHocPhan"
                        value={editedSubject.maHocPhan}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Tên học phần"
                        name="tenHocPhan"
                        value={editedSubject.tenHocPhan}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Số tiết lý thuyết"
                        name="soTietLyThuyet"
                        type="number"
                        value={editedSubject.soTietLyThuyet}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Số tiết thực hành"
                        name="soTietThucHanh"
                        type="number"
                        value={editedSubject.soTietThucHanh}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        inputProps={{ min: 0 }}
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="trangThai"
                            value={editedSubject.trangThai}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
                            <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                            <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
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
