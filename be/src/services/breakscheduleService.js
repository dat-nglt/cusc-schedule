import models from "../models/index.js";
import { Op } from "sequelize";
import ExcelUtils from "../utils/ExcelUtils.js";

/**
 * Lấy tất cả các lịch nghỉ.
 * @returns {Promise<Array>} Danh sách các lịch nghỉ.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllBreakSchedulesService = async () => {
  try {
    const breakSchedules = await BreakSchedule.findAll();
    return breakSchedules;
  } catch (error) {
    console.error("Lỗi service khi lấy danh sách lịch nghỉ:", error);
    throw new Error(
      "Lỗi khi truy vấn cơ sở dữ liệu để lấy danh sách lịch nghỉ."
    );
  }
};

/**
 * Lấy một lịch nghỉ theo ID.
 * @param {string} break_id - ID của lịch nghỉ.
 * @returns {Promise<Object|null>} Lịch nghỉ tìm thấy hoặc null nếu không tìm thấy.
 */
export const getBreakScheduleByIdService = async (break_id) => {
  try {
    const breakSchedule = await BreakSchedule.findByPk(break_id);
    return breakSchedule;
  } catch (error) {
    console.error("Lỗi service khi lấy lịch nghỉ theo ID:", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để lấy lịch nghỉ.");
  }
};

/**
 * Tạo một lịch nghỉ mới.
 * @param {Object} data - Dữ liệu của lịch nghỉ mới.
 * @returns {Promise<Object>} Lịch nghỉ đã được tạo.
 */
export const createBreakScheduleService = async (data) => {
  try {
    const newBreakSchedule = await BreakSchedule.create(data);
    return newBreakSchedule;
  } catch (error) {
    console.error("Lỗi service khi tạo lịch nghỉ:", error);
    // Ném lỗi ra ngoài để controller xử lý
    throw new Error("Lỗi khi tạo lịch nghỉ mới");
  }
};

/**
 * Cập nhật một lịch nghỉ.
 * @param {string} break_id - ID của lịch nghỉ cần cập nhật.
 * @param {Object} data - Dữ liệu cập nhật cho lịch nghỉ.
 * @returns {Promise<Object>} Lịch nghỉ đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy lịch nghỉ.
 */
import { BreakSchedule } from "../models"; // Giả sử đã import models

export const updateBreakScheduleService = async (break_id, data) => {
  try {
    const breakSchedule = await BreakSchedule.findByPk(break_id);
    if (!breakSchedule) {
      // Trả về null để controller xử lý lỗi 404
      return null;
    }

    await breakSchedule.update(data);
    return breakSchedule;
  } catch (error) {
    console.error("Lỗi service khi cập nhật lịch nghỉ:", error);
    // Ném lỗi ra ngoài để controller xử lý
    throw new Error("Lỗi khi cập nhật lịch nghỉ");
  }
};

/**
 * Xóa một lịch nghỉ.
 * @param {string} break_id - ID của lịch nghỉ cần xóa.
 * @returns {Promise<number>} Số hàng đã bị xóa.
 * @throws {Error} Nếu không tìm thấy lịch nghỉ.
 */
import { BreakSchedule } from "../models"; // Giả sử đã import models

export const deleteBreakScheduleService = async (break_id) => {
  try {
    const deletedCount = await BreakSchedule.destroy({
      where: { break_id },
    });

    // `deletedCount` sẽ là 1 nếu xóa thành công, 0 nếu không tìm thấy.
    return deletedCount > 0;
  } catch (error) {
    console.error("Lỗi service khi xóa lịch nghỉ:", error);
    throw new Error("Lỗi khi xóa lịch nghỉ");
  }
};

/**
 * Liệt kê các lịch nghỉ với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.break_id] - Lọc theo ID lịch nghỉ (tìm kiếm gần đúng).
 * @param {string} [filters.break_type] - Lọc theo loại lịch nghỉ (tìm kiếm gần đúng).
 * @param {string} [filters.break_start_date] - Lọc theo ngày bắt đầu (định dạng YYYY-MM-DD).
 * @returns {Promise<Array>} Danh sách các lịch nghỉ phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listBreakSchedulesService = async (filters = {}) => {
  try {
    const whereClause = {};

    // Xây dựng whereClause một cách hiệu quả hơn
    if (filters.break_id) {
      whereClause.break_id = { [Op.iLike]: `%${filters.break_id}%` };
    }
    if (filters.break_type) {
      whereClause.break_type = { [Op.iLike]: `%${filters.break_type}%` };
    }
    if (filters.break_start_date) {
      whereClause.break_start_date = filters.break_start_date;
    }

    const breakSchedules = await BreakSchedule.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    return breakSchedules;
  } catch (error) {
    console.error("Lỗi service khi liệt kê lịch nghỉ:", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để liệt kê lịch nghỉ.");
  }
};

/**
 * Nhập lịch nghỉ từ dữ liệu file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importBreakSchedulesFromExcelService = async (fileBuffer) => {
  try {
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    const breakSchedulesData =
      ExcelUtils.convertVietnameseColumnsToEnglish(rawData);
    const results = {
      success: [],
      errors: [],
      total: breakSchedulesData.length,
    };

    // Sử dụng Promise.all để xử lý song song, cải thiện hiệu suất
    const importPromises = breakSchedulesData.map(async (row, index) => {
      const rowIndex = index + 2;

      try {
        // Validation và xử lý dữ liệu
        if (
          !row.break_id ||
          !row.break_type ||
          !row.break_start_date ||
          !row.break_end_date
        ) {
          throw new Error(
            "Mã lịch nghỉ, Loại lịch nghỉ, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc"
          );
        }

        const breakScheduleData = {
          break_id: ExcelUtils.cleanString(row.break_id),
          break_type: ExcelUtils.cleanString(row.break_type),
          break_start_date: ExcelUtils.formatExcelDate(row.break_start_date),
          break_end_date: ExcelUtils.formatExcelDate(row.break_end_date),
          number_of_days: row.number_of_days
            ? parseInt(row.number_of_days)
            : null,
          description: ExcelUtils.cleanString(row.description) || null,
          status: ExcelUtils.cleanString(row.status) || "Hoạt động",
        };

        const startDate = new Date(breakScheduleData.break_start_date);
        const endDate = new Date(breakScheduleData.break_end_date);
        const today = new Date();
        const maxFutureDate = new Date(
          today.getFullYear() + 5,
          today.getMonth(),
          today.getDate()
        );

        if (isNaN(startDate) || isNaN(endDate)) {
          throw new Error("Định dạng ngày không hợp lệ");
        }
        if (startDate > endDate) {
          throw new Error(
            "Thời gian bắt đầu không được lớn hơn thời gian kết thúc"
          );
        }
        if (endDate > maxFutureDate) {
          throw new Error(
            "Thời gian kết thúc không được quá 5 năm trong tương lai"
          );
        }

        const transaction = await sequelize.transaction();
        try {
          const existingBreakSchedule = await BreakSchedule.findByPk(
            breakScheduleData.break_id,
            { transaction }
          );
          if (existingBreakSchedule) {
            throw new Error("Mã lịch nghỉ đã tồn tại");
          }

          const newBreakSchedule = await BreakSchedule.create(
            breakScheduleData,
            { transaction }
          );
          await transaction.commit();

          return {
            row: rowIndex,
            break_id: newBreakSchedule.break_id,
            break_type: newBreakSchedule.break_type,
          };
        } catch (dbError) {
          await transaction.rollback();
          throw dbError;
        }
      } catch (error) {
        return {
          isError: true,
          row: rowIndex,
          break_id: row.break_id || "N/A",
          error: error.message || "Lỗi không xác định.",
        };
      }
    });

    const allResults = await Promise.all(importPromises);

    // Phân loại kết quả
    allResults.forEach((result) => {
      if (result.isError) {
        results.errors.push(result);
      } else {
        results.success.push(result);
      }
    });

    return results;
  } catch (error) {
    console.error("Lỗi service khi nhập lịch nghỉ từ Excel:", error);
    throw error;
  }
};

/**
 * Nhập lịch nghỉ từ dữ liệu JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} breakSchedulesData - Mảng các đối tượng lịch nghỉ.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importBreakSchedulesFromJsonController = async (req, res) => {
  const { breakSchedules } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (
    !breakSchedules ||
    !Array.isArray(breakSchedules) ||
    breakSchedules.length === 0
  ) {
    return APIResponse(
      res,
      400,
      null,
      "Dữ liệu lịch nghỉ không hợp lệ hoặc rỗng. Yêu cầu một mảng JSON."
    );
  }

  try {
    const results = await importBreakSchedulesFromJsonService(breakSchedules);
    const { success, errors } = results;
    const totalRecords = breakSchedules.length;

    const responseData = {
      imported: success,
      errors: errors,
      total: totalRecords,
      successCount: success.length,
      errorCount: errors.length,
    };

    if (errors.length > 0) {
      const message = `Import hoàn tất với ${success.length}/${totalRecords} bản ghi thành công.`;
      return APIResponse(res, 207, responseData, message); // Multi-Status
    } else {
      const message = `Import thành công ${totalRecords} lịch nghỉ.`;
      return APIResponse(res, 200, responseData, message); // OK
    }
  } catch (error) {
    console.error("Lỗi khi import lịch nghỉ từ dữ liệu JSON:", error);
    return APIResponse(
      res,
      500,
      null,
      error.message || "Đã xảy ra lỗi trong quá trình import dữ liệu."
    );
  }
};

/**
 * Validate cấu trúc template Excel cho lịch nghỉ.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateBreakScheduleExcelTemplateService = (fileBuffer) => {
  const requiredColumns = [
    "Mã lịch nghỉ",
    "Loại lịch nghỉ",
    "Thời gian bắt đầu",
    "Thời gian kết thúc",
  ];
  const optionalColumns = ["Số ngày", "Mô tả", "Trạng thái"];

  // Tránh ném lỗi trực tiếp, thay vào đó trả về kết quả validation để controller xử lý
  const validation = ExcelUtils.validateTemplate(
    fileBuffer,
    requiredColumns,
    optionalColumns
  );

  if (!validation.valid) {
    // Trả về đối tượng lỗi để controller có thể sử dụng
    return { valid: false, error: validation.error };
  }

  return { valid: true };
};
