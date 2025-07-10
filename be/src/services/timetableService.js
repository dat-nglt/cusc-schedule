// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\services\timetableService.js

import Timetable from '../models/Timetable.js';
import { Op } from 'sequelize'; // Assuming Sequelize is used based on previous examples
import ExcelUtils from '../utils/ExcelUtils.js'; // Assuming ExcelUtils for Excel operations

/**
 * Tạo một mục thời khóa biểu mới.
 * @param {Object} timetableData - Dữ liệu của mục thời khóa biểu mới.
 * @returns {Promise<Object>} Mục thời khóa biểu đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo.
 */
export const createTimetable = async (timetableData) => {
    try {
        const newTimetable = await Timetable.create(timetableData);
        return newTimetable;
    } catch (error) {
        console.error('Lỗi khi tạo thời khóa biểu:', error);
        throw error;
    }
};

/**
 * Lấy tất cả các mục thời khóa biểu.
 * @returns {Promise<Array>} Danh sách tất cả các mục thời khóa biểu.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllTimetables = async () => {
    try {
        const timetables = await Timetable.findAll();
        return timetables;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả thời khóa biểu:', error);
        throw error;
    }
};

/**
 * Lấy một mục thời khóa biểu theo ID.
 * @param {string} id - ID của mục thời khóa biểu.
 * @returns {Promise<Object|null>} Mục thời khóa biểu tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getTimetableById = async (id) => {
    try {
        const timetable = await Timetable.findByPk(id);
        return timetable;
    } catch (error) {
        console.error(`Lỗi khi lấy thời khóa biểu với ID ${id}:`, error);
        throw error;
    }
};

/**
 * Cập nhật một mục thời khóa biểu.
 * @param {string} id - ID của mục thời khóa biểu cần cập nhật.
 * @param {Object} timetableData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} Mục thời khóa biểu đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy mục thời khóa biểu hoặc có lỗi.
 */
export const updateTimetable = async (id, timetableData) => {
    try {
        const timetable = await Timetable.findByPk(id);
        if (!timetable) {
            throw new Error("Không tìm thấy thời khóa biểu");
        }
        await timetable.update(timetableData);
        return timetable;
    } catch (error) {
        console.error(`Lỗi khi cập nhật thời khóa biểu với ID ${id}:`, error);
        throw error;
    }
};

/**
 * Xóa một mục thời khóa biểu.
 * @param {string} id - ID của mục thời khóa biểu cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy mục thời khóa biểu hoặc có lỗi.
 */
export const deleteTimetable = async (id) => {
    try {
        const deleted = await Timetable.destroy({
            where: { id: id }
        });
        if (deleted) {
            return { message: "Thời khóa biểu đã được xóa thành công" };
        }
        throw new Error("Không tìm thấy thời khóa biểu");
    } catch (error) {
        console.error(`Lỗi khi xóa thời khóa biểu với ID ${id}:`, error);
        throw error;
    }
};

/**
 * Liệt kê các mục thời khóa biểu với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.room_id] - Lọc theo ID phòng học.
 * @param {string} [filters.subject_id] - Lọc theo ID môn học.
 * @param {string} [filters.teacher_id] - Lọc theo ID giáo viên.
 * @param {string} [filters.class_id] - Lọc theo ID lớp học.
 * @param {string} [filters.semester_id] - Lọc theo ID học kỳ.
 * @param {Date} [filters.start_time] - Lọc theo thời gian bắt đầu.
 * @param {Date} [filters.end_time] - Lọc theo thời gian kết thúc.
 * @returns {Promise<Array>} Danh sách các mục thời khóa biểu phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listTimetables = async (filters) => {
    try {
        const whereClause = {};

        if (filters.room_id) {
            whereClause.room_id = {
                [Op.iLike]: `%${filters.room_id}%`
            };
        }
        if (filters.subject_id) {
            whereClause.subject_id = {
                [Op.iLike]: `%${filters.subject_id}%`
            };
        }
        if (filters.teacher_id) {
            whereClause.teacher_id = {
                [Op.iLike]: `%${filters.teacher_id}%`
            };
        }
        if (filters.class_id) {
            whereClause.class_id = {
                [Op.iLike]: `%${filters.class_id}%`
            };
        }
        if (filters.semester_id) {
            whereClause.semester_id = {
                [Op.iLike]: `%${filters.semester_id}%`
            };
        }
        if (filters.start_time) {
            whereClause.start_time = {
                [Op.gte]: new Date(filters.start_time)
            };
        }
        if (filters.end_time) {
            whereClause.end_time = {
                [Op.lte]: new Date(filters.end_time)
            };
        }
        // Thêm các bộ lọc khác nếu cần

        const timetables = await Timetable.findAll({
            where: whereClause,
            order: [['start_time', 'ASC']] // Sắp xếp theo thời gian bắt đầu
        });

        return timetables;
    } catch (error) {
        console.error('Lỗi khi liệt kê thời khóa biểu:', error);
        throw error;
    }
};

/**
 * Nhập dữ liệu thời khóa biểu từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importTimetablesFromExcel = async (fileBuffer) => {
    try {
        const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

        if (!rawData || rawData.length === 0) {
            throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng.");
        }

        const timetablesData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

        const results = {
            success: [],
            errors: [],
            total: timetablesData.length
        };

        for (let i = 0; i < timetablesData.length; i++) {
            const row = timetablesData[i];
            const rowIndex = i + 2; // Rows in Excel are 1-indexed, plus header row

            try {
                // Validate required fields
                if (!row.room_id || !row.subject_id || !row.teacher_id || !row.class_id || !row.semester_id || !row.start_time || !row.end_time) {
                    results.errors.push({
                        row: rowIndex,
                        error: 'Các trường Mã phòng, Mã môn học, Mã giáo viên, Mã lớp, Mã học kỳ, Thời gian bắt đầu, Thời gian kết thúc là bắt buộc.'
                    });
                    continue;
                }

                // Clean and format data
                const timetableData = {
                    room_id: ExcelUtils.cleanString(row.room_id),
                    subject_id: ExcelUtils.cleanString(row.subject_id),
                    teacher_id: ExcelUtils.cleanString(row.teacher_id),
                    class_id: ExcelUtils.cleanString(row.class_id),
                    semester_id: ExcelUtils.cleanString(row.semester_id),
                    start_time: ExcelUtils.formatExcelDateTime(row.start_time), // Giả định ExcelUtils có hàm này
                    end_time: ExcelUtils.formatExcelDateTime(row.end_time),     // Giả định ExcelUtils có hàm này
                    day_of_week: ExcelUtils.cleanString(row.day_of_week) || null,
                    notes: ExcelUtils.cleanString(row.notes) || null,
                };

                // Validate time
                const startTime = new Date(timetableData.start_time);
                const endTime = new Date(timetableData.end_time);

                if (isNaN(startTime) || isNaN(endTime)) {
                    results.errors.push({
                        row: rowIndex,
                        error: 'Định dạng thời gian bắt đầu hoặc kết thúc không hợp lệ.'
                    });
                    continue;
                }

                if (startTime >= endTime) {
                    results.errors.push({
                        row: rowIndex,
                        error: 'Thời gian bắt đầu phải trước thời gian kết thúc.'
                    });
                    continue;
                }
                
                // Add any other specific validations (e.g., check if room_id, subject_id etc. exist in their respective tables if needed)

                const newTimetable = await Timetable.create(timetableData);
                results.success.push({
                    row: rowIndex,
                    id: newTimetable.id,
                    message: "Nhập thành công"
                });

            } catch (error) {
                results.errors.push({
                    row: rowIndex,
                    error: error.message || 'Lỗi không xác định'
                });
            }
        }
        return results;
    } catch (error) {
        console.error("Lỗi khi nhập thời khóa biểu từ Excel:", error);
        throw error;
    }
};

/**
 * Validate cấu trúc template Excel cho thời khóa biểu.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
    const requiredColumns = ['Mã phòng', 'Mã môn học', 'Mã giáo viên', 'Mã lớp', 'Mã học kỳ', 'Thời gian bắt đầu', 'Thời gian kết thúc'];
    const optionalColumns = ['Ngày trong tuần', 'Ghi chú']; // 'Ngày trong tuần' (day_of_week) nếu không phải từ start_time/end_time
    const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

    if (!validation.valid) {
        throw new Error(validation.error);
    }

    return validation;
};