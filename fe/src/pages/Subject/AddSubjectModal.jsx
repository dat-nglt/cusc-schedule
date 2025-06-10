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

export default function AddSubjectModal({ open, onClose, onAddSubject }) {
    const [newSubject, setNewSubject] = useState({
        maHocPhan: '',
        tenHocPhan: '',
        soTietLyThuyet: 0,
        soTietThucHanh: 0,
        trangThai: 'Đang hoạt động',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSubject((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (
            !newSubject.maHocPhan ||
            !newSubject.tenHocPhan ||
            newSubject.soTietLyThuyet < 0 ||
            newSubject.soTietThucHanh < 0
        ) {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const subjectToAdd = {
            id: Date.now(),
            stt: 0,
            maHocPhan: newSubject.maHocPhan,
            tenHocPhan: newSubject.tenHocPhan,
            soTietLyThuyet: parseInt(newSubject.soTietLyThuyet),
            soTietThucHanh: parseInt(newSubject.soTietThucHanh),
            trangThai: newSubject.trangThai,
            thoiGianTao: currentDateTime,
            thoiGianCapNhat: currentDateTime,
        };

        onAddSubject(subjectToAdd);
        setNewSubject({
            maHocPhan: '',
            tenHocPhan: '',
            soTietLyThuyet: 0,
            soTietThucHanh: 0,
            trangThai: 'Đang hoạt động',
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Thêm học phần mới</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học phần"
                        name="maHocPhan"
                        value={newSubject.maHocPhan}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Tên học phần"
                        name="tenHocPhan"
                        value={newSubject.tenHocPhan}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Số tiết lý thuyết"
                        name="soTietLyThuyet"
                        type="number"
                        value={newSubject.soTietLyThuyet}
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
                        value={newSubject.soTietThucHanh}
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
                            value={newSubject.trangThai}
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
                    Thêm
                </Button>
            </DialogActions>
        </Dialog>
    )
}
