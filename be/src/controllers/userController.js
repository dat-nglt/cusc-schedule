import { getAllUsers } from "../services/userService.js";
import { APIResponse } from "../utils/APIResponse.js";

/**
 * @route GET /api/users/
 * @desc Lấy tất cả danh sách người dùng trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin)
 */
export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        return APIResponse(res, 200, users, "Lấy danh sách người dùng thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error); // Thêm log lỗi để dễ debug
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy danh sách người dùng.");
    }
};

/**
 * @route GET /api/users/me
 * @desc Lấy thông tin của người dùng hiện tại (đã được xác thực).
 * Thông tin người dùng được lấy từ `req.userInfo` (thường được gắn bởi một middleware xác thực).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.userInfo`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (authenticated user)
 */
export const getCurrentUser = async (req, res) => {
    try {
        // req.userInfo được giả định là đã được gắn vào bởi middleware xác thực
        // và chứa đối tượng user và role của người dùng.
        const userInfo = req.userInfo;

        // Đảm bảo userInfo và các thuộc tính của nó tồn tại trước khi truy cập
        if (!userInfo || !userInfo.user || !userInfo.role) {
            return APIResponse(res, 401, null, "Không có thông tin người dùng được xác thực.");
        }

        const { user, role } = userInfo;

        // Trả về thông tin cần thiết của người dùng hiện tại
        return APIResponse(res, 200, {
            id: req.userId || user.id, // req.userId có thể được thiết lập bởi middleware khác
            name: user.name,
            email: user.email,
            role: role,
            status: user.status
        }, "Lấy thông tin người dùng hiện tại thành công.");
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng hiện tại:", error); // Thêm log lỗi
        return APIResponse(res, 500, null, error.message || "Đã xảy ra lỗi khi lấy thông tin người dùng hiện tại.");
    }
};