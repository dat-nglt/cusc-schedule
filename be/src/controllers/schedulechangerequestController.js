import { APIResponse } from "../utils/APIResponse.js"; // Sử dụng APIResponse nhất quán
import { getAllScheduleChangeRequestService, CreateScheduleChangeRequestService } from "../services/schedulechangerequestService.js";

export const getAllScheduleChangeRequestController = async (req, res) => {
    try {
        const scheduleChangeRequests = await getAllScheduleChangeRequestService();
        return APIResponse(
            res,
            200,
            scheduleChangeRequests,
            "Lấy danh sách yêu cầu thay đổi lịch học thành công."
        );
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu thay đổi lịch học:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi lấy danh sách yêu cầu thay đổi lịch học."
        );
    }
};

export const createScheduleChangeRequestController = async (req, res) => {
    const data = req.body;
    try {
        const scheduleChangeRequest = await CreateScheduleChangeRequestService(data);
        return APIResponse(
            res,
            201,
            scheduleChangeRequest,
            "Tạo yêu cầu thay đổi lịch học thành công."
        );
    }
    catch (error) {
        console.error("Lỗi khi tạo yêu cầu thay đổi lịch học:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi tạo yêu cầu thay đổi lịch học."
        );
    }
};