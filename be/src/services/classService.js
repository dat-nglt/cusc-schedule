import models from '../models/index.js';
import { Op } from 'sequelize';
import ExcelUtils from "../utils/ExcelUtils.js";

/**
 * Lấy tất cả các lớp học.
 * @returns {Promise<Array>} Danh sách các lớp học cùng với thông tin khóa học.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllClasses = async () => {
  try {
    const classes = await models.Classes.findAll();
    return classes;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách lớp học: ' + error.message);
  }
};

/**
 * Lấy thông tin một lớp học theo ID.
 * @param {string} class_id - ID của lớp học.
 * @returns {Promise<Object|null>} Lớp học tìm thấy hoặc null nếu không tìm thấy, kèm thông tin khóa học.
 */
export const getClassById = async (class_id) => {
  return await models.Classes.findByPk(class_id, {
    include: [
      { model: models.Course, attributes: ['course_id', 'course_name'] },
      { model: models.Program, attributes: ['program_id', 'program_name'] }
    ],
  });
};

/**
 * Tạo một lớp học mới.
 * @param {Object} data - Dữ liệu của lớp học mới.
 * @param {string} data.class_id - Mã lớp học.
 * @param {string} [data.class_name] - Tên lớp học.
 * @param {number} [data.class_size] - Sĩ số lớp học.
 * @param {string} [data.status] - Trạng thái của lớp học.
 * @param {string} [data.course_id] - Mã khóa học liên kết.
 * @param {string} [data.program_id] - Mã chương trình liên kết.
 * @returns {Promise<Object>} Lớp học đã được tạo.
 * @throws {Error} Nếu khóa học hoặc chương trình không tồn tại hoặc tên lớp học quá dài.
 */
export const createClass = async (data) => {
  const { course_id, class_name, program_id } = data;
  if (course_id) {
    const course = await models.Course.findByPk(course_id);
    if (!course) throw new Error('Không tìm thấy khóa học');
  }
  if (program_id) {
    const program = await models.Program.findByPk(program_id);
    if (!program) throw new Error('Không tìm thấy chương trình');
  }
  if (class_name && class_name.length > 50) {
    throw new Error('Tên lớp học không được vượt quá 50 ký tự');
  }
  return await models.Classes.create(data);
};

/**
 * Cập nhật thông tin một lớp học.
 * @param {string} class_id - ID của lớp học cần cập nhật.
 * @param {Object} data - Dữ liệu cập nhật cho lớp học.
 * @param {string} [data.class_name] - Tên lớp học mới.
 * @param {number} [data.class_size] - Sĩ số lớp học mới.
 * @param {string} [data.status] - Trạng thái mới của lớp học.
 * @param {string} [data.course_id] - Mã khóa học mới liên kết.
 * @param {string} [data.program_id] - Mã chương trình mới liên kết.
 * @returns {Promise<Object>} Lớp học đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy lớp học, khóa học hoặc chương trình không tồn tại hoặc tên lớp học quá dài.
 */
export const updateClass = async (class_id, data) => {
  const classInstance = await models.Classes.findByPk(class_id);
  if (!classInstance) throw new Error("Không tìm thấy lớp học");
  if (data.course_id) {
    const course = await models.Course.findByPk(data.course_id);
    if (!course) throw new Error('Không tìm thấy khóa học');
  }
  if (data.program_id) {
    const program = await models.Program.findByPk(data.program_id);
    if (!program) throw new Error('Không tìm thấy chương trình');
  }
  if (data.class_name && data.class_name.length > 50) {
    throw new Error('Tên lớp học không được vượt quá 50 ký tự');
  }
  return await classInstance.update(data);
};

/**
 * Xóa một lớp học.
 * @param {string} class_id - ID của lớp học cần xóa.
 * @returns {Promise<number>} Số hàng đã bị xóa.
 * @throws {Error} Nếu không tìm thấy lớp học.
 */
export const deleteClass = async (class_id) => {
  const classInstance = await models.Classes.findOne({ where: { class_id } });
  if (!classInstance) throw new Error("Không tìm thấy lớp học");
  return await classInstance.destroy();
};

/**
 * Liệt kê các lớp học với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.class_id] - Lọc theo ID lớp học (tìm kiếm gần đúng).
 * @param {string} [filters.class_name] - Lọc theo tên lớp học (tìm kiếm gần đúng).
 * @param {string} [filters.status] - Lọc theo trạng thái.
 * @param {string} [filters.course_id] - Lọc theo ID khóa học (tìm kiếm gần đúng).
 * @param {string} [filters.program_id] - Lọc theo ID chương trình (tìm kiếm gần đúng).
 * @returns {Promise<Array>} Danh sách các lớp học phù hợp với bộ lọc, kèm thông tin khóa học và chương trình.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listClasses = async (filters) => {
  try {
    const whereClause = {};

    // Lọc theo class_id
    if (filters.class_id) {
      whereClause.class_id = { [Op.iLike]: `%${filters.class_id}%` };
    }

    // Lọc theo class_name
    if (filters.class_name) {
      whereClause.class_name = { [Op.iLike]: `%${filters.class_name}%` };
    }

    // Lọc theo status
    if (filters.status) {
      whereClause.status = { [Op.iLike]: `%${filters.status}%` };
    }

    // Lọc theo course_id
    if (filters.course_id) {
      whereClause.course_id = { [Op.iLike]: `%${filters.course_id}%` };
    }

    // Lọc theo program_id
    if (filters.program_id) {
      whereClause.program_id = { [Op.iLike]: `%${filters.program_id}%` };
    }

    const classes = await models.Classes.findAll({
      where: whereClause,
      attributes: ['class_id', 'class_name', 'class_size', 'status', 'course_id', 'program_id', 'created_at', 'updated_at'],
      include: [
        { model: models.Course, attributes: ['course_id', 'course_name'] },
        { model: models.Program, attributes: ['program_id', 'program_name'] }
      ],
      order: [['created_at', 'DESC']],
    });

    return classes;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê lớp học: ' + error.message);
  }
};

/**
 * Nhập dữ liệu lớp học từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importClassesFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi tên cột tiếng Việt sang tiếng Anh
    const classesData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = { success: [], errors: [], total: classesData.length };

    // Duyệt qua từng hàng để validate và tạo lớp học
    for (let i = 0; i < classesData.length; i++) {
      const row = classesData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.class_id) {
          results.errors.push({ row: rowIndex, class_id: row.class_id || 'N/A', error: 'Mã lớp học là bắt buộc' });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc database
        const classData = {
          class_id: ExcelUtils.cleanString(row.class_id),
          class_name: ExcelUtils.cleanString(row.class_name) || null,
          class_size: row.class_size ? parseInt(row.class_size) : null,
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          course_id: ExcelUtils.cleanString(row.course_id) || null,
          program_id: ExcelUtils.cleanString(row.program_id) || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (classData.class_name && classData.class_name.length > 50) {
          results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Tên lớp học không được vượt quá 50 ký tự' });
          continue;
        }

        // Validate course_id nếu được cung cấp
        if (classData.course_id) {
          const course = await models.Course.findByPk(classData.course_id);
          if (!course) {
            results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Mã khóa học không tồn tại' });
            continue;
          }
        }

        // Validate program_id nếu được cung cấp
        if (classData.program_id) {
          const program = await models.Program.findByPk(classData.program_id);
          if (!program) {
            results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Mã chương trình không tồn tại' });
            continue;
          }
        }

        if (classData.class_size && (isNaN(classData.class_size) || classData.class_size < 0)) {
          results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Sĩ số lớp học không hợp lệ' });
          continue;
        }

        // Kiểm tra class_id đã tồn tại chưa
        const existingClass = await models.Classes.findByPk(classData.class_id);
        if (existingClass) {
          results.errors.push({ row: rowIndex, class_id: classData.class_id, error: 'Mã lớp học đã tồn tại' });
          continue;
        }

        // Tạo lớp học mới
        const newClass = await models.Classes.create(classData);
        results.success.push({
          row: rowIndex,
          class_id: newClass.class_id,
          class_name: newClass.class_name,
          course_id: newClass.course_id,
          program_id: newClass.program_id,
        });

      } catch (error) {
        results.errors.push({ row: rowIndex, class_id: row.class_id || 'N/A', error: error.message || 'Lỗi không xác định' });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập lớp học từ Excel:", error);
    throw error;
  }
};

/**
 * Nhập dữ liệu lớp học từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} classesData - Mảng các đối tượng lớp học.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importClassesFromJson = async (classesData) => {
  try {
    if (!classesData || !Array.isArray(classesData)) {
      throw new Error("Dữ liệu lớp học không hợp lệ");
    }

    const results = { success: [], errors: [], total: classesData.length };

    // Duyệt qua từng item để validate và tạo lớp học
    for (let i = 0; i < classesData.length; i++) {
      const classData = classesData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!classData.class_id) {
          results.errors.push({ index, class_id: classData.class_id || 'N/A', error: 'Mã lớp học là bắt buộc' });
          continue;
        }

        // Làm sạch và định dạng dữ liệu
        const cleanedData = {
          class_id: classData.class_id.toString().trim(),
          class_name: classData.class_name ? classData.class_name.toString().trim() : null,
          class_size: classData.class_size ? parseInt(classData.class_size) : null,
          status: classData.status ? classData.status.toString().trim() : 'Hoạt động',
          course_id: classData.course_id ? classData.course_id.toString().trim() : null,
          program_id: classData.program_id ? classData.program_id.toString().trim() : null,
        };

        if (cleanedData.class_name && cleanedData.class_name.length > 50) {
          results.errors.push({ index, class_id: cleanedData.class_id, error: 'Tên lớp học không được vượt quá 50 ký tự' });
          continue;
        }

        // Validate course_id nếu được cung cấp
        if (cleanedData.course_id) {
          const course = await models.Course.findByPk(cleanedData.course_id);
          if (!course) {
            results.errors.push({ index, class_id: cleanedData.class_id, error: 'Mã khóa học không tồn tại' });
            continue;
          }
        }

        // Validate program_id nếu được cung cấp
        if (cleanedData.program_id) {
          const program = await models.Program.findByPk(cleanedData.program_id);
          if (!program) {
            results.errors.push({ index, class_id: cleanedData.class_id, error: 'Mã chương trình không tồn tại' });
            continue;
          }
        }

        if (cleanedData.class_size && (isNaN(cleanedData.class_size) || cleanedData.class_size < 0)) {
          results.errors.push({ index, class_id: cleanedData.class_id, error: 'Sĩ số lớp học không hợp lệ' });
          continue;
        }

        // Kiểm tra class_id đã tồn tại chưa
        const existingClass = await models.Classes.findOne({
          where: { class_id: cleanedData.class_id },
        });
        if (existingClass) {
          results.errors.push({ index, class_id: cleanedData.class_id, error: 'Mã lớp học đã tồn tại' });
          continue;
        }

        // Tạo lớp học mới
        const newClass = await models.Classes.create(cleanedData);
        results.success.push(newClass);
      } catch (error) {
        results.errors.push({ index, class_id: classData.class_id || 'N/A', error: error.message || 'Lỗi không xác định' });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập lớp học từ JSON:", error);
    throw error;
  }
};

/**
 * Validate cấu trúc template Excel cho lớp học.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã lớp học'];
  const optionalColumns = ['Tên lớp học', 'Sĩ số', 'Trạng thái', 'Mã khóa học', 'Mã chương trình'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};