import { getAllStudents, getStudentById, createStudent, updateStudent, importstudentsFromExcel, deleteStudent, validateExcelTemplate } from "../services/studentService.js";
import { APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import path from 'path';

export const getAllStudentsController = async (req, res) => {
    try {
        const Students = await getAllStudents();
        return APIResponse(res, 200, Students, "Students fetched successfully");
    } catch (error) {
        console.error("Error fetching Students:", error);
        return APIResponse(res, 500, error.message || "Error fetching Students");
    }
}

export const getStudentByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const Student = await getStudentById(id);
        if (!Student) {
            return APIResponse(res, 404, null, "Student not found");
        }
        return APIResponse(res, 200, Student, "Student fetched successfully");
    } catch (error) {
        console.error(`Error fetching Student with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error fetching Student");
    }
}

export const createStudentController = async (req, res) => {
    const StudentData = req.body;
    try {
        const Student = await createStudent(StudentData);
        return APIResponse(res, 201, Student, "Student created successfully");
    } catch (error) {
        console.error("Error creating Student:", error);
        return APIResponse(res, 500, error.message || "Error creating Student");
    }
}

export const updateStudentController = async (req, res) => {
    const { id } = req.params;
    const StudentData = req.body;
    try {
        const Student = await updateStudent(id, StudentData);
        if (!Student) {
            return APIResponse(res, 404, null, "Student not found");
        }
        return APIResponse(res, 200, Student, "Student updated successfully");
    } catch (error) {
        console.error(`Error updating Student with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error updating Student");
    }
};

export const deleteStudentController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteStudent(id);
        return APIResponse(res, 200, result, "Student deleted successfully");
    } catch (error) {
        console.error(`Error deleting Student with id ${id}:`, error);
        return APIResponse(res, 500, error.message || "Error deleting Student");
    }
}

// Import Students from Excel
export const importStudentsController = async (req, res) => {
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
        const results = await importstudentsFromExcel(fileBuffer);

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
            return APIResponse(res, 200, response, `Import thành công ${results.success.length} học viên`);
        }

    } catch (error) {
        console.error("Error importing Students:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi import file Excel");
    }
};

// Download template Excel
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo template buffer
        const buffer = ExcelUtils.createStudentTemplate();

        // Set headers để download
        res.setHeader('Content-Disposition', 'attachment; filename=Student_template.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);

    } catch (error) {
        console.error("Error creating template:", error);
        return APIResponse(res, 500, null, "Lỗi khi tạo template");
    }
};
