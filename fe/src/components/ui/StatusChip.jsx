import { Chip } from "@mui/material";

export const getStatusForLectuer = (isActive) => {
    // Xác định màu sắc dựa trên trạng thái active hoặc inactive
    const style = isActive == "active"
        ? { color: '#4caf50', bgcolor: '#e8f5e8', label: 'Hoạt động' } // Màu xanh lá cây cho trạng thái active
        : { color: '#757575', bgcolor: '#f5f5f5', label: 'Tạm nghỉ' }; // Màu xám cho trạng thái inactive

    return (
        <Chip
            label={style.label}
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
