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
            setLoading(true);
            await onSave(editedStudent);
            onClose();
        } catch (error) {
            setError('Có lỗi xảy ra khi cập nhật học viên. Vui lòng thử lại!');
            console.error('Error updating student:', error);
        } finally {
            setLoading(false);
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
                    <FormControl fullWidth required disabled={loading}>
                        <InputLabel>Năm nhập học</InputLabel>
                        <Select
                            name="admission_year"
                            value={editedStudent.admission_year}
                            onChange={handleChange}
                            label="Năm nhập học"
                        >
                            {/* {availableCourses.map((course) => (
                                <MenuItem key={course} value={course}>
                                    {course}
                                </MenuItem>
                            ))} */}
                            <MenuItem value="2020">2020</MenuItem>
                            <MenuItem value="2021">2021</MenuItem>
                            <MenuItem value="2022">2022</MenuItem>
                            <MenuItem value="2023">2023</MenuItem>
                            <MenuItem value="2024">2024</MenuItem>
                            <MenuItem value="2025">2025</MenuItem>

                        </Select>
                    </FormControl>
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
