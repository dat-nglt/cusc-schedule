// BE: controllers/authController.js
import { generateToken } from '../services/authService.js';
import { APIResponse } from '../utils/APIResponse.js';

export const logout = (req, res) => {
    res.clearCookie('jwt', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
    return APIResponse(res, 200, 'Người dùng đã đăng xuất thành công.');
};

export const googleCallback = async (req, res) => {
    try {
        const userObj = req.user; // Đã có từ Passport.js sau khi xác thực thành công

        // Tạo JWT token
        const token = generateToken(userObj.id, userObj.role);

        // Đặt JWT vào HTTP-Only Cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            path: '/',
        });

        // Chuyển hướng người dùng về frontend dashboard hoặc trang chính
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        return res.redirect(`${frontendUrl}/dashboard`);
    } catch (error) {
        // Đây sẽ là các lỗi internal server, không phải lỗi xác thực từ Google
        console.error('Lỗi trong quá trình xử lý Google callback (internal error):', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        // Chuyển hướng với một mã lỗi chung cho các lỗi không mong muốn
        return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('server_error_during_callback')}`);
    }
};