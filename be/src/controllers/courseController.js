import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  listCourses,
  importCoursesFromExcel,
  importCoursesFromJson,
  validateExcelTemplate
} from "../services/courseService.js";
import { successResponse, errorResponse, APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
const path = require('path');


export const getAllCoursesController = async (req, res) => {
  try {
    const courses = await getAllCourses();
    return successResponse(res, courses, "Courses fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message || "Error fetching courses", 500);
  }
};

// GET /courses/:course_id
export const getCourseByIdController = async (req, res) => {
  try {
    const course = await getCourseById(req.params.course_id);
    if (!course) return errorResponse(res, "Course not found", 404);
    return successResponse(res, course, "Course fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /courses/add
export const createCourseController = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    return successResponse(res, course, "Course created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// PUT /courses/edit/:course_id
export const updateCourseController = async (req, res) => {
  try {
    const course = await updateCourse(req.params.course_id, req.body);
    return successResponse(res, course, "Course updated");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// DELETE /courses/delete/:course_id
export const deleteCourseController = async (req, res) => {
  try {
    await deleteCourse(req.params.course_id);
    return successResponse(res, null, "Course deleted");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// LẤY DANH SÁCH CÁC KHÓA HỌC VỚI CÁC BỘ LỌC
export const listCoursesController = async (req, res) => {
  try {
    const { course_id, course_name, start_date } = req.query;

    const filters = { course_id, course_name, start_date };

    const courses = await listCourses(filters);

    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error listing courses" });
  }
};
// Import courses from Excel file
export const importCoursesController = async (req, res) => {
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
            return APIResponse(res, 400, null, templateValidation.error || "Template không hợp lệ");
        }

        // Import data
        const results = await importCoursesFromExcel(fileBuffer);

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
            return APIResponse(res, 200, response, `Import thành công ${results.success.length} khóa học`);
        }

    } catch (error) {
        console.error("Error importing courses:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi import file Excel");
    }
};

// Download template Excel
export const downloadTemplateController = async (req, res) => {
    try {
        // Tạo template buffer
        const buffer = ExcelUtils.createCourseTemplate();

        // Set headers để download
        res.setHeader('Content-Disposition', 'attachment; filename=course_template.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return res.send(buffer);

    } catch (error) {
        console.error("Error creating template:", error);
        return APIResponse(res, 500, null, "Lỗi khi tạo template");
    }
};

// Import courses from JSON data (for preview feature)
export const importCoursesFromJsonController = async (req, res) => {
    try {
        const { courses } = req.body;

        if (!courses || !Array.isArray(courses)) {
            return APIResponse(res, 400, null, "Dữ liệu khóa học không hợp lệ");
        }

        if (courses.length === 0) {
            return APIResponse(res, 400, null, "Không có dữ liệu khóa học để import");
        }

        // Import data
        const results = await importCoursesFromJson(courses);

        const response = {
            success: true,
            imported: results.success,
            errors: results.errors,
            message: `Import thành công ${results.success.length} khóa học`
        };

        if (results.errors.length > 0) {
            response.message = `Import hoàn tất với ${results.success.length}/${courses.length} bản ghi thành công`;
            return APIResponse(res, 207, response, response.message);
        } else {
            return APIResponse(res, 200, response, response.message);
        }

    } catch (error) {
        console.error("Error importing courses from JSON:", error);
        return APIResponse(res, 500, null, error.message || "Lỗi khi import dữ liệu");
    }
};