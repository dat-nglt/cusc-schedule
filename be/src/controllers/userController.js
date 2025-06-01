import { getAllUsers } from "../services/userService";
import { successResponse, errorResponse } from "../utils/APIResponse";
export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        return successResponse(res, users, "Users fetched successfully");
    } catch (error) {
        return errorResponse(res, error.message || "Error fetching users", 500);
    }
}