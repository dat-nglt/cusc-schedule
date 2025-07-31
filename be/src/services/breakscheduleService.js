import models from '../models/index.js';
import { Op } from 'sequelize';
import ExcelUtils from "../utils/ExcelUtils.js";

/**
 * Lấy tất cả các lịch nghỉ.
 * @returns {Promise<Array>} Danh sách các lịch nghỉ.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllBreakSchedulesService = async () => {
  try {
    const breakSchedules = await models.BreakSchedule.findAll();
    return breakSchedules;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách lịch nghỉ: ' + error.message);
  }
};

/**
 * Lấy một lịch nghỉ theo ID.
 * @param {string} break_id - ID của lịch nghỉ.
 * @returns {Promise<Object|null>} Lịch nghỉ tìm thấy hoặc null nếu không tìm thấy.
 */
export const getBreakScheduleByIdService = async (break_id) => {
  return await models.BreakSchedule.findByPk(break_id);
};

/**
 * Tạo một lịch nghỉ mới.
 * @param {Object} data - Dữ liệu của lịch nghỉ mới.
 * @returns {Promise<Object>} Lịch nghỉ đã được tạo.
 */
export const createBreakScheduleService = async (data) => {
  return await models.BreakSchedule.create(data);
};

/**
 * Cập nhật một lịch nghỉ.
 * @param {string} break_id - ID của lịch nghỉ cần cập nhật.
 * @param {Object} data - Dữ liệu cập nhật cho lịch nghỉ.
 * @returns {Promise<Object>} Lịch nghỉ đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy lịch nghỉ.
 */
export const updateBreakScheduleService = async (break_id, data) => {
  const breakSchedule = await models.BreakSchedule.findByPk(break_id);
  if (!breakSchedule) throw new Error("Không tìm thấy lịch nghỉ");
  return await breakSchedule.update(data);
};

/**
 * Xóa một lịch nghỉ.
 * @param {string} break_id - ID của lịch nghỉ cần xóa.
 * @returns {Promise<number>} Số hàng đã bị xóa.
 * @throws {Error} Nếu không tìm thấy lịch nghỉ.
 */
export const deleteBreakScheduleService = async (break_id) => {
  const breakSchedule = await models.BreakSchedule.findOne({ where: { break_id } });
  if (!breakSchedule) throw new Error("Không tìm thấy lịch nghỉ");
  return await breakSchedule.destroy();
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
export const listBreakSchedulesService = async (filters) => {
  try {
    const whereClause = {};

    // Lọc theo break_id
    if (filters.break_id) {
      whereClause.break_id = {
        [Op.iLike]: `%${filters.break_id}%`
      };
    }

    // Lọc theo break_type
    if (filters.break_type) {
      whereClause.break_type = {
        [Op.iLike]: `%${filters.break_type}%`
      };
    }

    // Lọc theo break_start_date
    if (filters.break_start_date) {
      whereClause.break_start_date = filters.break_start_date; // YYYY-MM-DD
    }

    const breakSchedules = await models.BreakSchedule.findAll({
      where: whereClause,
      attributes: ['break_id', 'break_type', 'break_start_date', 'break_end_date', 'number_of_days', 'description', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return breakSchedules;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê lịch nghỉ: ' + error.message);
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
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi cột tiếng Việt sang tiếng Anh
    const breakSchedulesData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: breakSchedulesData.length
    };

    // Validate và tạo break schedule cho từng row
    for (let i = 0; i < breakSchedulesData.length; i++) {
      const row = breakSchedulesData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.break_id || !row.break_type || !row.break_start_date || !row.break_end_date) {
          results.errors.push({
            row: rowIndex,
            break_id: row.break_id || 'N/A',
            error: 'Mã lịch nghỉ, Loại lịch nghỉ, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc của database
        const breakScheduleData = {
          break_id: ExcelUtils.cleanString(row.break_id),
          break_type: ExcelUtils.cleanString(row.break_type),
          break_start_date: ExcelUtils.formatExcelDate(row.break_start_date),
          break_end_date: ExcelUtils.formatExcelDate(row.break_end_date),
          number_of_days: parseInt(row.number_of_days) || null,
          description: ExcelUtils.cleanString(row.description) || null,
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate khoảng ngày
        const startDate = new Date(breakScheduleData.break_start_date);
        const endDate = new Date(breakScheduleData.break_end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5); // Giới hạn 5 năm trong tương lai

        if (isNaN(startDate) || isNaN(endDate)) {
          results.errors.push({
            row: rowIndex,
            break_id: breakScheduleData.break_id,
            error: 'Định dạng ngày không hợp lệ'
          });
          continue;
        }

        if (startDate > endDate) {
          results.errors.push({
            row: rowIndex,
            break_id: breakScheduleData.break_id,
            error: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'
          });
          continue;
        }

        if (endDate > maxFutureDate) {
          results.errors.push({
            row: rowIndex,
            break_id: breakScheduleData.break_id,
            error: 'Thời gian kết thúc không được quá 5 năm trong tương lai'
          });
          continue;
        }

        // Kiểm tra break_id đã tồn tại chưa
        const existingBreakSchedule = await models.BreakSchedule.findByPk(breakScheduleData.break_id);
        if (existingBreakSchedule) {
          results.errors.push({
            row: rowIndex,
            break_id: breakScheduleData.break_id,
            error: 'Mã lịch nghỉ đã tồn tại'
          });
          continue;
        }

        // Tạo lịch nghỉ mới
        const newBreakSchedule = await models.BreakSchedule.create(breakScheduleData);
        results.success.push({
          row: rowIndex,
          break_id: newBreakSchedule.break_id,
          break_type: newBreakSchedule.break_type
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          break_id: row.break_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập lịch nghỉ từ Excel:", error);
    throw error;
  }
};

/**
 * Nhập lịch nghỉ từ dữ liệu JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} breakSchedulesData - Mảng các đối tượng lịch nghỉ.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importBreakSchedulesFromJsonService = async (breakSchedulesData) => {
  try {
    if (!breakSchedulesData || !Array.isArray(breakSchedulesData)) {
      throw new Error("Dữ liệu lịch nghỉ không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: breakSchedulesData.length
    };

    // Validate và tạo break schedule cho từng item
    for (let i = 0; i < breakSchedulesData.length; i++) {
      const breakScheduleData = breakSchedulesData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!breakScheduleData.break_id || !breakScheduleData.break_type || !breakScheduleData.break_start_date || !breakScheduleData.break_end_date) {
          results.errors.push({
            index: index,
            break_id: breakScheduleData.break_id || 'N/A',
            error: 'Mã lịch nghỉ, Loại lịch nghỉ, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu
        const cleanedData = {
          break_id: breakScheduleData.break_id.toString().trim(),
          break_type: breakScheduleData.break_type.toString().trim(),
          break_start_date: breakScheduleData.break_start_date || null,
          break_end_date: breakScheduleData.break_end_date || null,
          number_of_days: parseInt(breakScheduleData.number_of_days) || null,
          description: breakScheduleData.description || null,
          status: breakScheduleData.status || 'Hoạt động',
        };

        // Validate khoảng ngày
        const startDate = new Date(cleanedData.break_start_date);
        const endDate = new Date(cleanedData.break_end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5); // Giới hạn 5 năm trong tương lai

        if (isNaN(startDate) || isNaN(endDate)) {
          results.errors.push({
            index: index,
            break_id: cleanedData.break_id,
            error: 'Định dạng ngày không hợp lệ'
          });
          continue;
        }

        if (startDate > endDate) {
          results.errors.push({
            index: index,
            break_id: cleanedData.break_id,
            error: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'
          });
          continue;
        }

        if (endDate > maxFutureDate) {
          results.errors.push({
            index: index,
            break_id: cleanedData.break_id,
            error: 'Thời gian kết thúc không được quá 5 năm trong tương lai'
          });
          continue;
        }

        // Kiểm tra break_id đã tồn tại chưa
        const existingBreakSchedule = await models.BreakSchedule.findOne({
          where: { break_id: cleanedData.break_id }
        });
        if (existingBreakSchedule) {
          results.errors.push({
            index: index,
            break_id: cleanedData.break_id,
            error: 'Mã lịch nghỉ đã tồn tại'
          });
          continue;
        }

        // Tạo lịch nghỉ mới
        const newBreakSchedule = await models.BreakSchedule.create(cleanedData);
        results.success.push(newBreakSchedule);
      } catch (error) {
        results.errors.push({
          index: index,
          break_id: breakScheduleData.break_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập lịch nghỉ từ JSON:", error);
    throw error;
  }
};

/**
 * Validate cấu trúc template Excel cho lịch nghỉ.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateBreakScheduleExcelTemplateService = (fileBuffer) => {
  const requiredColumns = ['Mã lịch nghỉ', 'Loại lịch nghỉ', 'Thời gian bắt đầu', 'Thời gian kết thúc'];
  const optionalColumns = ['Số ngày', 'Mô tả', 'Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};