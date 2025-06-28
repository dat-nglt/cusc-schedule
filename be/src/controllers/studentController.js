import {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    importstudentsFromJSON,
    deleteStudent,
    validateExcelTemplate
} from "../services/studentService.js";
import { APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";

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

//Import Students from JSON
export const importStudentsFromJSONController = async (req, res) => {
    try {
        const { students } = req.body;

        if (!students || !Array.isArray(students)) {
            return APIResponse(res, 400, null, "Dữ liệu học viên không hợp lệ.");
        }

        if (students.length === 0) {
            return APIResponse(res, 400, null, "Không có học viên nào để thêm.");
        }

        //import data
        const results = await importstudentsFromJSON(students);
        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Đã thêm thành công ${results.success.length} học viên`
        };

        if (results.errors.length > 0) {
            response.message = `Thêm hoàn tất với ${results.success.length}/${students.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        } else {
            return APIResponse(res, 200, response, response.message);
        }

    } catch (error) {
        console.error("Error importing students from JSON:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi thêm dữ liệu");
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
