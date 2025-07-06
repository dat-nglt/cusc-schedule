import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  listClasses,
  importClassesFromExcel,
  importClassesFromJson,
  validateExcelTemplate
} from "../services/classService.js";
import { successResponse, errorResponse, APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import path from "path";

// GET /classes
export const getAllClassesController = async (req, res) => {
  try {
    const classes = await getAllClasses();
    return successResponse(res, classes, "Classes fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message || "Error fetching classes", 500);
  }
};

// GET /classes/:class_id
export const getClassByIdController = async (req, res) => {
  try {
    const classInstance = await getClassById(req.params.class_id);
    if (!classInstance) return errorResponse(res, "Class not found", 404);
    return successResponse(res, classInstance, "Class fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /classes/add
export const createClassController = async (req, res) => {
  try {
    const { class_id, class_name, class_size, status, course_id } = req.body;
    if (!class_id) {
      return errorResponse(res, "Mã lớp học là bắt buộc", 400);
    }
    if (class_name && class_name.length > 50) {
      return errorResponse(res, "Tên lớp học không được vượt quá 50 ký tự", 400);
    }
    const classInstance = await createClass(req.body);
    return successResponse(res, classInstance, "Class created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// PUT /classes/edit/:class_id
export const updateClassController = async (req, res) => {
  try {
    const { class_name } = req.body;
    if (class_name && class_name.length > 50) {
      return errorResponse(res, "Tên lớp học không được vượt quá 50 ký tự", 400);
    }
    const classInstance = await updateClass(req.params.class_id, req.body);
    return successResponse(res, classInstance, "Class updated");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// DELETE /classes/delete/:class_id
export const deleteClassController = async (req, res) => {
  try {
    await deleteClass(req.params.class_id);
    return successResponse(res, null, "Class deleted");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// GET /classes/list
export const listClassesController = async (req, res) => {
  try {
    const { class_id, class_name, status, course_id } = req.query;
    const filters = { class_id, class_name, status, course_id };
    const classes = await listClasses(filters);
    return res.json(classes);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error listing classes" });
  }
};

// POST /classes/import
export const importClassesController = async (req, res) => {
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
    const results = await importClassesFromExcel(fileBuffer);

    const response = {
      summary: {
        total: results.total,
        success: results.success.length,
        errors: results.errors.length,
      },
      successRecords: results.success,
      errorRecords: results.errors,
    };

    if (results.errors.length > 0) {
      return APIResponse(res, 207, response, `Import hoàn tất với ${results.success.length}/${results.total} bản ghi thành công`);
    } else {
      return APIResponse(res, 200, response, `Import thành công ${results.success.length} lớp học`);
    }
  } catch (error) {
    console.error("Error importing classes:", error);
    return APIResponse(res, 500, null, error.message || "Lỗi khi import file Excel");
  }
};

// GET /classes/template
export const downloadTemplateController = async (req, res) => {
  try {
    // Create template buffer
    const buffer = ExcelUtils.createClassTemplate();

    // Set headers for download
    res.setHeader('Content-Disposition', 'attachment; filename=class_template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return res.send(buffer);
  } catch (error) {
    console.error("Error creating template:", error);
    return APIResponse(res, 500, null, "Lỗi khi tạo template");
  }
};

// POST /classes/import-json
export const importClassesFromJsonController = async (req, res) => {
  try {
    const { classes } = req.body;

    if (!classes || !Array.isArray(classes)) {
      return APIResponse(res, 400, null, "Dữ liệu lớp học không hợp lệ");
    }

    if (classes.length === 0) {
      return APIResponse(res, 400, null, "Không có dữ liệu lớp học để import");
    }

    // Import data
    const results = await importClassesFromJson(classes);

    const response = {
      success: true,
      imported: results.success,
      errors: results.errors,
      message: `Import thành công ${results.success.length} lớp học`,
    };

    if (results.errors.length > 0) {
      response.message = `Import hoàn tất với ${results.success.length}/${classes.length} bản ghi thành công`;
      return APIResponse(res, 207, response, response.message);
    } else {
      return APIResponse(res, 200, response, response.message);
    }
  } catch (error) {
    console.error("Error importing classes from JSON:", error);
    return APIResponse(res, 500, null, error.message || "Lỗi khi import dữ liệu");
  }
};