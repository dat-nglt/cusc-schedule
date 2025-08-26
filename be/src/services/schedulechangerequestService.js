import models from "../models/index.js";
import { Op } from "sequelize";
const { ScheduleChangeRequest, ClassSchedule } = models;

export const getAllScheduleChangeRequestService = async () => {
    try {
        const scheduleChangeRequests = await ScheduleChangeRequest.findAll({
            include: [
                {
                    model: models.ClassSchedule,
                    as: 'classSchedule',
                    attributes: ['class_schedule_id', 'semester_id', 'class_id', 'program_id', 'date', 'day', 'slot_id', 'subject_id', 'lecturer_id', 'room_id'],
                },
                {
                    model: models.Lecturer,
                    as: 'lecturer',
                    attributes: ['lecturer_id', 'name']
                },
                {
                    model: models.Room,
                    as: 'requestedRoom',
                    attributes: ['room_id', 'room_name']
                }
            ],
            order: [['created_at', 'DESC']]
        });
        return scheduleChangeRequests;
    }
    catch (error) {
        console.error("Error fetching schedule change requests:", error);
        throw error;
    }
};

// Hàm sinh mã request_id tự động
const generateRequestId = (lecturerId, classScheduleId, slotRequest) => {
    // Đảm bảo lecturer_id và class_schedule_id được chuyển thành string
    const lecturerIdStr = String(lecturerId).padStart(3, '0'); // Đệm 0 phía trước nếu cần
    const classScheduleIdStr = String(classScheduleId).padStart(1, '0'); // Đệm 0 phía trước nếu cần

    // Tạo timestamp dễ đọc (YYYYMMDD_HHMMSS)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const timestamp = `${year}${month}${day}`;

    return `REQ_${lecturerIdStr}_${classScheduleIdStr}_${slotRequest}_${timestamp}`; // Kết hợp với timestamp để đảm bảo tính duy nhất
};

export const CreateScheduleChangeRequestService = async (data) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!data.class_schedule_id) {
            throw new Error("Thiếu thông tin class_schedule_id");
        }

        // Lấy thông tin lịch học hiện tại
        const currentSchedule = await ClassSchedule.findByPk(data.class_schedule_id);
        if (!currentSchedule) {
            throw new Error("Lịch học không tồn tại");
        }

        // Kiểm tra quyền của giảng viên - chỉ cho phép giảng viên được phân công dạy lớp này mới được tạo yêu cầu
        if (currentSchedule.lecturer_id !== data.lecturer_id) {
            throw new Error("Bạn không được phép gửi yêu cầu thay đổi lịch học này. Chỉ giảng viên được phân công dạy mới có quyền gửi yêu cầu.");
        }


        // Sinh mã request_id tự động
        const requestId = generateRequestId(data.lecturer_id, data.class_schedule_id, data.requested_slot_id);

        // Thêm request_id vào data
        const requestData = {
            ...data,
            request_id: requestId
        };

        // Kiểm tra xem đã có yêu cầu thay đổi lịch học nào cho lịch học này chưa
        const existingRequest = await ScheduleChangeRequest.findOne({
            where: {
                class_schedule_id: data.class_schedule_id,
                status: ['PENDING', 'APPROVED']
            }
        });

        if (existingRequest) {
            throw new Error("Đã có yêu cầu thay đổi lịch học cho lịch học này đang chờ xử lý hoặc đã được phê duyệt. Không thể tạo yêu cầu mới.");
        }

        // Kiểm tra xung đột lịch học khi có đầy đủ thông tin yêu cầu thay đổi
        if (data.requested_date && data.requested_room_id && data.requested_slot_id && data.lecturer_id) {
            // Kiểm tra xung đột với các lịch học khác (trùng cả 5 yếu tố: date, room, class, slot, lecturer)
            const conflictingSchedules = await ClassSchedule.findAll({
                where: {
                    date: data.requested_date,
                    slot_id: data.requested_slot_id,
                    room_id: data.requested_room_id,
                    class_id: currentSchedule.class_id,
                    lecturer_id: data.lecturer_id,
                    class_schedule_id: { [Op.ne]: data.class_schedule_id } // Loại trừ chính lịch học đang được yêu cầu thay đổi
                }
            });

            if (conflictingSchedules.length > 0) {
                throw new Error("Xung đột lịch học: Đã có lịch học trùng với ngày, phòng, lớp, slot và giảng viên được yêu cầu. Không thể tạo yêu cầu thay đổi.");
            }

            // Kiểm tra xung đột phòng học (cùng ngày, slot, phòng nhưng khác lớp)
            const roomConflicts = await ClassSchedule.findAll({
                where: {
                    date: data.requested_date,
                    slot_id: data.requested_slot_id,
                    room_id: data.requested_room_id,
                    class_schedule_id: { [Op.ne]: data.class_schedule_id }
                }
            });

            if (roomConflicts.length > 0) {
                throw new Error("Xung đột phòng học: Phòng đã được sử dụng vào thời gian này. Vui lòng chọn phòng khác hoặc thời gian khác.");
            }

            // Kiểm tra xung đột giảng viên (cùng ngày, slot, giảng viên nhưng khác lớp)
            const lecturerConflicts = await ClassSchedule.findAll({
                where: {
                    date: data.requested_date,
                    slot_id: data.requested_slot_id,
                    lecturer_id: data.lecturer_id,
                    class_schedule_id: { [Op.ne]: data.class_schedule_id }
                }
            });

            if (lecturerConflicts.length > 0) {
                throw new Error("Xung đột giảng viên: Giảng viên đã có lịch dạy vào thời gian này.");
            }

            // Kiểm tra xung đột lớp học (cùng ngày, slot, lớp nhưng khác phòng/giảng viên)
            const classConflicts = await ClassSchedule.findAll({
                where: {
                    date: data.requested_date,
                    slot_id: data.requested_slot_id,
                    class_id: currentSchedule.class_id,
                    class_schedule_id: { [Op.ne]: data.class_schedule_id }
                }
            });

            if (classConflicts.length > 0) {
                throw new Error("Xung đột lớp học: Lớp đã có lịch học vào thời gian này.");
            }
        }

        const scheduleChangeRequest = await ScheduleChangeRequest.create(requestData);
        return scheduleChangeRequest;
    }
    catch (error) {
        console.error("Error creating schedule change request:", error);
        throw error;
    }
};

// Duyệt yêu cầu thay đổi lịch học (Admin)
export const approveScheduleChangeRequestService = async (requestId, adminData) => {
    try {
        const scheduleChangeRequest = await ScheduleChangeRequest.findByPk(requestId, {
            include: [
                {
                    model: models.ClassSchedule,
                    as: 'classSchedule',
                    attributes: ['class_schedule_id', 'semester_id', 'class_id', 'program_id', 'date', 'day', 'slot_id', 'subject_id', 'lecturer_id', 'room_id']
                }
            ]
        });

        if (!scheduleChangeRequest) {
            throw new Error("Yêu cầu thay đổi lịch học không tồn tại");
        }

        if (scheduleChangeRequest.status !== 'PENDING') {
            throw new Error("Chỉ có thể duyệt yêu cầu đang ở trạng thái chờ xử lý");
        }

        // Kiểm tra lại xung đột trước khi duyệt
        if (scheduleChangeRequest.requested_date && scheduleChangeRequest.requested_room_id &&
            scheduleChangeRequest.requested_slot_id && scheduleChangeRequest.lecturer_id) {

            const conflictingSchedules = await ClassSchedule.findAll({
                where: {
                    date: scheduleChangeRequest.requested_date,
                    slot_id: scheduleChangeRequest.requested_slot_id,
                    room_id: scheduleChangeRequest.requested_room_id,
                    class_schedule_id: { [Op.ne]: scheduleChangeRequest.class_schedule_id }
                }
            });

            if (conflictingSchedules.length > 0) {
                throw new Error("Không thể duyệt: Hiện tại có xung đột lịch học với yêu cầu này");
            }
        }
        // lưu lại ngày gốc trước khi cập nhật
        await scheduleChangeRequest.update({
            original_date: scheduleChangeRequest.classSchedule.date,
            original_room_id: scheduleChangeRequest.classSchedule.room_id,
            original_slot_id: scheduleChangeRequest.classSchedule.slot_id,
        });
        // Cập nhật lịch học gốc với thông tin mới
        const originalSchedule = scheduleChangeRequest.classSchedule;
        await ClassSchedule.update({
            date: scheduleChangeRequest.requested_date || originalSchedule.date,
            room_id: scheduleChangeRequest.requested_room_id || originalSchedule.room_id,
            slot_id: scheduleChangeRequest.requested_slot_id || originalSchedule.slot_id
        }, {
            where: { class_schedule_id: scheduleChangeRequest.class_schedule_id }
        });

        // Cập nhật trạng thái yêu cầu
        await scheduleChangeRequest.update({
            status: 'APPROVED',
            approved_at: new Date()
        });

        return scheduleChangeRequest;
    }
    catch (error) {
        console.error("Error approving schedule change request:", error);
        throw error;
    }
};

// Từ chối yêu cầu thay đổi lịch học (Admin)
export const rejectScheduleChangeRequestService = async (requestId, rejectionReason) => {
    try {
        const scheduleChangeRequest = await ScheduleChangeRequest.findByPk(requestId);

        if (!scheduleChangeRequest) {
            throw new Error("Yêu cầu thay đổi lịch học không tồn tại");
        }

        if (scheduleChangeRequest.status !== 'PENDING') {
            throw new Error("Chỉ có thể từ chối yêu cầu đang ở trạng thái chờ xử lý");
        }

        // Cập nhật trạng thái yêu cầu
        await scheduleChangeRequest.update({
            status: 'REJECTED',
            reason: rejectionReason || scheduleChangeRequest.reason,
            updated_at: new Date()
        });

        return scheduleChangeRequest;
    }
    catch (error) {
        console.error("Error rejecting schedule change request:", error);
        throw error;
    }
};