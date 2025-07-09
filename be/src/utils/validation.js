import { body, validationResult } from 'express-validator';

/**
 * Middleware xác thực dữ liệu cho lịch trình (timetable).
 * Đảm bảo các trường 'title', 'startTime', 'endTime', và 'classId' hợp lệ.
 */
export const validateTimetable = [
    // 'title' không được rỗng
    body('title').notEmpty().withMessage('Tiêu đề là bắt buộc.'),
    // 'startTime' phải là định dạng ngày ISO 8601 hợp lệ
    body('startTime').isISO8601().withMessage('Thời gian bắt đầu phải là định dạng ngày ISO 8601 hợp lệ.'),
    // 'endTime' phải là định dạng ngày ISO 8601 hợp lệ
    body('endTime').isISO8601().withMessage('Thời gian kết thúc phải là định dạng ngày ISO 8601 hợp lệ.'),
    // 'classId' không được rỗng
    body('classId').notEmpty().withMessage('Mã lớp học là bắt buộc.'),
    // Xử lý kết quả xác thực
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Nếu có lỗi, trả về phản hồi 400 Bad Request với chi tiết lỗi
            return res.status(400).json({ errors: errors.array() });
        }
        // Nếu không có lỗi, chuyển sang middleware/controller tiếp theo
        next();
    },
];

/**
 * Middleware xác thực dữ liệu cho thông tin người dùng.
 * Đảm bảo 'username' không rỗng và 'password' có độ dài tối thiểu.
 */
export const validateUser = [
    // 'username' không được rỗng
    body('username').notEmpty().withMessage('Tên người dùng là bắt buộc.'),
    // 'password' phải có ít nhất 6 ký tự
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự.'),
    // Xử lý kết quả xác thực
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

/**
 * Middleware xác thực dữ liệu cho đăng nhập.
 * Đảm bảo 'email' là định dạng email hợp lệ và 'password' không rỗng.
 */
export const validateLogin = [
    // 'email' phải là định dạng email hợp lệ
    body('email').isEmail().withMessage('Vui lòng cung cấp một địa chỉ email hợp lệ.'),
    // 'password' không được rỗng
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc.'),
    // Xử lý kết quả xác thực
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

/**
 * Middleware xác thực dữ liệu cho đăng ký tài khoản mới.
 * Đảm bảo 'name' không rỗng, 'email' hợp lệ và 'password' có độ dài tối thiểu.
 */
export const validateRegister = [
    // 'name' không được rỗng
    body('name').notEmpty().withMessage('Tên là bắt buộc.'),
    // 'email' phải là định dạng email hợp lệ
    body('email').isEmail().withMessage('Vui lòng cung cấp một địa chỉ email hợp lệ.'),
    // 'password' phải có ít nhất 6 ký tự
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự.'),
    // Xử lý kết quả xác thực
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];