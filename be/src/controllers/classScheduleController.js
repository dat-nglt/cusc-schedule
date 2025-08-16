import { APIResponse } from "../utils/APIResponse.js"; // Sử dụng APIResponse nhất quán
import { getAllClassScheduleService } from "../services/classScheduleService.js";

export const getAllClassScheduleController = async (req, res) => {
    try {
        const classSchedules = await getAllClassScheduleService();
        return APIResponse(
            res,
            200,
            classSchedules,
            "Lấy danh sách lịch học thành công."
        );
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lịch học:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi lấy danh sách lịch học."
        );
    }
};