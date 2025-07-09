// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\middleware\errorMiddleware.js

/**
 * Middleware xử lý lỗi tập trung cho ứng dụng Express.
 * Bất kỳ lỗi nào được truyền vào `next(err)` sẽ được xử lý tại đây.
 *
 * @param {Error} err - Đối tượng lỗi từ các route hoặc middleware trước đó.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @param {Function} next - Hàm middleware tiếp theo (thường không được gọi trong error middleware cuối cùng).
 */
const errorMiddleware = (err, req, res, next) => {
    // Log lỗi để dễ dàng debug trong môi trường phát triển
    console.error(err.stack); // Hiển thị stack trace của lỗi

    // Xác định mã trạng thái HTTP. Mặc định là 500 (Internal Server Error) nếu lỗi không có statusCode cụ thể.
    const statusCode = err.statusCode || 500;

    // Xác định thông báo lỗi. Mặc định là 'Internal Server Error' nếu lỗi không có thông báo cụ thể.
    const message = err.message || 'Lỗi Máy Chủ Nội Bộ';

    // Gửi phản hồi lỗi về client dưới dạng JSON
    res.status(statusCode).json({
        status: 'error', // Trạng thái phản hồi là lỗi
        statusCode: statusCode, // Mã trạng thái HTTP
        message: message, // Thông báo lỗi
        // Trong môi trường phát triển, có thể thêm chi tiết lỗi để dễ debug
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export default errorMiddleware;