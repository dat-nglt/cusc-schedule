import { APIResponse } from "../utils/APIResponse.js"; // Sử dụng APIResponse nhất quán
import {
    getAllClassScheduleService,
    getClassScheduleForLecturerService,
    getClassScheduleForStudentService
} from "../services/classScheduleService.js";

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

export const getClassScheduleForLecturerController = async (req, res) => {
    const { lecturerId } = req.params;
    try {
        const classSchedules = await getClassScheduleForLecturerService(lecturerId);
        return APIResponse(
            res,
            200,
            classSchedules,
            "Lấy lịch học cho giảng viên thành công."
        );
    } catch (error) {
        console.error("Lỗi khi lấy lịch học cho giảng viên:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi lấy lịch học cho giảng viên."
        );
    }
};

export const getClassScheduleForStudentController = async (req, res) => {
    const { studentId } = req.params;
    try {
        const classSchedules = await getClassScheduleForStudentService(studentId);
        return APIResponse(
            res,
            200,
            classSchedules,
            "Lấy lịch học cho sinh viên thành công."
        );
    } catch (error) {
        console.error("Lỗi khi lấy lịch học cho sinh viên:", error);
        return APIResponse(
            res,
            500,
            null,
            error.message || "Đã xảy ra lỗi khi lấy lịch học cho sinh viên."
        );
    }
};

