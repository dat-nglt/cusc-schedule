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

const availableTrainingDurations = [1, 2, 3, 4];
const statusOptions = [
    { value: 'Hoạt động', db: 'active' },
    { value: 'Tạm ngưng', db: 'suspended' },
    { value: 'Ngưng hoạt động', db: 'inactive' }
];

export default function EditProgramModal({ open, onClose, program, onSave, error, loading }) {
    const [editedProgram, setEditedProgram] = useState({
        program_id: '',
        program_name: '',
        training_duration: '',
        status: 'active',
    });

    useEffect(() => {
        if (program) {
            // Chuyển trạng thái từ tiếng Anh sang tiếng Việt để hiển thị
            let viStatus = 'Hoạt động';
            const statusMap = {
                active: 'Hoạt động',
                inactive: 'Ngưng hoạt động',
                suspended: 'Tạm ngưng'
            };
            if (program.status && statusMap[program.status]) {
                viStatus = statusMap[program.status];
            } else if (program.status && statusOptions.some(opt => opt.value === program.status)) {
                viStatus = program.status;
            }
            setEditedProgram({
                program_id: program.program_id || '',
                program_name: program.program_name || '',
                training_duration: program.training_duration || '',
                status: viStatus,
            });
        }
    }, [program]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProgram((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (
            !editedProgram.program_id ||
            !editedProgram.program_name ||
            !editedProgram.training_duration
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Validate program name length
        if (editedProgram.program_name.length < 3) {
            alert('Tên chương trình phải có ít nhất 3 ký tự!');
            return;
        }

        // Validate training duration
        if (!availableTrainingDurations.includes(Number(editedProgram.training_duration))) {
            alert('Thời gian đào tạo không hợp lệ!');
            return;
        }

        // Chuyển trạng thái sang tiếng Anh trước khi lưu
        const statusObj = statusOptions.find(opt => opt.value === editedProgram.status);
        const dbStatus = statusObj ? statusObj.db : 'active';

        const updatedProgramData = {
            program_id: editedProgram.program_id,
            program_name: editedProgram.program_name,
            training_duration: editedProgram.training_duration,
            status: dbStatus,
            updated_at: new Date().toISOString(),
        };

        // Gọi hàm onSave được truyền từ component cha
        await onSave(updatedProgramData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Chỉnh sửa chương trình đào tạo</Typography>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Mã chương trình"
                        name="program_id"
                        value={editedProgram.program_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        disabled={true}
                    />
                    <TextField
                        label="Tên chương trình"
                        name="program_name"
                        value={editedProgram.program_name}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Thời gian đào tạo</InputLabel>
                        <Select
                            name="training_duration"
                            value={editedProgram.training_duration}
                            onChange={handleChange}
                            label="Thời gian đào tạo"
                        >
                            {availableTrainingDurations.map((duration) => (
                                <MenuItem key={duration} value={duration}>
                                    {duration} Năm
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            name="status"
                            value={editedProgram.status}
                            onChange={handleChange}
                            label="Trạng thái"
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.value}
                                </MenuItem>
                            ))}
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