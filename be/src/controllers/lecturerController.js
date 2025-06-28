import {
    getAllLecturers,
    getLecturerById, createLecturer,
    updateLecturer, deleteLecturer,
    importLecturersFromJson
} from "../services/lecturerService";
import { APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";


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

export const createLecturerController = async (req, res) => {
    const lecturerData = req.body;
    try {
        const lecturer = await createLecturer(lecturerData);
        return APIResponse(res, 201, lecturer, "Lecturer created successfully");
    } catch (error) {
        console.error("Error creating lecturer:", error);
        return APIResponse(res, 500, error.message || "Error creating lecturer");
    }
}

export const updateLecturerController = async (req, res) => {
    const { id } = req.params;
    const lecturerData = req.body;
    try {
        const lecturer = await updateLecturer(id, lecturerData);
        if (!lecturer) {
            return APIResponse(res, 404, null, "Lecturer not found");
        }
        return APIResponse(res, 200, lecturer, "Lecturer updated successfully");
    } catch (error) {
        console.error(`Error updating lecturer with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error updating lecturer");
    }
};

export const deleteLecturerController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteLecturer(id);
        return APIResponse(res, 200, result, "Lecturer deleted successfully");
    } catch (error) {
        console.error(`Error deleting lecturer with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error deleting lecturer");
    }
}


// Download template Excel
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo template buffer
        const buffer = ExcelUtils.createLecturerTemplate();

        // Set headers để download
        res.setHeader('Content-Disposition', 'attachment; filename=lecturer_template.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);

    } catch (error) {
        console.error("Error creating template:", error);
        return APIResponse(res, 500, null, "Lỗi khi tạo template");
    }
};

// Import lecturers from JSON data (for preview feature)
export const importLecturersFromJsonController = async (req, res) => {
    try {
        const { lecturers } = req.body;

        if (!lecturers || !Array.isArray(lecturers)) {
            return APIResponse(res, 400, null, "Dữ liệu giảng viên không hợp lệ");
        }

        if (lecturers.length === 0) {
            return APIResponse(res, 400, null, "Không có dữ liệu giảng viên để thêm");
        }

        // Import data
        const results = await importLecturersFromJson(lecturers);

        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} giảng viên`
        };

        if (results.errors.length > 0) {
            response.message = `Thêm hoàn tất với ${results.success.length}/${lecturers.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        } else {
            return APIResponse(res, 200, response, response.message);
        }

    } catch (error) {
        console.error("Error importing lecturers from JSON:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi thêm dữ liệu");
    }
};
