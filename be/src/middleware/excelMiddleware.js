import multer from 'multer';
import path from 'path';

/**
 * Cấu hình Multer để xử lý tải lên file Excel.
 * - Sử dụng `memoryStorage` để lưu trữ file trong bộ nhớ đệm (Buffer) thay vì ghi vào đĩa,
 * phù hợp cho việc xử lý dữ liệu file ngay lập tức (ví dụ: đọc Excel).
 * - Giới hạn kích thước file tải lên là 5MB.
 * - Chỉ chấp nhận các file có đuôi `.xlsx` hoặc `.xls`.
 */
const storage = multer.memoryStorage();

export const uploadExcel = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn kích thước file là 5MB (5 * 1024 * 1024 bytes)
    },
    fileFilter: (req, file, cb) => {
        // Các đuôi file Excel được phép
        const allowedExtensions = ['.xlsx', '.xls'];
        // Lấy đuôi file gốc và chuyển về chữ thường để so sánh
        const fileExtension = path.extname(file.originalname).toLowerCase();

        // Kiểm tra xem đuôi file có nằm trong danh sách cho phép không
        if (allowedExtensions.includes(fileExtension)) {
            // Nếu hợp lệ, chấp nhận file
            cb(null, true);
        } else {
            // Nếu không hợp lệ, trả về lỗi
            cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'), false);
        }
    }
}).single('excel_file'); // Cấu hình Multer để mong đợi một file duy nhất với tên trường là 'excel_file'