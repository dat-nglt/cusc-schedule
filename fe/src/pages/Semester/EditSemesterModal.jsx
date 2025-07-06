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

export default function EditSemesterModal({ open, onClose, semester, onSave, error, loading }) {
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

    const handleSubmit = async () => {
        if (
            !editedSemester.semester_id ||
            !editedSemester.semester_name ||
            !editedSemester.start_date ||
            !editedSemester.end_date ||
            !editedSemester.status
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra ngày hợp lệ
        const startDate = new Date(editedSemester.start_date);
        const endDate = new Date(editedSemester.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        if (startDate >= endDate) {
            alert('Ngày bắt đầu phải trước ngày kết thúc!');
            return;
        }

        // Kiểm tra ngày bắt đầu không được trong quá khứ (chỉ với học kỳ mới)
        if (editedSemester.status === 'Đang triển khai' && startDate < today) {
            alert('Ngày bắt đầu không được là ngày trong quá khứ!');
            return;
        }

        // Kiểm tra ngày kết thúc không được trong quá khứ
        if (endDate < today && editedSemester.status !== 'Kết thúc') {
            alert('Ngày kết thúc không được là ngày trong quá khứ!');
            return;
        }

        const updatedSemesterData = {
            semester_id: editedSemester.semester_id,
            semester_name: editedSemester.semester_name,
            start_date: editedSemester.start_date,
            end_date: editedSemester.end_date,
            status: editedSemester.status,
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onSave được truyền từ component cha
        await onSave(updatedSemesterData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa học kỳ</Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
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

                    <FormControl fullWidth required sx={{ gridColumn: { md: 'span 2' } }}>
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
    )
}
