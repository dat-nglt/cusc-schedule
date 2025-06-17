import { getAllLecturers, getLecturerById } from "../services/lecturerService";
import { APIResponse } from "../utils/APIResponse.js";


export const getAllLecturersController = async (req, res) => {
    try {
        const lecturers = await getAllLecturers();
        return APIResponse(res, 200, lecturers, "Lecturers fetched successfully");
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        return APIResponse(res, 500, error.message || "Error fetching lecturers");
    }
}

export const getLecturerByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const lecturer = await getLecturerById(id);
        if (!lecturer) {
            return APIResponse(res, 404, null, "Lecturer not found");
        }
        return APIResponse(res, 200, lecturer, "Lecturer fetched successfully");
    } catch (error) {
        console.error(`Error fetching lecturer with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error fetching lecturer");
    }
}