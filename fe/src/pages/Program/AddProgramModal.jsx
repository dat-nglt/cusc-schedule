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
    IconButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

const availableTrainingDurations = [
    '2 năm', '2.5 năm', '3 năm', '3.5 năm', '4 năm', '4.5 năm', '5 năm'
];

export default function AddProgramModal({ open, onClose, onAddProgram, existingPrograms }) {
    const [newProgram, setNewProgram] = useState({
        maChuongTrinh: '',
        tenChuongTrinh: '',
        thoiGianDaoTao: '',
        trangThai: 'Đang triển khai',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProgram((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = () => {
        if (
            !newProgram.maChuongTrinh ||
            !newProgram.tenChuongTrinh ||
            !newProgram.thoiGianDaoTao
        ) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const isDuplicate = existingPrograms.some(
            (program) => program.maChuongTrinh === newProgram.maChuongTrinh
        );
        if (isDuplicate) {
            setError(`Mã chương trình "${newProgram.maChuongTrinh}" đã tồn tại!`);
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
        setError('');
        onClose();
    };

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);

            const imported = [];
            const duplicated = [];

            json.forEach((row) => {
                const maChuongTrinh = row['Mã chương trình'];
                const isDuplicate = existingPrograms.some(
                    (program) => program.maChuongTrinh === maChuongTrinh
                );

                if (isDuplicate) {
                    duplicated.push(maChuongTrinh);
                } else {
                    imported.push({
                        id: Date.now() + Math.random(),
                        stt: 0,
                        maChuongTrinh,
                        tenChuongTrinh: row['Tên chương trình'],
                        thoiGianDaoTao: row['Thời gian đào tạo'],
                        trangThai: row['Trạng thái'] || 'Đang triển khai',
                        thoiGianTao: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        thoiGianCapNhat: new Date().toISOString().slice(0, 16).replace('T', ' '),
                    });
                }
            });

            if (duplicated.length > 0) {
                alert(
                    `Các mã chương trình sau đã tồn tại và bị bỏ qua:\n${duplicated.join(', ')}`
                );
            }

            imported.forEach(onAddProgram);
            onClose();
        };

        reader.readAsBinaryString(file);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Thêm chương trình đào tạo mới</Typography>
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
    );
}