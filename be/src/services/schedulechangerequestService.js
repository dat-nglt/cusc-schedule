import models from "../models/index.js";

const { ScheduleChangeRequest } = models;

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

export const CreateScheduleChangeRequestService = async (data) => {
    try {
        const scheduleChangeRequest = await ScheduleChangeRequest.create(data);
        return scheduleChangeRequest;
    }
    catch (error) {
        console.error("Error creating schedule change request:", error);
        throw error;
    }
};
