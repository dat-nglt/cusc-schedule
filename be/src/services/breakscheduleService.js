import BreakSchedule from "../models/BreakSchedule.js";
import { Op } from 'sequelize'; // Đảm bảo import Op nếu chưa có
import ExcelUtils from "../utils/ExcelUtils.js";

export const getAllBreakSchedules = async () => {
  try {
    const breakSchedules = await BreakSchedule.findAll();
    return breakSchedules;
  } catch (error) {
    throw new Error('Error fetching break schedules: ' + error.message);
  }
};

// Get one break schedule by ID
export const getBreakScheduleById = async (break_id) => {
  return await BreakSchedule.findByPk(break_id);
};

// Create a new break schedule
export const createBreakSchedule = async (data) => {
  return await BreakSchedule.create(data);
};

// Update a break schedule
export const updateBreakSchedule = async (break_id, data) => {
  const breakSchedule = await BreakSchedule.findByPk(break_id);
  if (!breakSchedule) throw new Error("Break schedule not found");
  return await breakSchedule.update(data);
};

// Delete a break schedule
export const deleteBreakSchedule = async (break_id) => {
  const breakSchedule = await BreakSchedule.findOne({ where: { break_id } });
  if (!breakSchedule) throw new Error("Break schedule not found");
  return await breakSchedule.destroy();
};

export const listBreakSchedules = async (filters) => {
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

    const breakSchedules = await BreakSchedule.findAll({
      where: whereClause,
      attributes: ['break_id', 'break_type', 'break_start_date', 'break_end_date', 'number_of_days', 'description', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return breakSchedules;
  } catch (error) {
    throw new Error('Error listing break schedules: ' + error.message);
  }
};

export const importBreakSchedulesFromExcel = async (fileBuffer) => {
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
      const rowIndex = i + 2; // Bắt đầu từ row 2 (sau header)

      try {
        // Validate required fields
        if (!row.break_id || !row.break_type || !row.break_start_date || !row.break_end_date) {
          results.errors.push({
            row: rowIndex,
            break_id: row.break_id || 'N/A',
            error: 'Mã lịch nghỉ, Loại lịch nghỉ, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Format data theo structure của database
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

        // Validate date range
        const startDate = new Date(breakScheduleData.break_start_date);
        const endDate = new Date(breakScheduleData.break_end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5);

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
        const existingBreakSchedule = await BreakSchedule.findByPk(breakScheduleData.break_id);
        if (existingBreakSchedule) {
          results.errors.push({
            row: rowIndex,
            break_id: breakScheduleData.break_id,
            error: 'Mã lịch nghỉ đã tồn tại'
          });
          continue;
        }

        // Tạo break schedule mới
        const newBreakSchedule = await BreakSchedule.create(breakScheduleData);
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
    console.error("Error importing break schedules from Excel:", error);
    throw error;
  }
};

// Import break schedules from JSON data (for preview feature)
export const importBreakSchedulesFromJson = async (breakSchedulesData) => {
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
        // Validate required fields
        if (!breakScheduleData.break_id || !breakScheduleData.break_type || !breakScheduleData.break_start_date || !breakScheduleData.break_end_date) {
          results.errors.push({
            index: index,
            break_id: breakScheduleData.break_id || 'N/A',
            error: 'Mã lịch nghỉ, Loại lịch nghỉ, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Clean và format data
        const cleanedData = {
          break_id: breakScheduleData.break_id.toString().trim(),
          break_type: breakScheduleData.break_type.toString().trim(),
          break_start_date: breakScheduleData.break_start_date || null,
          break_end_date: breakScheduleData.break_end_date || null,
          number_of_days: parseInt(breakScheduleData.number_of_days) || null,
          description: breakScheduleData.description || null,
          status: breakScheduleData.status || 'Hoạt động',
        };

        // Validate date range
        const startDate = new Date(cleanedData.break_start_date);
        const endDate = new Date(cleanedData.break_end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5);

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
        const existingBreakSchedule = await BreakSchedule.findOne({
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

        // Tạo break schedule mới
        const newBreakSchedule = await BreakSchedule.create(cleanedData);
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
    console.error("Error importing break schedules from JSON:", error);
    throw error;
  }
};

// Validate Excel template structure
export const validateBreakScheduleExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã lịch nghỉ', 'Loại lịch nghỉ', 'Thời gian bắt đầu', 'Thời gian kết thúc'];
  const optionalColumns = ['Số ngày', 'Mô tả', 'Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};