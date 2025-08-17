import models from "../models/index.js";

const { ClassSchedule } = models;

export const getAllClassScheduleService = async () => {
    try {
        const classSchedule = await ClassSchedule.findAll({
            include: [
                {
                    model: models.Lecturer,
                    as: 'lecturer',
                    attributes: ['lecturer_id', 'name']
                },
                {
                    model: models.Room,
                    as: 'requestedRoom',
                    attributes: ['room_id', 'room_name']
                },
                {
                    model: models.Semester,
                    as: 'semester',
                    attributes: ['semester_id', 'semester_name']
                },
                {
                    model: models.Classes,
                    as: 'class',
                    attributes: ['class_id', 'class_name']
                },
                {
                    model: models.Program,
                    as: 'program',
                    attributes: ['program_id', 'program_name']
                },
                {
                    model: models.Subject,
                    as: 'subject',
                    attributes: ['subject_id', 'subject_name']
                },
            ],
        });
        return classSchedule;
    }
    catch (error) {
        console.error("Error fetching class cchedule:", error);
        throw error;
    }
};


