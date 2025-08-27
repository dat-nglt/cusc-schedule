import { APIResponse } from "../utils/APIResponse.js"; // Sử dụng APIResponse nhất quán
import {
    getAllScheduleChangeRequestService,
    CreateScheduleChangeRequestService,
    approveScheduleChangeRequestService,
    rejectScheduleChangeRequestService,
    getScheduleChangeRequestByLecturerService // <-- Add this import
} from "../services/schedulechangerequestService.js";

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

        // Kiểm tra loại lỗi để trả về status code phù hợp
        const isValidationError = error.message.includes("không tồn tại") ||
            error.message.includes("Phải có ít nhất") ||
            error.message.includes("Đã có yêu cầu") ||
            error.message.includes("Xung đột") ||
            error.message.includes("không được phép");

        const statusCode = isValidationError ? 400 : 500;

        return APIResponse(
            res,
            statusCode,
            null,
            error.message || "Đã xảy ra lỗi khi tạo yêu cầu thay đổi lịch học."
        );
    }
};

// Duyệt yêu cầu thay đổi lịch học (Admin)
export const approveScheduleChangeRequestController = async (req, res) => {
    const { requestId } = req.params;
    const adminData = req.user; // Thông tin admin từ middleware authentication

    try {
        const approvedRequest = await approveScheduleChangeRequestService(requestId, adminData);
        return APIResponse(
            res,
            200,
            approvedRequest,
            "Duyệt yêu cầu thay đổi lịch học thành công."
        );
    }
    catch (error) {
        console.error("Lỗi khi duyệt yêu cầu thay đổi lịch học:", error);

        const isValidationError = error.message.includes("không tồn tại") ||
            error.message.includes("Chỉ có thể") ||
            error.message.includes("Không thể duyệt");

        const statusCode = isValidationError ? 400 : 500;

        return APIResponse(
            res,
            statusCode,
            null,
            error.message || "Đã xảy ra lỗi khi duyệt yêu cầu thay đổi lịch học."
        );
    }
};

// Từ chối yêu cầu thay đổi lịch học (Admin)
export const rejectScheduleChangeRequestController = async (req, res) => {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;

    try {
        const rejectedRequest = await rejectScheduleChangeRequestService(requestId, rejectionReason);
        return APIResponse(
            res,
            200,
            rejectedRequest,
            "Từ chối yêu cầu thay đổi lịch học thành công."
        );
    }
    catch (error) {
        console.error("Lỗi khi từ chối yêu cầu thay đổi lịch học:", error);

        const isValidationError = error.message.includes("không tồn tại") ||
            error.message.includes("Chỉ có thể");

        const statusCode = isValidationError ? 400 : 500;

        return APIResponse(
            res,
            statusCode,
            null,
            error.message || "Đã xảy ra lỗi khi từ chối yêu cầu thay đổi lịch học."
        );
    }
};

export const getScheduleChangeRequestByLecturerController = async (req, res) => {
    const { lecturerId } = req.params;
    try {
        // Call the service, not the controller itself
        const scheduleChangeRequests = await getScheduleChangeRequestByLecturerService(lecturerId);
        return APIResponse(
            res,
            200,
            scheduleChangeRequests,
            "Lấy danh sách yêu cầu thay đổi lịch học của giảng viên thành công."
        );
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu thay đổi lịch học của giảng viên:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi lấy danh sách yêu cầu thay đổi lịch học của giảng viên."
        );
    }
};