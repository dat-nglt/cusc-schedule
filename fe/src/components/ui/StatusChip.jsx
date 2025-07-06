import { Chip } from "@mui/material";

export const getStatusChip = (status) => {
    const statusColors = {
        'Đang triển khai': { color: '#4caf50', bgcolor: '#e8f5e8' },
        'Hoạt động': { color: '#4caf50', bgcolor: '#e8f5e8' },
        'Ngừng hoạt động': { color: '#f57c00', bgcolor: '#fff3e0' },
        'Kết thúc': { color: '#757575', bgcolor: '#f5f5f5' },
        'Tạm nghỉ': { color: '#f57c00', bgcolor: '#fff3e0' },
        'Đang dạy': { color: '#2196f3', bgcolor: '#e3f2fd' },
        'Đang học': { color: '#4caf50', bgcolor: '#e8f5e8' },
        'Tốt nghiệp': { color: '#2196f3', bgcolor: '#e3f2fd' },
        'Bảo lưu': { color: '#9c27b0', bgcolor: '#f3e5f5' }
    };
    const style = statusColors[status] || { color: '#757575', bgcolor: '#f5f5f5' };

    return (
        <Chip
            label={status}
            size="small"
            sx={{
                color: style.color,
                bgcolor: style.bgcolor,
                fontWeight: 'bold',
                fontSize: '0.75rem'
            }}
        />
    );
};