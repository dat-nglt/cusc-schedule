import {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    importProgramsFromJSON
} from "../services/programService";
import { APIResponse } from "../utils/APIResponse";
import ExcelUtils from "../utils/ExcelUtils.js";

export const getAllProgramsController = async (req, res) => {
    try {
        const programs = await getAllPrograms();
        return APIResponse(res, 200, programs, "Programs fetched successfully");
    } catch (error) {
        console.error("Error fetching programs:", error);
        return APIResponse(res, 500, error.message || "Error fetching programs");
    }
}

export const getProgramByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const program = await getProgramById(id);
        if (!program) {
            return APIResponse(res, 404, null, "Program not found");
        }
        return APIResponse(res, 200, program, "Program fetched successfully");
    } catch (error) {
        console.error(`Error fetching program with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error fetching program");
    }
}

export const createProgramController = async (req, res) => {
    const programData = req.body;
    try {
        const program = await createProgram(programData);
        return APIResponse(res, 201, program, "Program created successfully");
    } catch (error) {
        console.error("Error creating program:", error);
        return APIResponse(res, 500, error.message || "Error creating program");
    }
}

export const updateProgramController = async (req, res) => {
    const { id } = req.params;
    const programData = req.body;
    try {
        const program = await updateProgram(id, programData);
        if (!program) {
            return APIResponse(res, 404, null, "Program not found");
        }
        return APIResponse(res, 200, program, "Program updated successfully");
    } catch (error) {
        console.error(`Error updating program with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error updating program");
    }
}


export const deleteProgramController = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deleteProgram(id);
        return APIResponse(res, 200, response, "Program deleted successfully");
    } catch (error) {
        console.error(`Error deleting program with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error deleting program");
    }
}
export const importProgramsFromJSONController = async (req, res) => {
    const { programs } = req.body;
    try {
        console.log("DEBUG programs:", programs);
        if (!programs || !Array.isArray(programs)) {
            return APIResponse(res, 400, null, "Invalid data format");
        }

        if (programs.length === 0) {
            return APIResponse(res, 400, null, "No programs to import");
        }

        const results = await importProgramsFromJSON(programs);

        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} chương trình`
        };

        if (results.errors.length > 0) {
            response.message = `Thêm hoàn tất với ${results.success.length}/${programs.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        } else {
            return APIResponse(res, 200, response, response.message);
        }
    } catch (error) {
        console.error("Error importing programs from JSON:", error);
        return APIResponse(res, 500, null, "Error importing programs from JSON");
    }
}


// Download template Excel
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo template buffer
        const buffer = ExcelUtils.createProgramTemplate();

        // Set headers để download
        res.setHeader('Content-Disposition', 'attachment; filename=program_template.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);

    } catch (error) {
        console.error("Error creating template:", error);
        return APIResponse(res, 500, null, "Lỗi khi tạo template");
    }
};