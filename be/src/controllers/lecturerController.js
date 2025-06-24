import { getAllLecturers, getLecturerById, createLecturer, updateLecturer, deleteLecturer, importLecturersFromExcel, validateExcelTemplate } from "../services/lecturerService";
import { APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import multer from 'multer';
import path from 'path';

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

// Import lecturers from Excel
export const importLecturersController = async (req, res) => {
    try {
        if (!req.file) {
            return APIResponse(res, 400, null, "Vui lòng chọn file Excel");
        }

        const fileBuffer = req.file.buffer;
        
        // Validate file extension
        const allowedExtensions = ['.xlsx', '.xls'];
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        
        if (!allowedExtensions.includes(fileExtension)) {
            return APIResponse(res, 400, null, "Chỉ chấp nhận file Excel (.xlsx, .xls)");
        }

        // Validate template structure
        const templateValidation = validateExcelTemplate(fileBuffer);
        if (!templateValidation.valid) {
            return APIResponse(res, 400, null, "Template không hợp lệ");
        }

        // Import data
        const results = await importLecturersFromExcel(fileBuffer);
        
        const response = {
            summary: {
                total: results.total,
                success: results.success.length,
                errors: results.errors.length
            },
            successRecords: results.success,
            errorRecords: results.errors
        };

        if (results.errors.length > 0) {
            return APIResponse(res, 207, response, `Import hoàn tất với ${results.success.length}/${results.total} bản ghi thành công`);
        } else {
            return APIResponse(res, 200, response, `Import thành công ${results.success.length} giảng viên`);
        }
        
    } catch (error) {
        console.error("Error importing lecturers:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi import file Excel");
    }
};

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

// Multer configuration for file upload
const storage = multer.memoryStorage();
export const uploadExcel = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.xlsx', '.xls'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'), false);
        }
    }
}).single('excel_file');