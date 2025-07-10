import { findUserByEmail, getUserId } from '../services/userService.js';
import { generateToken } from '../services/authService.js';
import { APIResponse } from '../utils/APIResponse.js';

/**
 * Xử lý yêu cầu đăng nhập của người dùng bằng email và mật khẩu.
 *
 * @param {Object} req - Đối tượng yêu cầu (request) từ Express.
 * @param {Object} res - Đối tượng phản hồi (response) từ Express.
 * @returns {Promise<void>} Trả về phản hồi JSON chứa token và thông tin người dùng nếu thành công,
 * hoặc thông báo lỗi nếu thất bại.
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm kiếm người dùng theo email trên tất cả các loại tài khoản (sinh viên, giảng viên, admin, cán bộ đào tạo).
        const userInfo = await findUserByEmail(email);
        if (!userInfo) {
            // Trả về lỗi nếu không tìm thấy người dùng với email này.
            return APIResponse(res, 401, 'Thông tin đăng nhập không hợp lệ.');
        }

        const { user, role } = userInfo; // 'user' là đối tượng người dùng cụ thể (Student, Lecturer, v.v.), 'role' là vai trò của họ.

        // Kiểm tra xem tài khoản có trường 'password' hay không.
        // Điều này giúp phân biệt giữa tài khoản đăng nhập truyền thống và tài khoản chỉ dùng Google OAuth.
        if (!user.password) {
            return APIResponse(res, 401, 'Tài khoản này chỉ sử dụng đăng nhập bằng Google.');
        }

        // Xác minh mật khẩu. Giả định rằng đối tượng 'user' có phương thức 'comparePassword'.
        if (typeof user.comparePassword === 'function') {
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                // Trả về lỗi nếu mật khẩu không khớp.
                return APIResponse(res, 401, 'Thông tin đăng nhập không hợp lệ.');
            }
        } else {
            // Nếu model người dùng không có phương thức 'comparePassword',
            // giả định đây là tài khoản chỉ dùng Google và không thể đăng nhập truyền thống.
            return APIResponse(res, 401, 'Tài khoản này chỉ sử dụng đăng nhập bằng Google.');
        }

        // Lấy ID người dùng thực tế từ userInfo (có thể là student_id, lecturer_id, v.v.).
        const userId = getUserId(userInfo);
        // Tạo JWT token cho phiên đăng nhập.
        const token = generateToken(userId, role);

        // Trả về phản hồi thành công với token và thông tin người dùng.
        return APIResponse(res, 200, {
            token,
            user: {
                id: userId,
                name: user.name, // Lấy tên người dùng
                email: user.email, // Lấy email người dùng
                role: role // Vai trò của người dùng
            }
        }, 'Đăng nhập thành công.');
    } catch (error) {
        // Ghi log lỗi để debug và trả về lỗi máy chủ.
        console.error('Lỗi trong quá trình đăng nhập:', error);
        return APIResponse(res, 500, 'Lỗi máy chủ nội bộ.');
    }
};

/**
 * Xử lý yêu cầu đăng ký người dùng mới.
 * Chức năng đăng ký được mặc định là DISABLED trong hệ thống này.
 * Người dùng cần liên hệ quản trị viên để tạo tài khoản.
 *
 * @param {Object} req - Đối tượng yêu cầu từ Express.
 * @param {Object} res - Đối tượng phản hồi từ Express.
 * @returns {void} Trả về phản hồi JSON thông báo đăng ký bị vô hiệu hóa.
 */
export const register = async (req, res) => {
    return APIResponse(res, 400, 'Chức năng đăng ký hiện đang bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để tạo tài khoản.');
};

/**
 * Xử lý yêu cầu đăng xuất của người dùng.
 * Trong một hệ thống sử dụng JWT stateless, đăng xuất chủ yếu được xử lý ở phía client
 * bằng cách loại bỏ token. Về phía server, không có phiên làm việc cần hủy.
 * Có thể cân nhắc triển khai danh sách đen token nếu cần bảo mật cao hơn.
 *
 * @param {Object} req - Đối tượng yêu cầu từ Express.
 * @param {Object} res - Đối tượng phản hồi từ Express.
 * @returns {void} Trả về phản hồi JSON thông báo đăng xuất thành công.
 */
export const logout = (req, res) => {
    return APIResponse(res, 200, 'Người dùng đã đăng xuất thành công.');
};

/**
 * Xử lý callback sau khi xác thực Google OAuth thành công.
 * Sau khi Google xác thực, Passport.js sẽ đưa thông tin người dùng vào `req.user`.
 * Chức năng này tạo JWT token và chuyển hướng người dùng về frontend.
 *
 * @param {Object} req - Đối tượng yêu cầu từ Express (chứa `req.user` từ Passport.js).
 * @param {Object} res - Đối tượng phản hồi từ Express.
 * @returns {void} Chuyển hướng người dùng về URL frontend cùng với token và thông tin người dùng.
 */
export const googleCallback = async (req, res) => {
    try {
        const userObj = req.user; // Thông tin người dùng được cung cấp bởi Passport.js sau khi xác thực Google.

        if (!userObj) {
            // Nếu không có thông tin người dùng từ Google (ví dụ: xác thực thất bại),
            // chuyển hướng về trang đăng nhập frontend với lỗi.
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5000'}/login?error=authentication_failed`);
        }

        // Tạo JWT token cho người dùng Google đã xác thực.
        const token = generateToken(userObj.id, userObj.role);

        // Chuyển hướng người dùng về URL frontend.
        // Truyền token và thông tin người dùng qua URL params (cần encode để tránh lỗi ký tự).
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: userObj.id,
            name: userObj.user.name,
            email: userObj.user.email,
            role: userObj.role
        }))}`);
    } catch (error) {
        // Ghi log lỗi và chuyển hướng về frontend với lỗi máy chủ.
        console.error('Lỗi trong quá trình xử lý Google callback:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        return res.redirect(`${frontendUrl}/login?error=server_error`);
    }
};