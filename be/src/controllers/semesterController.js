import {
    getAllSemesters,
    getSemesterById,
    createSemester,
    updateSemester,
    deleteSemester,
    importSemestersFromJSON
} from "../services/semesterService";
import { APIResponse } from "../utils/APIResponse";
import ExcelUtils from "../utils/ExcelUtils";

export const getAllSemestersController = async (req, res) => {
    try {
        const semesters = await getAllSemesters();
        return APIResponse(res, 200, semesters, "Semesters fetched successfully");
    } catch (error) {
        console.error("Error fetching semesters:", error);
        return APIResponse(res, 500, error.message || "Error fetching semesters");
    }
};

export const getSemesterByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const semester = await getSemesterById(id);
        if (!semester) {
            return APIResponse(res, 404, null, "Semester not found");
        }
        return APIResponse(res, 200, semester, "Semester fetched successfully");
    } catch (error) {
        console.error(`Error fetching semester with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error fetching semester");
    }
};

export const createSemesterController = async (req, res) => {
    const semesterData = req.body;
    try {
        const semester = await createSemester(semesterData);
        return APIResponse(res, 201, semester, "Semester created successfully");
    } catch (error) {
        console.error("Error creating semester:", error);
        return APIResponse(res, 500, error.message || "Error creating semester");
    }
};

export const updateSemesterController = async (req, res) => {
    const { id } = req.params;
    const semesterData = req.body;
    try {
        const semester = await updateSemester(id, semesterData);
        if (!semester) {
            return APIResponse(res, 404, null, "Semester not found");
        }
        return APIResponse(res, 200, semester, "Semester updated successfully");
    } catch (error) {
        console.error(`Error updating semester with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error updating semester");
    }
};

export const deleteSemesterController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteSemester(id);
        return APIResponse(res, 200, result, "Semester deleted successfully");
    } catch (error) {
        console.error(`Error deleting semester with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error deleting semester");
    }
};

export const importSemestersFromJSONController = async (req, res) => {
    const { semesters } = req.body;
    try {
        if (!semesters || !Array.isArray(semesters)) {
            return APIResponse(res, 400, null, "Invalid data format");
        }

        if (semesters.length === 0) {
            return APIResponse(res, 400, null, "No semesters to import");
        }

        const results = await importSemestersFromJSON(semesters);

        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} học kỳ`
        };

        if (results.errors.length > 0) {
            response.message = `Thêm hoàn tất với ${results.success.length}/${semesters.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        } else {
            return APIResponse(res, 200, response, response.message);
        }
    } catch (error) {
        console.error("Error importing semesters:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi thêm dữ liệu");
    }
};


export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo template buffer
        const buffer = ExcelUtils.createSemesterTemplate();

        // Set headers để download
        res.setHeader('Content-Disposition', 'attachment; filename=semesters_template.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);

    } catch (error) {
        console.error("Error creating template:", error);
        return APIResponse(res, 500, null, "Lỗi khi tạo template");
    }
};