import models from '../models/index.js';
import { Op } from 'sequelize'; // Import Op nếu cần cho các hàm list tương lai
import ExcelUtils from "../utils/ExcelUtils.js"; // Giả định bạn có ExcelUtils cho các hàm import từ Excel

const { Program } = models;
/**
 * Lấy tất cả các chương trình đào tạo.
 * @returns {Promise<Array>} Danh sách tất cả các chương trình.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllPrograms = async () => {
  try {
    const programs = await Program.findAll();
    return programs;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chương trình đào tạo:', error);
    throw error;
  }
};

/**
 * Lấy thông tin một chương trình đào tạo theo ID.
 * @param {string} id - ID của chương trình.
 * @returns {Promise<Object|null>} Chương trình tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getProgramById = async (id) => {
  try {
    const program = await Program.findByPk(id);
    return program;
  } catch (error) {
    console.error(`Lỗi khi lấy chương trình với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một chương trình đào tạo mới.
 * @param {Object} programData - Dữ liệu của chương trình mới.
 * @returns {Promise<Object>} Chương trình đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo chương trình.
 */
export const createProgram = async (programData) => {
  try {
    const program = await Program.create(programData);
    return program;
  } catch (error) {
    console.error('Lỗi khi tạo chương trình đào tạo:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một chương trình đào tạo.
 * @param {string} id - ID của chương trình cần cập nhật.
 * @param {Object} programData - Dữ liệu cập nhật cho chương trình.
 * @returns {Promise<Object>} Chương trình đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy chương trình hoặc có lỗi.
 */
export const updateProgram = async (id, programData) => {
  try {
    const program = await Program.findByPk(id);
    if (!program) throw new Error("Không tìm thấy chương trình đào tạo");
    return await program.update(programData);
  } catch (error) {
    console.error(`Lỗi khi cập nhật chương trình với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một chương trình đào tạo.
 * @param {string} id - ID của chương trình cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy chương trình hoặc có lỗi.
 */
export const deleteProgram = async (id) => {
  try {
    const program = await Program.findByPk(id);
    if (!program) throw new Error("Không tìm thấy chương trình đào tạo");
    await program.destroy();
    return { message: "Chương trình đã được xóa thành công" };
  } catch (error) {
    console.error(`Lỗi khi xóa chương trình với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu chương trình đào tạo từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} programsData - Mảng các đối tượng chương trình đào tạo.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importProgramsFromJSON = async (programsData) => {
  try {
    if (!programsData || !Array.isArray(programsData)) {
      throw new Error("Dữ liệu chương trình đào tạo không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: programsData.length
    };

    // Duyệt qua từng item để validate và tạo chương trình
    for (let i = 0; i < programsData.length; i++) {
      const programData = programsData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!programData.program_id) {
          results.errors.push({
            index: index,
            program_id: programData.program_id || 'N/A',
            error: 'Mã chương trình là bắt buộc'
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu
        const cleanedData = {
          program_id: programData.program_id.toString().trim(),
          program_name: programData.program_name ? programData.program_name.toString().trim() : null,
          training_duration: programData.training_duration ? parseFloat(programData.training_duration) : null,
          description: programData.description ? programData.description.toString().trim() : null,
          status: programData.status ? programData.status.toString().trim() : 'Hoạt động'
        };

        // Validate training_duration nếu được cung cấp
        if (cleanedData.training_duration !== null && (isNaN(cleanedData.training_duration) || cleanedData.training_duration < 0)) {
          results.errors.push({
            index: index,
            program_id: cleanedData.program_id,
            error: 'Thời gian đào tạo phải là số dương'
          });
          continue;
        }

        // Kiểm tra program_id đã tồn tại chưa
        const existingProgram = await Program.findOne({
          where: { program_id: cleanedData.program_id }
        });
        if (existingProgram) {
          results.errors.push({
            index: index,
            program_id: cleanedData.program_id,
            error: 'Mã chương trình đã tồn tại'
          });
          continue;
        }

        // Tạo Program mới
        const newProgram = await Program.create(cleanedData);
        results.success.push(newProgram);

      } catch (error) {
        results.errors.push({
          index: index,
          program_id: programData.program_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }
    return results;
  } catch (error) {
    console.error("Lỗi khi nhập chương trình đào tạo từ JSON:", error);
    throw error;
  }
};

/**
 * Liệt kê các chương trình đào tạo với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.program_id] - Lọc theo ID chương trình (tìm kiếm gần đúng).
 * @param {string} [filters.program_name] - Lọc theo tên chương trình (tìm kiếm gần đúng).
 * @param {string} [filters.status] - Lọc theo trạng thái.
 * @returns {Promise<Array>} Danh sách các chương trình đào tạo phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listPrograms = async (filters) => {
  try {
    const whereClause = {};

    if (filters.program_id) {
      whereClause.program_id = {
        [Op.iLike]: `%${filters.program_id}%`
      };
    }
    if (filters.program_name) {
      whereClause.program_name = {
        [Op.iLike]: `%${filters.program_name}%`
      };
    }
    if (filters.status) {
      whereClause.status = {
        [Op.iLike]: `%${filters.status}%`
      };
    }

    const programs = await Program.findAll({
      where: whereClause,
      attributes: ['program_id', 'program_name', 'training_duration', 'description', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return programs;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê chương trình đào tạo: ' + error.message);
  }
};

/**
 * Nhập dữ liệu chương trình đào tạo từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importProgramsFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi tên cột tiếng Việt sang tiếng Anh (nếu cần, giả định ExcelUtils có hàm này)
    const programsData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: programsData.length
    };

    // Validate và tạo chương trình cho từng hàng
    for (let i = 0; i < programsData.length; i++) {
      const row = programsData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.program_id) {
          results.errors.push({
            row: rowIndex,
            program_id: row.program_id || 'N/A',
            error: 'Mã chương trình là bắt buộc'
          });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc database
        const programData = {
          program_id: ExcelUtils.cleanString(row.program_id),
          program_name: ExcelUtils.cleanString(row.program_name) || null,
          training_duration: row.training_duration ? parseFloat(row.training_duration) : null,
          description: ExcelUtils.cleanString(row.description) || null,
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate training_duration
        if (programData.training_duration !== null && (isNaN(programData.training_duration) || programData.training_duration < 0)) {
          results.errors.push({
            row: rowIndex,
            program_id: programData.program_id,
            error: 'Thời gian đào tạo phải là số dương'
          });
          continue;
        }

        // Kiểm tra program_id đã tồn tại chưa
        const existingProgram = await Program.findByPk(programData.program_id);
        if (existingProgram) {
          results.errors.push({
            row: rowIndex,
            program_id: programData.program_id,
            error: 'Mã chương trình đã tồn tại'
          });
          continue;
        }

        // Tạo Program mới
        const newProgram = await Program.create(programData);
        results.success.push({
          row: rowIndex,
          program_id: newProgram.program_id,
          program_name: newProgram.program_name
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          program_id: row.program_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập chương trình đào tạo từ Excel:", error);
    throw error;
  }
};

/**
 * Validate cấu trúc template Excel cho chương trình đào tạo.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã chương trình', 'Tên chương trình'];
  const optionalColumns = ['Thời gian đào tạo', 'Mô tả', 'Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};