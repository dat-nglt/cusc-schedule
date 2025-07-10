import models from "../models/index.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import { Op } from 'sequelize';

const { Lecturer } = models;
/**
 * Lấy tất cả giảng viên.
 * @returns {Promise<Array>} Danh sách tất cả giảng viên.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllLecturers = async () => {
  try {
    const lecturers = await Lecturer.findAll();
    return lecturers;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giảng viên:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết một giảng viên theo ID.
 * @param {string} id - ID của giảng viên.
 * @returns {Promise<Object>} Thông tin giảng viên.
 * @throws {Error} Nếu không tìm thấy giảng viên hoặc có lỗi.
 */
export const getLecturerById = async (id) => {
  try {
    const lecturer = await Lecturer.findByPk(id);
    if (!lecturer) {
      throw new Error(`Không tìm thấy giảng viên với ID ${id}`);
    }
    return lecturer;
  } catch (error) {
    console.error(`Lỗi khi lấy giảng viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một giảng viên mới.
 * @param {Object} lecturerData - Dữ liệu của giảng viên mới.
 * @returns {Promise<Object>} Giảng viên đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo giảng viên.
 */
export const createLecturer = async (lecturerData) => {
  try {
    const lecturer = await Lecturer.create(lecturerData);
    return lecturer;
  } catch (error) {
    console.error("Lỗi khi tạo giảng viên:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một giảng viên theo ID.
 * @param {string} id - ID của giảng viên cần cập nhật.
 * @param {Object} lecturerData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} Giảng viên đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy giảng viên hoặc có lỗi.
 */
export const updateLecturer = async (id, lecturerData) => {
  try {
    const lecturer = await Lecturer.findByPk(id);
    if (!lecturer) {
      throw new Error(`Không tìm thấy giảng viên với ID ${id}`);
    }
    await lecturer.update(lecturerData);
    return lecturer;
  } catch (error) {
    console.error(`Lỗi khi cập nhật giảng viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một giảng viên theo ID.
 * @param {string} id - ID của giảng viên cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy giảng viên hoặc có lỗi.
 */
export const deleteLecturer = async (id) => {
  try {
    const lecturer = await Lecturer.findByPk(id);
    if (!lecturer) {
      throw new Error(`Không tìm thấy giảng viên với ID ${id}`);
    }
    await lecturer.destroy();
    return { message: "Giảng viên đã được xóa thành công" };
  } catch (error) {
    console.error(`Lỗi khi xóa giảng viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu giảng viên từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importLecturersFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi tên cột tiếng Việt sang tiếng Anh
    const lecturersData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: lecturersData.length
    };

    // Validate và tạo giảng viên cho từng hàng
    for (let i = 0; i < lecturersData.length; i++) {
      const row = lecturersData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.lecturer_id || !row.name || !row.email) {
          results.errors.push({
            row: rowIndex,
            lecturer_id: row.lecturer_id || 'N/A',
            error: 'Mã giảng viên, Tên và Email là bắt buộc'
          });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc database
        const lecturerData = {
          lecturer_id: ExcelUtils.cleanString(row.lecturer_id),
          name: ExcelUtils.cleanString(row.name),
          email: ExcelUtils.cleanString(row.email),
          day_of_birth: row.day_of_birth ? ExcelUtils.formatExcelDate(row.day_of_birth) : null,
          gender: ExcelUtils.cleanString(row.gender) || null,
          address: ExcelUtils.cleanString(row.address) || null,
          phone_number: ExcelUtils.cleanString(row.phone_number) || null,
          department: ExcelUtils.cleanString(row.department) || null,
          hire_date: row.hire_date ? ExcelUtils.formatExcelDate(row.hire_date) : null,
          degree: ExcelUtils.cleanString(row.degree) || null,
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate email format
        if (!ExcelUtils.isValidEmail(lecturerData.email)) {
          results.errors.push({
            row: rowIndex,
            lecturer_id: lecturerData.lecturer_id,
            error: 'Email không đúng định dạng'
          });
          continue;
        }

        // Kiểm tra lecturer_id đã tồn tại chưa
        const existingLecturerById = await Lecturer.findByPk(lecturerData.lecturer_id);
        if (existingLecturerById) {
          results.errors.push({
            row: rowIndex,
            lecturer_id: lecturerData.lecturer_id,
            error: 'Mã giảng viên đã tồn tại'
          });
          continue;
        }

        // Kiểm tra email đã tồn tại chưa
        const existingLecturerByEmail = await Lecturer.findOne({ where: { email: lecturerData.email } });
        if (existingLecturerByEmail) {
          results.errors.push({
            row: rowIndex,
            lecturer_id: lecturerData.lecturer_id,
            error: 'Email đã tồn tại'
          });
          continue;
        }

        // Tạo giảng viên mới
        const newLecturer = await Lecturer.create(lecturerData);
        results.success.push({
          row: rowIndex,
          lecturer_id: newLecturer.lecturer_id,
          name: newLecturer.name,
          email: newLecturer.email
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          lecturer_id: row.lecturer_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập giảng viên từ Excel:", error);
    throw error;
  }
};

/**
 * Nhập dữ liệu giảng viên từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} lecturersData - Mảng các đối tượng giảng viên.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importLecturersFromJson = async (lecturersData) => {
  try {
    if (!lecturersData || !Array.isArray(lecturersData)) {
      throw new Error("Dữ liệu giảng viên không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: lecturersData.length
    };

    // Validate và tạo lecturer cho từng item
    for (let i = 0; i < lecturersData.length; i++) {
      const lecturerData = lecturersData[i];
      const index = i + 1;

      try {
        // Validate required fields
        if (!lecturerData.lecturer_id || !lecturerData.name || !lecturerData.email) {
          results.errors.push({
            index: index,
            lecturer_id: lecturerData.lecturer_id || 'N/A',
            error: 'Mã giảng viên, Tên và Email là bắt buộc'
          });
          continue;
        }

        // Clean và format data
        const cleanedData = {
          lecturer_id: lecturerData.lecturer_id.toString().trim(),
          name: lecturerData.name.toString().trim(),
          email: lecturerData.email ? lecturerData.email.toString().trim() : null,
          day_of_birth: lecturerData.day_of_birth || null,
          gender: lecturerData.gender ? lecturerData.gender.toString().trim() : null,
          address: lecturerData.address ? lecturerData.address.toString().trim() : null,
          phone_number: lecturerData.phone_number ? lecturerData.phone_number.toString().trim() : null,
          department: lecturerData.department ? lecturerData.department.toString().trim() : null,
          hire_date: lecturerData.hire_date || null,
          degree: lecturerData.degree ? lecturerData.degree.toString().trim() : null,
          status: lecturerData.status || 'Hoạt động'
        };

        // Validate email format nếu có
        if (cleanedData.email && !ExcelUtils.isValidEmail(cleanedData.email)) {
          results.errors.push({
            index: index,
            lecturer_id: cleanedData.lecturer_id,
            error: 'Email không đúng định dạng'
          });
          continue;
        }

        // Kiểm tra lecturer_id đã tồn tại chưa
        const existingLecturerById = await Lecturer.findOne({
          where: { lecturer_id: cleanedData.lecturer_id }
        });
        if (existingLecturerById) {
          results.errors.push({
            index: index,
            lecturer_id: cleanedData.lecturer_id,
            error: 'Mã giảng viên đã tồn tại'
          });
          continue;
        }

        // Kiểm tra email đã tồn tại chưa (nếu có)
        if (cleanedData.email) {
          const existingLecturerByEmail = await Lecturer.findOne({
            where: { email: cleanedData.email }
          });
          if (existingLecturerByEmail) {
            results.errors.push({
              index: index,
              lecturer_id: cleanedData.lecturer_id,
              error: 'Email đã tồn tại'
            });
            continue;
          }
        }

        // Tạo lecturer mới
        const newLecturer = await Lecturer.create(cleanedData);
        results.success.push(newLecturer);

      } catch (error) {
        results.errors.push({
          index: index,
          lecturer_id: lecturerData.lecturer_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập giảng viên từ JSON:", error);
    throw error;
  }
};

/**
 * Liệt kê các giảng viên với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.lecturer_id] - Lọc theo ID giảng viên (tìm kiếm gần đúng).
 * @param {string} [filters.name] - Lọc theo tên giảng viên (tìm kiếm gần đúng).
 * @param {string} [filters.email] - Lọc theo email (tìm kiếm gần đúng).
 * @param {string} [filters.gender] - Lọc theo giới tính.
 * @param {string} [filters.department] - Lọc theo khoa/bộ môn.
 * @param {string} [filters.degree] - Lọc theo học vị.
 * @param {string} [filters.status] - Lọc theo trạng thái.
 * @returns {Promise<Array>} Danh sách các giảng viên phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listLecturers = async (filters) => {
  try {
    const whereClause = {};

    if (filters.lecturer_id) {
      whereClause.lecturer_id = {
        [Op.iLike]: `%${filters.lecturer_id}%`
      };
    }
    if (filters.name) {
      whereClause.name = {
        [Op.iLike]: `%${filters.name}%`
      };
    }
    if (filters.email) {
      whereClause.email = {
        [Op.iLike]: `%${filters.email}%`
      };
    }
    if (filters.gender) {
      whereClause.gender = {
        [Op.iLike]: `%${filters.gender}%`
      };
    }
    if (filters.department) {
      whereClause.department = {
        [Op.iLike]: `%${filters.department}%`
      };
    }
    if (filters.degree) {
      whereClause.degree = {
        [Op.iLike]: `%${filters.degree}%`
      };
    }
    if (filters.status) {
      whereClause.status = {
        [Op.iLike]: `%${filters.status}%`
      };
    }

    const lecturers = await Lecturer.findAll({
      where: whereClause,
      attributes: ['lecturer_id', 'name', 'email', 'day_of_birth', 'gender', 'address', 'phone_number', 'department', 'hire_date', 'degree', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return lecturers;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê giảng viên: ' + error.message);
  }
};

/**
 * Validate cấu trúc template Excel cho giảng viên.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã giảng viên', 'Tên giảng viên', 'Email'];
  const optionalColumns = ['Ngày sinh', 'Giới tính', 'Địa chỉ', 'Số điện thoại', 'Khoa/Bộ môn', 'Ngày vào làm', 'Học vị', 'Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};