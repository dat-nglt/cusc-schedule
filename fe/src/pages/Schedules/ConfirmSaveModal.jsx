import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const ConfirmSaveModal = ({ open, onClose, onConfirm, isLoading = false }) => {
    const handleConfirm = () => {
        onConfirm(); // Gọi API lưu trữ mà không cần truyền dữ liệu
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SaveIcon color="primary" />
                Xác nhận lưu trữ lịch học
            </DialogTitle>
            <DialogContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Bạn sắp lưu trữ lịch học đã được tạo tự động cho toàn hệ thống.
                </Alert>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Lịch học đã được tạo thành công với thuật toán sắp xếp. Bạn có muốn lưu trữ lịch học này không?
                </Typography>

                <Box sx={{
                    backgroundColor: '#f5f5f5',
                    p: 2,
                    borderRadius: 1,
                    mb: 2
                }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Lưu ý:
                    </Typography>
                    <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                        <li>Lịch học sẽ được áp dụng cho toàn bộ hệ thống</li>
                        <li>Giảng viên và sinh viên có thể xem lịch học sau khi lưu trữ</li>
                        <li>Thao tác này không thể hoàn tác</li>
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    disabled={isLoading}
                >
                    Từ chối
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="success"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang lưu...' : 'Xác nhận lưu trữ'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmSaveModal;