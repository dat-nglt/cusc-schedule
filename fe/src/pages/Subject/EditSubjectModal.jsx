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

export default function EditSubjectModal({ open, onClose, subject, onSave, error, loading }) {
    const [editedSubject, setEditedSubject] = useState({
        subject_id: '',
        subject_name: '',
        credit: 0,
        theory_hours: 0,
        practice_hours: 0,
        status: 'Hoạt động',
    });

    useEffect(() => {
        if (subject) {
            setEditedSubject({
                subject_id: subject.subject_id || '',
                subject_name: subject.subject_name || '',
                credit: subject.credit || 0,
                theory_hours: subject.theory_hours || 0,
                practice_hours: subject.practice_hours || 0,
                status: subject.status || 'Hoạt động',
            });
        }
    }, [subject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSubject((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (
            !editedSubject.subject_id ||
            !editedSubject.subject_name ||
            editedSubject.credit <= 0 ||
            editedSubject.theory_hours < 0 ||
            editedSubject.practice_hours < 0
        ) {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
            return;
        }

        // Kiểm tra tổng số tiết phải lớn hơn 0
        if (editedSubject.theory_hours + editedSubject.practice_hours === 0) {
            alert('Tổng số tiết lý thuyết và thực hành phải lớn hơn 0!');
            return;
        }

        // Kiểm tra số tín chỉ hợp lệ (thường từ 1-6)
        if (editedSubject.credit < 1 || editedSubject.credit > 6) {
            alert('Số tín chỉ phải từ 1 đến 6!');
            return;
        }

        const updatedSubjectData = {
            subject_id: editedSubject.subject_id,
            subject_name: editedSubject.subject_name,
            credit: parseInt(editedSubject.credit),
            theory_hours: parseInt(editedSubject.theory_hours),
            practice_hours: parseInt(editedSubject.practice_hours),
            status: editedSubject.status,
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onSave được truyền từ component cha
        await onSave(updatedSubjectData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa học phần</Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học phần"
                        name="subject_id"
                        value={editedSubject.subject_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={true}
                    />
                    <TextField
                        label="Tên học phần"
                        name="subject_name"
                        value={editedSubject.subject_name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <TextField
                        label="Số tín chỉ"
                        name="credit"
                        type="number"
                        value={editedSubject.credit}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        inputProps={{ min: 1, max: 6 }}
                    />
                    <TextField
                        label="Số tiết lý thuyết"
                        name="theory_hours"
                        type="number"
                        value={editedSubject.theory_hours}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Số tiết thực hành"
                        name="practice_hours"
                        type="number"
                        value={editedSubject.practice_hours}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        inputProps={{ min: 0 }}
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="status"
                            value={editedSubject.status}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                            <MenuItem value="Tạm dừng">Tạm dừng</MenuItem>
                            <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
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
