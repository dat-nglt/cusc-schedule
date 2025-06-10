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

const availableTrainingDurations = [
    '2 năm', '2.5 năm', '3 năm', '3.5 năm', '4 năm', '4.5 năm', '5 năm'
];

export default function AddProgramModal({ open, onClose, onAddProgram }) {
    const [newProgram, setNewProgram] = useState({
        maChuongTrinh: '',
        tenChuongTrinh: '',
        thoiGianDaoTao: '',
        trangThai: 'Đang triển khai',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProgram((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (
            !newProgram.maChuongTrinh ||
            !newProgram.tenChuongTrinh ||
            !newProgram.thoiGianDaoTao
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const programToAdd = {
            id: Date.now(),
            stt: 0,
            maChuongTrinh: newProgram.maChuongTrinh,
            tenChuongTrinh: newProgram.tenChuongTrinh,
            thoiGianDaoTao: newProgram.thoiGianDaoTao,
            trangThai: newProgram.trangThai,
            thoiGianTao: currentDateTime,
            thoiGianCapNhat: currentDateTime,
        };

        onAddProgram(programToAdd);
        setNewProgram({
            maChuongTrinh: '',
            tenChuongTrinh: '',
            thoiGianDaoTao: '',
            trangThai: 'Đang triển khai',
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Thêm chương trình đào tạo mới</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã chương trình"
                        name="maChuongTrinh"
                        value={newProgram.maChuongTrinh}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Tên chương trình"
                        name="tenChuongTrinh"
                        value={newProgram.tenChuongTrinh}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Thời gian đào tạo</InputLabel>
                        <Select
                            name="thoiGianDaoTao"
                            value={newProgram.thoiGianDaoTao}
                            onChange={handleChange}
                            label="Thời gian đào tạo"
                        >
                            {availableTrainingDurations.map((duration) => (
                                <MenuItem key={duration} value={duration}>
                                    {duration}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="trangThai"
                            value={newProgram.trangThai}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Đang triển khai">Đang triển khai</MenuItem>
                            <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                            <MenuItem value="Kết thúc">Kết thúc</MenuItem>
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
