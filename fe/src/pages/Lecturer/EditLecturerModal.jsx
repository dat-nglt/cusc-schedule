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
    Chip,
    OutlinedInput,
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const availableSubjects = [
    'Hệ thống thông tin', 'Phân tích thiết kế hệ thống', 'Công nghệ thực phẩm',
    'Hóa học thực phẩm', 'Kỹ thuật hệ thống công nghiệp', 'Tự động hóa công nghiệp',
    'Công nghệ kỹ thuật điện, điện tử', 'Mạch điện tử', 'Kỹ thuật phần mềm',
    'Lập trình Java', 'Quản lý công nghiệp', 'Quản trị doanh nghiệp',
    'Công nghệ kỹ thuật điều khiển và tự động hóa', 'PLC', 'Quản lý xây dựng',
    'Kinh tế xây dựng', 'Khoa học máy tính', 'Cấu trúc dữ liệu',
    'Công nghệ kỹ thuật cơ điện tử', 'Robot học'
];

export default function EditLecturerModal({ open, onClose, lecturer, onSave }) {
    const [editedLecturer, setEditedLecturer] = useState({
        maGiangVien: '',
        hoTen: '',
        monGiangDay: [],
        email: '',
        soDienThoai: '',
        trangThai: 'Hoạt động',
    });

    useEffect(() => {
        if (lecturer) {
            setEditedLecturer({
                maGiangVien: lecturer.maGiangVien || '',
                hoTen: lecturer.hoTen || '',
                monGiangDay: lecturer.monGiangDay || [],
                email: lecturer.lienHe?.email || '',
                soDienThoai: lecturer.lienHe?.soDienThoai || '',
                trangThai: lecturer.trangThai || 'Hoạt động',
            });
        }
    }, [lecturer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLecturer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (event) => {
        const { value } = event.target;
        setEditedLecturer((prev) => ({
            ...prev,
            monGiangDay: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleSubmit = () => {
        if (
            !editedLecturer.maGiangVien ||
            !editedLecturer.hoTen ||
            editedLecturer.monGiangDay.length === 0 ||
            !editedLecturer.email ||
            !editedLecturer.soDienThoai
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
        if (!phoneRegex.test(editedLecturer.soDienThoai)) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }

        const currentDateTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const updatedLecturer = {
            ...lecturer,
            maGiangVien: editedLecturer.maGiangVien,
            hoTen: editedLecturer.hoTen,
            monGiangDay: editedLecturer.monGiangDay,
            lienHe: {
                email: editedLecturer.email,
                soDienThoai: editedLecturer.soDienThoai
            },
            trangThai: editedLecturer.trangThai,
            thoiGianCapNhat: currentDateTime,
        };

        onSave(updatedLecturer);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa giảng viên</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã giảng viên"
                        name="maGiangVien"
                        value={editedLecturer.maGiangVien}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Họ tên"
                        name="hoTen"
                        value={editedLecturer.hoTen}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Môn giảng dạy</InputLabel>
                        <Select
                            multiple
                            value={editedLecturer.monGiangDay}
                            onChange={handleSubjectChange}
                            input={<OutlinedInput label="Môn giảng dạy" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} size="small" />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {availableSubjects.map((subject) => (
                                <MenuItem key={subject} value={subject}>
                                    {subject}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        label="Số điện thoại"
                        name="soDienThoai"
                        value={editedLecturer.soDienThoai}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="trangThai"
                            value={editedLecturer.trangThai}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                            <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                            <MenuItem value="Đang dạy">Đang dạy</MenuItem>
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
