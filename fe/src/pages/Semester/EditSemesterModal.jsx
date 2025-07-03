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
import { updateSemester } from '../../api/semesterAPI';

export default function EditSemesterModal({ open, onClose, semester, onSave }) {
    const [editedSemester, setEditedSemester] = useState({
        semester_id: '',
        semester_name: '',
        start_date: '',
        end_date: '',
        program_id: '',
        status: 'Đang triển khai',
    });

    useEffect(() => {
        if (semester) {
            setEditedSemester({
                semester_id: semester.semester_id || '',
                semester_name: semester.semester_name || '',
                start_date: semester.start_date || '',
                end_date: semester.end_date || '',
                status: semester.status || 'Đang triển khai',
            });
        }
    }, [semester]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSemester((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (
            !editedSemester.semester_id ||
            !editedSemester.semester_name ||
            !editedSemester.start_date ||
            !editedSemester.end_date
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        try {
            const updatedSemester = {
                ...semester,
                semester_id: editedSemester.semester_id,
                semester_name: editedSemester.semester_name,
                start_date: editedSemester.start_date,
                end_date: editedSemester.end_date,
                status: editedSemester.status,
                updated_at: new Date().toISOString(),
            };

            const response = updateSemester(semester.semester_id, updatedSemester);
            if (response && response.data.data) {
                onSave(response.data.data);
                onClose();
                alert('Cập nhật học kỳ thành công!');
            }
        } catch (error) {
            console.error('Error updating semester:', error);
            alert('Lỗi khi cập nhật học kỳ: ' + error.message);
        };
    }


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa học kỳ</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học kỳ"
                        name="semester_id"
                        value={editedSemester.semester_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={true}
                    />
                    <TextField
                        label="Tên học kỳ"
                        name="semester_name"
                        value={editedSemester.semester_name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Ngày bắt đầu"
                        name="start_date"
                        type="date"
                        value={editedSemester.start_date}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Ngày kết thúc"
                        name="end_date"
                        type="date"
                        value={editedSemester.end_date}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="status"
                            value={editedSemester.status}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Đang triển khai">Đang triển khai</MenuItem>
                            <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                            <MenuItem value="Ngừng hoạt động">Ngừng Hoạt động</MenuItem>
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
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    )
}
