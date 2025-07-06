import { Chip } from "@mui/material";

// Function to get the status of a row based on student data
export const getRowStatus = (data) => {
    if (data.errors && data.errors.length > 0) {
        return 'error';
    }
    return 'valid';
};


// Function to get the error chip for displaying validation errors
export const getErrorChip = (error, name) => {
    const errorMessages = {
        'duplicate_id': `Mã ${name} trùng lặp`,
        'missing_required': 'Thiếu dữ liệu bắt buộc',
        'invalid_email': 'Email không hợp lệ',
        'invalid_phone': 'SĐT không hợp lệ',
        'invalid_date': 'Ngày không hợp lệ',
        'invalid_degree': 'Bằng cấp không hợp lệ',
        'invalid_gender': 'Giới tính không hợp lệ'
    };

    return (
        <Chip
            key={error}
            label={errorMessages[error] || error}
            color="error"
            size="small"
            sx={{ mr: 0.5, mb: 0.5 }}
        />
    );
};



