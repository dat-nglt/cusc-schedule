import models from '../models/index.js';

const { sequelize, Program, Semester, Subject } = models;
/**
 * Lấy tất cả các chương trình đào tạo.
 * @returns {Promise<Array>} Danh sách tất cả các chương trình.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllProgramsService = async () => {
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
export const getProgramByIdService = async (id) => {
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
export const createProgramService = async (programData) => {
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
export const updateProgramService = async (id, programData) => {
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
export const deleteProgramService = async (id) => {
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
export const importProgramsFromJSONService = async (programsData) => {
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
          duration: programData.duration ? parseFloat(programDataDuration) : null,
          description: programData.description ? programData.description.toString().trim() : null,
          status: programData.status ? programData.status.toString().trim() : 'Hoạt động'
        };

        // Validateduration nếu được cung cấp
        if (cleanedDataDuration !== null && (isNaN(cleanedData.duration) || cleanedData.duration < 0)) {
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
 * Lấy danh sách chương trình đào tạo với cấu trúc để tạo thời khóa biểu.
 * @returns {Promise<Object>} Danh sách chương trình với cấu trúc semesters và subjects.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getProgramCreateScheduleService = async () => {
  try {
    const programs = await Program.findAll({
      attributes: ['program_id', 'program_name', 'duration'],
      include: [{
        model: Semester,
        as: 'semesters',
        attributes: ['semester_id'],
        include: [{
          model: Subject,
          as: 'subjects',
          attributes: ['subject_id']
        }]
      }]
    });

    // Chuyển đổi sang cấu trúc JSON yêu cầu
    const formattedPrograms = programs.map(program => ({
      program_id: program.program_id,
      program_name: program.program_name,
      duration: program.duration,
      semesters: program.semesters.map(semester => ({
        semester_id: semester.semester_id,
        subject_ids: semester.subjects.map(subject => (subject.subject_id))
      }))
    }));

    return formattedPrograms;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chương trình để tạo thời khóa biểu:', error);
    throw error;
  }
};