import jwt from 'jsonwebtoken';
import { APIResponse } from '../utils/APIResponse.js';
import { findUserById } from '../services/userService.js';

/**
 * Middleware xác thực người dùng dựa trên JWT.
 * Kiểm tra sự tồn tại và tính hợp lệ của token trong header Authorization.
 * Gán `req.userId`, `req.userRole`, và `req.userInfo` nếu xác thực thành công.
 *
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @param {Function} next - Hàm middleware tiếp theo.
 */
const authMiddleware = async (req, res, next) => {
    // Lấy header Authorization
    const authHeader = req.headers['authorization'];

    // Kiểm tra nếu header Authorization không tồn tại
    if (!authHeader) {
        return APIResponse(res, 401, 'Truy cập bị từ chối. Không có header Authorization.');
    }

    // Tách token từ chuỗi "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Kiểm tra nếu token không tồn tại sau khi tách
    if (!token) {
        return APIResponse(res, 401, 'Truy cập bị từ chối. Không tìm thấy token trong header Authorization.');
    }

    try {
        // Xác minh token sử dụng JWT_SECRET từ biến môi trường
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Xác minh người dùng vẫn còn tồn tại trong cơ sở dữ liệu
        // decoded.id được lấy từ payload của JWT (thường là ID người dùng)
        const userInfo = await findUserById(decoded.id);
        if (!userInfo) {
            // Nếu người dùng không được tìm thấy (ví dụ: đã bị xóa)
            return APIResponse(res, 401, 'Người dùng không tồn tại hoặc đã bị xóa.');
        }

        // Gán thông tin người dùng vào đối tượng request để các middleware/route tiếp theo có thể sử dụng
        req.userId = decoded.id;
        // Ưu tiên role từ token, nếu không có thì lấy từ thông tin người dùng trong DB
        req.userRole = decoded.role || userInfo.role;
        req.userInfo = userInfo; // Chứa toàn bộ thông tin người dùng (user object và role, model)

        console.log(`Người dùng đã xác thực: ID=${req.userId}, Vai trò=${req.userRole}`);
        next(); // Chuyển sang middleware/route tiếp theo
    } catch (error) {
        // Xử lý các lỗi liên quan đến xác minh token
        console.error('Lỗi xác minh token:', error);

        if (error.name === 'TokenExpiredError') {
            return APIResponse(res, 401, 'Token đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.name === 'JsonWebTokenError') {
            // Lỗi khi token không hợp lệ (ví dụ: sai định dạng, sai chữ ký)
            return APIResponse(res, 401, 'Token không hợp lệ.');
        } else if (error.name === 'NotBeforeError') {
            // Lỗi khi token chưa có hiệu lực
            return APIResponse(res, 401, 'Token chưa có hiệu lực.');
        } else {
            // Các lỗi xác thực khác
            return APIResponse(res, 401, 'Xác thực thất bại.');
        }
    }
};

/**
 * Middleware để kiểm tra vai trò của người dùng.
 * Yêu cầu `authMiddleware` phải chạy trước để `req.userId` và `req.userRole` được thiết lập.
 *
 * @param {Array<string>} allowedRoles - Mảng các vai trò được phép truy cập.
 * @returns {Function} Hàm middleware Express.
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Đảm bảo người dùng đã được xác thực trước đó bởi `authMiddleware`
        if (!req.userId || !req.userRole) {
            return APIResponse(res, 401, 'Yêu cầu xác thực để kiểm tra quyền.');
        }

        // Đảm bảo `allowedRoles` là một mảng
        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        // Kiểm tra xem vai trò của người dùng có nằm trong danh sách các vai trò được phép không
        if (!rolesArray.includes(req.userRole)) {
            // Nếu không có quyền, trả về lỗi 403 Forbidden
            return APIResponse(res, 403, `Truy cập bị từ chối. Yêu cầu vai trò: ${rolesArray.join(' hoặc ')}, nhưng người dùng có vai trò: ${req.userRole}`);
        }

        next(); // Người dùng có quyền, chuyển sang middleware/route tiếp theo
    };
};

/**
 * Middleware kết hợp cả xác thực (authentication) và phân quyền (authorization) trong một bước.
 * Tiện lợi khi bạn muốn thực hiện cả hai kiểm tra cùng lúc.
 *
 * @param {Array<string>} allowedRoles - Mảng các vai trò được phép truy cập.
 * @returns {Function} Hàm middleware Express.
 */
export const authenticateAndAuthorize = (allowedRoles) => {
    return async (req, res, next) => {
        // Bước 1: Xác thực (Authentication) - Tương tự như `authMiddleware`
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return APIResponse(res, 401, 'Truy cập bị từ chối. Không tìm thấy token.');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const userInfo = await findUserById(decoded.id);
            if (!userInfo) {
                return APIResponse(res, 401, 'Người dùng không tồn tại hoặc đã bị xóa.');
            }

            req.userId = decoded.id;
            req.userRole = decoded.role || userInfo.role;
            req.userInfo = userInfo;

            // Bước 2: Phân quyền (Authorization) - Tương tự như `requireRole`
            const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

            if (!rolesArray.includes(req.userRole)) {
                return APIResponse(res, 403, `Truy cập bị từ chối. Yêu cầu vai trò: ${rolesArray.join(' hoặc ')}, nhưng người dùng có vai trò: ${req.userRole}`);
            }

            next(); // Xác thực và phân quyền thành công, chuyển sang middleware/route tiếp theo
        } catch (error) {
            // Xử lý lỗi xác thực và phân quyền
            console.error('Lỗi xác thực hoặc phân quyền:', error);
            if (error.name === 'TokenExpiredError') {
                return APIResponse(res, 401, 'Token đã hết hạn.');
            } else if (error.name === 'JsonWebTokenError') {
                return APIResponse(res, 401, 'Token không hợp lệ.');
            } else {
                return APIResponse(res, 401, 'Xác thực thất bại.');
            }
        }
    };
};

export default authMiddleware;