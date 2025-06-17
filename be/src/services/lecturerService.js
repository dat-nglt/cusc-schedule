import db from "../models";
const { Lecturer } = db;

export const getAllLecturers = async () => {
    try {
        const lecturers = await Lecturer.findAll();
        return lecturers;
    } catch (error) {
        console.error("Error getting lecturers:", error);
        throw error;
    }
};

export const getLecturerById = async (id) => {
    try {
        const lecturer = await Lecturer.findByPk(id);
        return lecturer;
    } catch (error) {
        console.error(`Error getting lecturer with id ${id}:`, error);
        throw error;
    }
};