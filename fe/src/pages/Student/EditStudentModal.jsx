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
    CircularProgress,
} from '@mui/material';

export default function EditStudentModal({ open, onClose, student, onSave }) {
    const [editedStudent, setEditedStudent] = useState({
        student_id: '',
        name: '',
        class: '',
        admission_year: '',
        status: 'Đang học',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (student) {
            setEditedStudent({
                student_id: student.student_id || '',
                name: student.name || '',
                class: student.class || '',
                admission_year: student.admission_year || '',
                status: student.status || 'Đang học',
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedStudent((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async () => {
        if (
            !editedStudent.student_id ||
            !editedStudent.name ||
            !editedStudent.class ||
            !editedStudent.admission_year
        ) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const updatedStudentData = {
                student_id: editedStudent.student_id,
                name: editedStudent.name,
                email: editedStudent.email,
                day_of_birth: editedStudent.day_of_birth,
                gender: editedStudent.gender,
                address: editedStudent.address,
                phone_number: editedStudent.phone_number,
                class: editedStudent.class,
                admission_year: editedStudent.admission_year,
                status: editedStudent.status,
                updated_at: new Date().toISOString(),
            };

            const response = await updatedStudentData(student.student_id, updatedStudentData);

            if (response && response.data) {
                onSave(response.data.data);
                onClose();
                alert('Cập nhật học viên thành công!');
            }
        } catch (error) {
            console.error('Error updating lecturer:', error);
            alert('Lỗi khi cập nhật giảng viên: ' + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa sinh viên</Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã học viên"
                        name="student_id"
                        value={editedStudent.student_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={true} // Không cho phép thay đổi mã học viên
                    />
                    <TextField
                        label="Họ tên"
                        name="name"
                        value={editedStudent.name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Mã lớp"
                        name="class"
                        value={editedStudent.class}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Năm nhập học"
                        name="admission_year"
                        type="date"
                        value={editedStudent.admission_year}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControl fullWidth required disabled={loading}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="status"
                            value={editedStudent.status}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="Đang học">Đang học</MenuItem>
                            <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                            <MenuItem value="Tốt nghiệp">Tốt nghiệp</MenuItem>
                            <MenuItem value="Bảo lưu">Bảo lưu</MenuItem>
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
                >
                    {loading ? <CircularProgress size={24} /> : 'Lưu'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
