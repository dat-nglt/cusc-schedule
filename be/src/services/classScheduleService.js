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
                    as: 'room',
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

export const getClassScheduleForLecturerService = async (lecturerId) => {
    try {
        const classSchedule = await ClassSchedule.findAll({
            where: {
                lecturer_id: lecturerId
            },
            include: [
                {
                    model: models.Lecturer,
                    as: 'lecturer',
                    attributes: ['lecturer_id', 'name']
                },
                {
                    model: models.Room,
                    as: 'room',
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
        console.error("Error fetching class schedule for lecturer:", error);
        throw error;
    }
};

export const getClassScheduleForStudentService = async (studentId) => {
    try {
        // First, get the student's class_id
        const student = await models.Student.findByPk(studentId, {
            attributes: ['class_id']
        });

        if (!student || !student.class_id) {
            return [];
        }

        // Then get class schedules for that class
        const classSchedule = await ClassSchedule.findAll({
            where: {
                class_id: student.class_id
            },
            include: [
                {
                    model: models.Lecturer,
                    as: 'lecturer',
                    attributes: ['lecturer_id', 'name']
                },
                {
                    model: models.Room,
                    as: 'room',
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
        console.error("Error fetching class schedule for student:", error);
        throw error;
    }
};






