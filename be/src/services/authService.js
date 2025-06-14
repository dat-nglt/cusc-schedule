import jwt from 'jsonwebtoken';
import { findUserByEmail, getUserId } from './userService.js';


export const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const loginUser = async (email, password) => {
    const userInfo = await findUserByEmail(email);
    if (!userInfo) {
        throw new Error('Invalid credentials');
    }

    const { user, role } = userInfo;

    // Note: Google OAuth users không có password, chỉ dùng cho traditional login nếu có
    if (user.password) {
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
    } else {
        throw new Error('This account uses Google login only');
    }

    const userId = getUserId(userInfo);
    const token = jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token, role };
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Chức năng register bị disabled vì chúng ta không tạo user mới qua API
// Chỉ admin mới có thể tạo user trong database
export const registerUser = async (name, email, password) => {
    throw new Error('Registration is disabled. Please contact administrator.');
};