import {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectsBySemester,
    importSubjectsFromJSON
} from "../services/subjectService";
import { APIResponse } from "../utils/APIResponse";
import ExcelUtils from "../utils/ExcelUtils";

export const getAllSubjectsController = async (req, res) => {
    try {
        const subjects = await getAllSubjects();
        return APIResponse(res, 200, subjects, "Subjects fetched successfully");
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return APIResponse(res, 500, error.message || "Error fetching subjects");
    }
};

export const getSubjectByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await getSubjectById(id);
        if (!subject) {
            return APIResponse(res, 404, null, "Subject not found");
        }
        return APIResponse(res, 200, subject, "Subject fetched successfully");
    } catch (error) {
        console.error(`Error fetching subject with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error fetching subject");
    }
};

export const createSubjectController = async (req, res) => {
    const subjectData = req.body;
    try {
        const subject = await createSubject(subjectData);
        return APIResponse(res, 201, subject, "Subject created successfully");
    } catch (error) {
        console.error("Error creating subject:", error);
        return APIResponse(res, 500, error.message || "Error creating subject");
    }
};

export const updateSubjectController = async (req, res) => {
    const { id } = req.params;
    const subjectData = req.body;
    try {
        const subject = await updateSubject(id, subjectData);
        if (!subject) {
            return APIResponse(res, 404, null, "Subject not found");
        }
        return APIResponse(res, 200, subject, "Subject updated successfully");
    } catch (error) {
        console.error(`Error updating subject with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error updating subject");
    }
};


export const deleteSubjectController = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deleteSubject(id);
        return APIResponse(res, 200, response, "Subject deleted successfully");
    } catch (error) {
        console.error(`Error deleting subject with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error deleting subject");
    }
};

export const getSubjectsBySemesterController = async (req, res) => {
    const { semesterId } = req.params;
    try {
        const subjects = await getSubjectsBySemester(semesterId);
        if (!subjects || subjects.length === 0) {
            return APIResponse(res, 404, null, "No subjects found for this semester");
        }
        return APIResponse(res, 200, subjects, "Subjects fetched successfully for semester");
    } catch (error) {
        console.error(`Error fetching subjects for semester ${semesterId}:`, error);
        return APIResponse(res, 500, error.message || "Error fetching subjects for semester");
    }
};

export const importSubjectsFromJSONController = async (req, res) => {
    const { subjects } = req.body;
    try {
        if (!subjects || !Array.isArray(subjects)) {
            return APIResponse(res, 400, null, "Invalid data format");
        }

        if (subjects.length === 0) {
            return APIResponse(res, 400, null, "No subjects to import");
        }

        const results = await importSubjectsFromJSON(subjects);

        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} môn học`
        };

        if (results.errors.length > 0) {
            response.message = `Thêm hoàn tất với ${results.success.length}/${subjects.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        } else {
            return APIResponse(res, 200, response, response.message);
        }
    } catch (error) {
        console.error("Error importing subjects:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi thêm dữ liệu");
    }
};

export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo template buffer
        const buffer = ExcelUtils.createSubjectTemplate();

        // Set headers để download
        res.setHeader('Content-Disposition', 'attachment; filename=subjects_template.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);

    } catch (error) {
        console.error("Error creating template:", error);
        return APIResponse(res, 500, null, "Lỗi khi tạo template");
    }
};

