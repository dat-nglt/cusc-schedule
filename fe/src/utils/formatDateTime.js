// Hàm định dạng thời gian từ YYYY-MM-DD HH:mm thành DD/MM/YYYY HH:mm
export const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Không có dữ liệu';
    try {
        const date = new Date(dateTime);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return 'Không hợp lệ';
    }
};