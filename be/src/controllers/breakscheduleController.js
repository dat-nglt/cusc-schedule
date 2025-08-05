import {
  getAllBreakSchedulesService,
  getBreakScheduleByIdService,
  createBreakScheduleService,
  updateBreakScheduleService,
  deleteBreakScheduleService,
  listBreakSchedulesService,
  importBreakSchedulesFromExcelService,
  importBreakSchedulesFromJsonService,
  validateBreakScheduleExcelTemplateService,
} from "../services/breakscheduleService.js";
import {
  successResponse,
  errorResponse,
  APIResponse,
} from "../utils/APIResponse.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import path from "path";

/**
 * @route GET /api/breakschedules/
 * @desc Lấy tất cả các lịch nghỉ có sẵn trong hệ thống.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getAllBreakSchedulesController = async (req, res) => {
  try {
    const breakSchedules = await getAllBreakSchedulesService();
    if (!breakSchedules || breakSchedules.length === 0) {
      return APIResponse(res, 200, [], "Không tìm thấy lịch nghỉ nào.");
    }

    return APIResponse(
      res,
      200,
      breakSchedules,
      "Lấy tất cả lịch nghỉ thành công."
    );
  } catch (error) {
    console.error("Lỗi khi lấy tất cả lịch nghỉ:", error);
    return APIResponse(
      res,
      500,
      null,
      "Đã xảy ra lỗi khi lấy danh sách lịch nghỉ."
    );
  }
};

/**
 * @route GET /api/breakschedules/:break_id
 * @desc Lấy thông tin chi tiết một lịch nghỉ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.break_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const getBreakScheduleByIdController = async (req, res) => {
  const { break_id } = req.params;
  try {
    const breakSchedule = await getBreakScheduleByIdService(break_id);

    if (!breakSchedule) {
      return APIResponse(res, 404, null, "Không tìm thấy lịch nghỉ.");
    }

    return APIResponse(
      res,
      200,
      breakSchedule,
      "Lấy thông tin lịch nghỉ thành công."
    );
  } catch (error) {
    console.error(`Lỗi khi lấy lịch nghỉ với ID ${break_id}:`, error);
    return APIResponse(
      res,
      500,
      null,
      "Đã xảy ra lỗi khi lấy thông tin lịch nghỉ."
    );
  }
};

/**
 * @route POST /api/breakschedules/add
 * @desc Tạo một lịch nghỉ mới.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body` dữ liệu lịch nghỉ).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const createBreakScheduleController = async (req, res) => {
  try {
    const newBreakSchedule = await createBreakScheduleService(req.body);
    return APIResponse(res, 201, newBreakSchedule, "Tạo lịch nghỉ thành công.");
  } catch (error) {
    // Xử lý các lỗi cụ thể từ service
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return APIResponse(res, 400, null, messages.join(", "));
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      const messages = error.errors.map((e) => `${e.path} đã tồn tại`);
      return APIResponse(res, 409, null, messages.join(", "));
    }

    // Lỗi chung
    console.error("Lỗi khi tạo lịch nghỉ:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi khi tạo lịch nghỉ."
    );
  }
};

/**
 * @route PUT /api/breakschedules/edit/:break_id
 * @desc Cập nhật thông tin một lịch nghỉ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.break_id` và `req.body` dữ liệu cập nhật).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const updateBreakScheduleController = async (req, res) => {
  const { break_id } = req.params;
  try {
    const updatedBreakSchedule = await updateBreakScheduleService(
      break_id,
      req.body
    );

    if (!updatedBreakSchedule) {
      return APIResponse(
        res,
        404,
        null,
        "Không tìm thấy lịch nghỉ để cập nhật."
      );
    }

    return APIResponse(
      res,
      200,
      updatedBreakSchedule,
      "Cập nhật lịch nghỉ thành công."
    );
  } catch (error) {
    // Xử lý các lỗi cụ thể từ service
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return APIResponse(res, 400, null, messages.join(", "));
    }

    // Lỗi chung
    console.error(`Lỗi khi cập nhật lịch nghỉ với ID ${break_id}:`, error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi cập nhật lịch nghỉ.");
  }
};

/**
 * @route DELETE /api/breakschedules/delete/:break_id
 * @desc Xóa một lịch nghỉ bằng ID.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.params.break_id`).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */

export const deleteBreakScheduleController = async (req, res) => {
  const { break_id } = req.params;
  try {
    const isDeleted = await deleteBreakScheduleService(break_id);

    if (!isDeleted) {
      return APIResponse(res, 404, null, "Không tìm thấy lịch nghỉ để xóa.");
    }

    return APIResponse(res, 200, null, "Xóa lịch nghỉ thành công.");
  } catch (error) {
    // Xử lý các lỗi cụ thể từ service
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return APIResponse(
        res,
        409,
        null,
        "Không thể xóa lịch nghỉ vì có dữ liệu liên quan."
      );
    }

    // Lỗi chung
    console.error(`Lỗi khi xóa lịch nghỉ với ID ${break_id}:`, error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi xóa lịch nghỉ.");
  }
};

/**
 * @route GET /api/breakschedules/list
 * @desc Lấy danh sách các lịch nghỉ có áp dụng các bộ lọc từ query parameters.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.query` các bộ lọc).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */

export const listBreakSchedulesController = async (req, res) => {
  try {
    const { break_id, break_type, break_start_date } = req.query;

    // Xây dựng đối tượng filters gọn gàng hơn
    const filters = {
      ...(break_id && { break_id }),
      ...(break_type && { break_type }),
      ...(break_start_date && { break_start_date }),
    };

    const breakSchedules = await listBreakSchedulesService(filters);

    if (!breakSchedules || breakSchedules.length === 0) {
      return APIResponse(res, 200, [], "Không tìm thấy lịch nghỉ nào.");
    }

    return APIResponse(
      res,
      200,
      breakSchedules,
      "Lấy danh sách lịch nghỉ thành công."
    );
  } catch (error) {
    console.error("Lỗi khi liệt kê lịch nghỉ:", error);
    return APIResponse(
      res,
      500,
      null,
      "Đã xảy ra lỗi khi liệt kê danh sách lịch nghỉ."
    );
  }
};

/**
 * @route POST /api/breakschedules/import
 * @desc Nhập dữ liệu lịch nghỉ từ file Excel được tải lên.
 * Thực hiện validate file, validate template và sau đó import dữ liệu.
 * @param {Object} req - Đối tượng Request của Express (chứa `req.file` từ Multer).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */

export const importBreakSchedulesController = async (req, res) => {
  try {
    if (!req.file) {
      return APIResponse(res, 400, null, "Vui lòng chọn file Excel để import.");
    }

    const fileBuffer = req.file.buffer;
    const allowedExtensions = [".xlsx", ".xls"];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return APIResponse(
        res,
        400,
        null,
        "Chỉ chấp nhận file Excel (.xlsx, .xls)."
      );
    }

    const templateValidation =
      validateBreakScheduleExcelTemplateService(fileBuffer);
    if (!templateValidation.valid) {
      return APIResponse(
        res,
        400,
        null,
        templateValidation.error ||
          "Cấu trúc template Excel không hợp lệ. Vui lòng sử dụng template mẫu."
      );
    }

    const results = await importBreakSchedulesFromExcelService(fileBuffer);
    const { total, success, errors } = results;

    const responseData = {
      summary: { total, success: success.length, errors: errors.length },
      successRecords: success,
      errorRecords: errors,
    };

    if (errors.length > 0) {
      const message = `Import hoàn tất với ${success.length}/${total} bản ghi thành công.`;
      return APIResponse(res, 207, responseData, message);
    } else {
      const message = `Import thành công ${success.length} lịch nghỉ.`;
      return APIResponse(res, 200, responseData, message);
    }
  } catch (error) {
    console.error("Lỗi khi import lịch nghỉ từ file Excel:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi trong quá trình import file Excel."
    );
  }
};

/**
 * @route GET /api/breakschedules/template/download
 * @desc Tải xuống template Excel mẫu cho lịch nghỉ.
 * @param {Object} req - Đối tượng Request của Express.
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer) - Hoặc Public tùy theo yêu cầu
 */
export const downloadBreakScheduleTemplateController = async (req, res) => {
  try {
    const buffer = ExcelUtils.createBreakScheduleTemplate();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lich_nghi_mau.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", buffer.length);

    res.status(200).send(buffer);
  } catch (error) {
    console.error("Lỗi khi tạo và tải xuống template lịch nghỉ:", error);
    return APIResponse(res, 500, null, "Đã xảy ra lỗi khi tạo template.");
  }
};

/**
 * @route POST /api/breakschedules/importJson
 * @desc Nhập dữ liệu lịch nghỉ từ dữ liệu JSON (thường dùng cho tính năng xem trước từ frontend).
 * @param {Object} req - Đối tượng Request của Express (chứa `req.body.breakSchedules` là mảng JSON).
 * @param {Object} res - Đối tượng Response của Express.
 * @access Private (admin, training_officer)
 */
export const importBreakSchedulesFromJsonService = async (
  breakSchedulesData
) => {
  if (!breakSchedulesData || !Array.isArray(breakSchedulesData)) {
    throw new Error("Dữ liệu lịch nghỉ không hợp lệ.");
  }

  const results = { success: [], errors: [] };

  // Sử dụng Promise.all để xử lý song song, cải thiện hiệu suất
  const importPromises = breakSchedulesData.map(
    async (breakScheduleData, index) => {
      const recordIndex = index + 1;
      const transaction = await sequelize.transaction();

      try {
        // Validation và làm sạch dữ liệu
        if (
          !breakScheduleData.break_id ||
          !breakScheduleData.break_type ||
          !breakScheduleData.break_start_date ||
          !breakScheduleData.break_end_date
        ) {
          throw new Error("Các trường bắt buộc không được để trống.");
        }

        const cleanedData = {
          break_id: breakScheduleData.break_id.toString().trim(),
          break_type: breakScheduleData.break_type.toString().trim(),
          break_start_date: breakScheduleData.break_start_date || null,
          break_end_date: breakScheduleData.break_end_date || null,
          number_of_days: breakScheduleData.number_of_days
            ? parseInt(breakScheduleData.number_of_days)
            : null,
          description: breakScheduleData.description?.toString().trim() || null,
          status: breakScheduleData.status?.toString().trim() || "Hoạt động",
        };

        const startDate = new Date(cleanedData.break_start_date);
        const endDate = new Date(cleanedData.break_end_date);
        const maxFutureDate = new Date();
        maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 5);

        if (isNaN(startDate) || isNaN(endDate)) {
          throw new Error("Định dạng ngày không hợp lệ.");
        }
        if (startDate > endDate) {
          throw new Error(
            "Thời gian bắt đầu không được lớn hơn thời gian kết thúc."
          );
        }
        if (endDate > maxFutureDate) {
          throw new Error(
            "Thời gian kết thúc không được quá 5 năm trong tương lai."
          );
        }

        // Kiểm tra tồn tại
        const existingBreakSchedule = await BreakSchedule.findByPk(
          cleanedData.break_id,
          { transaction }
        );
        if (existingBreakSchedule) {
          throw new Error("Mã lịch nghỉ đã tồn tại.");
        }

        // Tạo lịch nghỉ mới
        const newBreakSchedule = await BreakSchedule.create(cleanedData, {
          transaction,
        });
        await transaction.commit();

        return newBreakSchedule;
      } catch (error) {
        if (transaction && !transaction.finished) {
          await transaction.rollback();
        }
        return {
          isError: true,
          row: recordIndex,
          break_id: breakScheduleData.break_id || "N/A",
          error: error.message || "Lỗi không xác định.",
        };
      }
    }
  );

  const allResults = await Promise.all(importPromises);

  // Phân loại kết quả
  allResults.forEach((result) => {
    if (result?.isError) {
      results.errors.push(result);
    } else {
      results.success.push(result);
    }
  });

  return results;
};
