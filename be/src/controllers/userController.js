import { getAllUsers } from "../services/userService.js";
import { APIResponse } from "../utils/APIResponse.js";

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        return APIResponse(res, 200, users, "Users fetched successfully");
    } catch (error) {
        return APIResponse(res, 500, error.message || "Error fetching users");
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const userInfo = req.userInfo;
        const { user, role } = userInfo;

        return APIResponse(res, 200, {
            id: req.userId,
            name: user.name,
            email: user.email,
            role: role,
            status: user.status
        }, "Current user information retrieved successfully");
    } catch (error) {
        return APIResponse(res, 500, error.message || "Error fetching current user");
    }
};