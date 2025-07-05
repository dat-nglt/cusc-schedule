import {
  getAllBreakSchedules,
  getBreakScheduleById,
  createBreakSchedule,
  updateBreakSchedule,
  deleteBreakSchedule,
  listBreakSchedules,
  importBreakSchedulesFromExcel,
  importBreakSchedulesFromJson,
  validateBreakScheduleExcelTemplate,
} from "../services/breakscheduleService.js";
import { successResponse, errorResponse, APIResponse } from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
const path = require('path');

export const getAllBreakSchedulesController = async (req, res) => {
  try {
    const breakSchedules = await getAllBreakSchedules();
    return successResponse(res, breakSchedules, "Break schedules fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message || "Error fetching break schedules", 500);
  }
};

// GET /break-schedules/:break_id
export const getBreakScheduleByIdController = async (req, res) => {
  try {
    const breakSchedule = await getBreakScheduleById(req.params.break_id);
    if (!breakSchedule) return errorResponse(res, "Break schedule not found", 404);
    return successResponse(res, breakSchedule, "Break schedule fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /break-schedules/add
export const createBreakScheduleController = async (req, res) => {
  try {
    const breakSchedule = await createBreakSchedule(req.body);
    return successResponse(res, breakSchedule, "Break schedule created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// PUT /break-schedules/edit/:break_id
export const updateBreakScheduleController = async (req, res) => {
  try {
    const breakSchedule = await updateBreakSchedule(req.params.break_id, req.body);
    return successResponse(res, breakSchedule, "Break schedule updated");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// DELETE /break-schedules/delete/:break_id
export const deleteBreakScheduleController = async (req, res) => {
  try {
    await deleteBreakSchedule(req.params.break_id);
    return successResponse(res, null, "Break schedule deleted");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// LẤY DANH SÁCH CÁC LỊCH NGHỈ VỚI CÁC BỘ LỌC
export const listBreakSchedulesController = async (req, res) => {
  try {
    const { break_id, break_type, break_start_date } = req.query;

    const filters = { break_id, break_type, break_start_date };

    const breakSchedules = await listBreakSchedules(filters);

    return res.json(breakSchedules);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error listing break schedules" });
  }
};

// Import break schedules from Excel file
export const importBreakSchedulesController = async (req, res) => {
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
    const templateValidation = validateBreakScheduleExcelTemplate(fileBuffer);
    if (!templateValidation.valid) {
      return APIResponse(res, 400, null, templateValidation.error || "Template không hợp lệ");
    }

    // Import data
    const results = await importBreakSchedulesFromExcel(fileBuffer);

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
      return APIResponse(res, 200, response, `Import thành công ${results.success.length} lịch nghỉ`);
    }

  } catch (error) {
    console.error("Error importing break schedules:", error);
    return APIResponse(res, 500, null, error.message || "Lỗi khi import file Excel");
  }
};

// Download template Excel
export const downloadBreakScheduleTemplateController = async (req, res) => {
  try {
    // Tạo template buffer
    const buffer = ExcelUtils.createBreakScheduleTemplate();

    // Set headers để download
    res.setHeader('Content-Disposition', 'attachment; filename=break_schedule_template.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return res.send(buffer);

  } catch (error) {
    console.error("Error creating template:", error);
    return APIResponse(res, 500, null, "Lỗi khi tạo template");
  }
};

// Import break schedules from JSON data (for preview feature)
export const importBreakSchedulesFromJsonController = async (req, res) => {
  try {
    const { breakSchedules } = req.body;

    if (!breakSchedules || !Array.isArray(breakSchedules)) {
      return APIResponse(res, 400, null, "Dữ liệu lịch nghỉ không hợp lệ");
    }

    if (breakSchedules.length === 0) {
      return APIResponse(res, 400, null, "Không có dữ liệu lịch nghỉ để import");
    }

    // Import data
    const results = await importBreakSchedulesFromJson(breakSchedules);

    const response = {
      success: true,
      imported: results.success,
      errors: results.errors,
      message: `Import thành công ${results.success.length} lịch nghỉ`
    };

    if (results.errors.length > 0) {
      response.message = `Import hoàn tất với ${results.success.length}/${breakSchedules.length} bản ghi thành công`;
      return APIResponse(res, 207, response, response.message);
    } else {
      return APIResponse(res, 200, response, response.message);
    }

  } catch (error) {
    console.error("Error importing break schedules from JSON:", error);
    return APIResponse(res, 500, null, error.message || "Lỗi khi import dữ liệu");
  }
};