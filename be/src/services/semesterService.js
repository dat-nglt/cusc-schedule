import models from '../models/index'; // Import models từ index.js
import { Op } from 'sequelize'; // Import Op nếu cần cho các hàm list tương lai
import ExcelUtils from "../utils/ExcelUtils.js"; // Giả định bạn có ExcelUtils cho các hàm import từ Excel

const { Semester } = models; // Lấy model Semester từ models
/**
 * Lấy tất cả các học kỳ.
 * @returns {Promise<Array>} Danh sách tất cả các học kỳ.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllSemesters = async () => {
  try {
    const semesters = await Semester.findAll();
    return semesters;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học kỳ:', error);
    throw error;
  }
};

/**
 * Lấy thông tin một học kỳ theo ID.
 * @param {string} id - ID của học kỳ.
 * @returns {Promise<Object|null>} Học kỳ tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getSemesterById = async (id) => {
  try {
    const semester = await Semester.findByPk(id);
    return semester;
  } catch (error) {
    console.error(`Lỗi khi lấy học kỳ với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một học kỳ mới.
 * @param {Object} semesterData - Dữ liệu của học kỳ mới.
 * @returns {Promise<Object>} Học kỳ đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo học kỳ.
 */
export const createSemester = async (semesterData) => {
  try {
    const semester = await Semester.create(semesterData);
    return semester;
  } catch (error) {
    console.error('Lỗi khi tạo học kỳ:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một học kỳ.
 * @param {string} id - ID của học kỳ cần cập nhật.
 * @param {Object} semesterData - Dữ liệu cập nhật cho học kỳ.
 * @returns {Promise<Object>} Học kỳ đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy học kỳ hoặc có lỗi.
 */
export const updateSemester = async (id, semesterData) => {
  try {
    const semester = await Semester.findByPk(id);
    if (!semester) throw new Error("Không tìm thấy học kỳ");
    return await semester.update(semesterData);
  } catch (error) {
    console.error(`Lỗi khi cập nhật học kỳ với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một học kỳ.
 * @param {string} id - ID của học kỳ cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy học kỳ hoặc có lỗi.
 */
export const deleteSemester = async (id) => {
  try {
    const semester = await Semester.findByPk(id);
    if (!semester) throw new Error("Không tìm thấy học kỳ");
    await semester.destroy();
    return { message: "Học kỳ đã được xóa thành công" };
  } catch (error) {
    console.error(`Lỗi khi xóa học kỳ với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu học kỳ từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} semestersData - Mảng các đối tượng học kỳ.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importSemestersFromJSON = async (semestersData) => {
  try {
    if (!semestersData || !Array.isArray(semestersData)) {
      throw new Error("Dữ liệu học kỳ không hợp lệ");
    }
    const results = {
      success: [],
      errors: [],
      total: semestersData.length
    };

    // Validate và tạo học kỳ cho từng item
    for (let i = 0; i < semestersData.length; i++) {
      const semesterData = semestersData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!semesterData.semester_id || !semesterData.semester_name || !semesterData.start_date || !semesterData.end_date) {
          results.errors.push({
            index: index,
            semester_id: semesterData.semester_id || 'N/A',
            error: 'Mã học kỳ, Tên học kỳ, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
        const cleanedData = {
          semester_id: semesterData.semester_id.toString().trim(),
          semester_name: semesterData.semester_name.toString().trim(),
          start_date: semesterData.start_date ? new Date(semesterData.start_date) : null,
          end_date: semesterData.end_date ? new Date(semesterData.end_date) : null,
          program_id: semesterData.program_id ? semesterData.program_id.toString().trim() : null,
          status: semesterData.status || 'Hoạt động' // Mặc định là 'hoạt động' nếu không có giá trị
        };

        // Validate ngày tháng
        const startDate = new Date(cleanedData.start_date);
        const endDate = new Date(cleanedData.end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5); // Giới hạn 5 năm trong tương lai

        if (isNaN(startDate) || isNaN(endDate)) {
          results.errors.push({
            index: index,
            semester_id: cleanedData.semester_id,
            error: 'Định dạng ngày không hợp lệ'
          });
          continue;
        }

        if (startDate > endDate) {
          results.errors.push({
            index: index,
            semester_id: cleanedData.semester_id,
            error: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'
          });
          continue;
        }

        if (endDate > maxFutureDate) {
          results.errors.push({
            index: index,
            semester_id: cleanedData.semester_id,
            error: 'Thời gian kết thúc không được quá 5 năm trong tương lai'
          });
          continue;
        }

        // Kiểm tra semester_id đã tồn tại chưa
        const existingSemester = await Semester.findOne({
          where: { semester_id: cleanedData.semester_id }
        });
        if (existingSemester) {
          results.errors.push({
            index: index,
            semester_id: cleanedData.semester_id,
            error: 'Mã học kỳ đã tồn tại'
          });
          continue;
        }

        // Tạo Semester mới
        const newSemester = await Semester.create(cleanedData);
        results.success.push(newSemester);

      } catch (error) {
        results.errors.push({
          index: index,
          semester_id: semesterData.semester_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }
    return results;
  } catch (error) {
    console.error('Lỗi khi nhập học kỳ từ JSON:', error);
    throw error;
  }
};

/**
 * Liệt kê các học kỳ với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.semester_id] - Lọc theo ID học kỳ (tìm kiếm gần đúng).
 * @param {string} [filters.semester_name] - Lọc theo tên học kỳ (tìm kiếm gần đúng).
 * @param {string} [filters.program_id] - Lọc theo ID chương trình (tìm kiếm gần đúng).
 * @param {string} [filters.status] - Lọc theo trạng thái.
 * @param {string} [filters.start_date] - Lọc theo ngày bắt đầu (định dạng YYYY-MM-DD).
 * @param {string} [filters.end_date] - Lọc theo ngày kết thúc (định dạng YYYY-MM-DD).
 * @returns {Promise<Array>} Danh sách các học kỳ phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listSemesters = async (filters) => {
  try {
    const whereClause = {};

    if (filters.semester_id) {
      whereClause.semester_id = {
        [Op.iLike]: `%${filters.semester_id}%`
      };
    }
    if (filters.semester_name) {
      whereClause.semester_name = {
        [Op.iLike]: `%${filters.semester_name}%`
      };
    }
    if (filters.program_id) {
      whereClause.program_id = {
        [Op.iLike]: `%${filters.program_id}%`
      };
    }
    if (filters.status) {
      whereClause.status = {
        [Op.iLike]: `%${filters.status}%`
      };
    }
    if (filters.start_date) {
      whereClause.start_date = filters.start_date;
    }
    if (filters.end_date) {
      whereClause.end_date = filters.end_date;
    }

    const semesters = await Semester.findAll({
      where: whereClause,
      attributes: ['semester_id', 'semester_name', 'start_date', 'end_date', 'program_id', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return semesters;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê học kỳ: ' + error.message);
  }
};

/**
 * Nhập dữ liệu học kỳ từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importSemestersFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi tên cột tiếng Việt sang tiếng Anh (nếu cần, giả định ExcelUtils có hàm này)
    const semestersData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: semestersData.length
    };

    // Validate và tạo học kỳ cho từng hàng
    for (let i = 0; i < semestersData.length; i++) {
      const row = semestersData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.semester_id || !row.semester_name || !row.start_date || !row.end_date) {
          results.errors.push({
            row: rowIndex,
            semester_id: row.semester_id || 'N/A',
            error: 'Mã học kỳ, Tên học kỳ, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc database
        const semesterData = {
          semester_id: ExcelUtils.cleanString(row.semester_id),
          semester_name: ExcelUtils.cleanString(row.semester_name),
          start_date: ExcelUtils.formatExcelDate(row.start_date),
          end_date: ExcelUtils.formatExcelDate(row.end_date),
          program_id: ExcelUtils.cleanString(row.program_id) || null,
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate ngày tháng
        const startDate = new Date(semesterData.start_date);
        const endDate = new Date(semesterData.end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5); // Giới hạn 5 năm trong tương lai

        if (isNaN(startDate) || isNaN(endDate)) {
          results.errors.push({
            row: rowIndex,
            semester_id: semesterData.semester_id,
            error: 'Định dạng ngày không hợp lệ'
          });
          continue;
        }

        if (startDate > endDate) {
          results.errors.push({
            row: rowIndex,
            semester_id: semesterData.semester_id,
            error: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'
          });
          continue;
        }

        if (endDate > maxFutureDate) {
          results.errors.push({
            row: rowIndex,
            semester_id: semesterData.semester_id,
            error: 'Thời gian kết thúc không được quá 5 năm trong tương lai'
          });
          continue;
        }

        // Kiểm tra semester_id đã tồn tại chưa
        const existingSemester = await Semester.findByPk(semesterData.semester_id);
        if (existingSemester) {
          results.errors.push({
            row: rowIndex,
            semester_id: semesterData.semester_id,
            error: 'Mã học kỳ đã tồn tại'
          });
          continue;
        }

        // Tạo Semester mới
        const newSemester = await Semester.create(semesterData);
        results.success.push({
          row: rowIndex,
          semester_id: newSemester.semester_id,
          semester_name: newSemester.semester_name
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          semester_id: row.semester_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập học kỳ từ Excel:", error);
    throw error;
  }
};

/**
 * Validate cấu trúc template Excel cho học kỳ.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã học kỳ', 'Tên học kỳ', 'Thời gian bắt đầu', 'Thời gian kết thúc'];
  const optionalColumns = ['Mã chương trình', 'Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};