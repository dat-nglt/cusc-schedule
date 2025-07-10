import jwt from 'jsonwebtoken';
import { findUserByEmail, getUserId } from './userService.js';

/**
 * Tạo JWT token cho user
 * @param {string} userId - ID của người dùng
 * @param {string} role - Vai trò của người dùng (admin, user, lecturer, v.v.)
 * @returns {string} - Mã JWT
 */
export const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '12h', // Token có hiệu lực trong 12 giờ
    });
};

/**
 * Xử lý đăng nhập người dùng bằng email và mật khẩu
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu người dùng
 * @returns {Object} - Thông tin người dùng, token và vai trò
 */
export const loginUser = async (email, password) => {
    const userInfo = await findUserByEmail(email);

    if (!userInfo) {
        throw new Error('Thông tin đăng nhập không hợp lệ');
    }

    const { user, role } = userInfo;

    // Nếu người dùng có mật khẩu (login truyền thống)
    if (user.password) {
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Thông tin đăng nhập không hợp lệ');
        }
    } else {
        // Nếu tài khoản dùng Google OAuth
        throw new Error('Tài khoản này chỉ hỗ trợ đăng nhập bằng Google');
    }

    const userId = getUserId(userInfo);

    // Tạo token có thời hạn 1 giờ
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return { user, token, role };
};

/**
 * Xác minh token JWT
 * @param {string} token - Chuỗi token cần xác thực
 * @returns {Object} - Dữ liệu giải mã từ token
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token không hợp lệ');
    }
};

/**
 * Đăng ký người dùng mới - Tính năng bị vô hiệu hóa
 * @throws {Error} - Luôn luôn ném lỗi vì không cho phép đăng ký qua API
 */
export const registerUser = async (name, email, password) => {
    throw new Error('Chức năng đăng ký bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
};
