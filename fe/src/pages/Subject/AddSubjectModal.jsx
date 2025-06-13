import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, TextField, Button, Box, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';

export default function AddSubjectModal({ open, onClose, onAddSubject, existingSubjects = [] }) {
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

        const isDuplicate = existingSubjects.some(subject => subject.maHocPhan === newSubject.maHocPhan);
        if (isDuplicate) {
            alert(`Mã học phần "${newSubject.maHocPhan}" đã tồn tại!`);
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

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);

            const imported = [];
            const duplicated = [];

            rows.forEach((row) => {
                const maHocPhan = row['Mã học phần'];
                if (existingSubjects.some(sub => sub.maHocPhan === maHocPhan)) {
                    duplicated.push(maHocPhan);
                } else {
                    imported.push({
                        id: Date.now() + Math.random(),
                        stt: 0,
                        maHocPhan,
                        tenHocPhan: row['Tên học phần'],
                        soTietLyThuyet: parseInt(row['Số tiết lý thuyết']) || 0,
                        soTietThucHanh: parseInt(row['Số tiết thực hành']) || 0,
                        trangThai: row['Trạng thái'] || 'Đang hoạt động',
                        thoiGianTao: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        thoiGianCapNhat: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    });
                }
            });

            if (duplicated.length > 0) {
                alert(`Bỏ qua mã học phần đã tồn tại:\n${duplicated.join(', ')}`);
            }

            imported.forEach(onAddSubject);
            onClose();
        };

        reader.readAsBinaryString(file);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    Thêm học phần mới
                    <label htmlFor="upload-subject-excel">
                        <input
                            id="upload-subject-excel"
                            type="file"
                            hidden
                            accept=".xlsx, .xls"
                            onChange={handleImportExcel}
                        />
                        <Button
                            variant="outlined"
                            component="span"
                            size="small"
                            startIcon={<UploadFileIcon />}
                        >
                            Thêm tự động
                        </Button>
                    </label>
                </Box>
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
    );
}
