import models from '../models/index.js'; // Giả định bạn có models đã được export từ index.js
import { Op } from 'sequelize'; // Import Op nếu cần cho các hàm list tương lai
import ExcelUtils from "../utils/ExcelUtils.js"; // Giả định bạn có ExcelUtils cho các hàm import từ Excel

const { Subject } = models; // Lấy model Subject từ models
/**
 * Lấy tất cả các môn học.
 * @returns {Promise<Array>} Danh sách tất cả các môn học.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllSubjects = async () => {
  try {
    const subjects = await Subject.findAll();
    return subjects;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách môn học:", error);
    throw error;
  }
};

/**
 * Lấy thông tin một môn học theo ID.
 * @param {string} subjectId - ID của môn học.
 * @returns {Promise<Object|null>} Môn học tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getSubjectById = async (subjectId) => {
  try {
    const subject = await Subject.findOne({
      where: { subject_id: subjectId }
    });
    return subject;
  } catch (error) {
    console.error("Lỗi khi lấy môn học theo ID:", error);
    throw error;
  }
};

/**
 * Tạo một môn học mới.
 * @param {Object} subjectData - Dữ liệu của môn học mới.
 * @returns {Promise<Object>} Môn học đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo môn học.
 */
export const createSubject = async (subjectData) => {
  try {
    const newSubject = await Subject.create(subjectData);
    return newSubject;
  } catch (error) {
    console.error("Lỗi khi tạo môn học:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một môn học.
 * @param {string} subjectId - ID của môn học cần cập nhật.
 * @param {Object} subjectData - Dữ liệu cập nhật cho môn học.
 * @returns {Promise<Object>} Môn học đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy môn học hoặc có lỗi.
 */
export const updateSubject = async (subjectId, subjectData) => {
  try {
    const [updated] = await Subject.update(subjectData, {
      where: { subject_id: subjectId }
    });
    if (updated) {
      const updatedSubject = await Subject.findOne({ where: { subject_id: subjectId } });
      return updatedSubject;
    }
    throw new Error("Không tìm thấy môn học");
  } catch (error) {
    console.error("Lỗi khi cập nhật môn học:", error);
    throw error;
  }
};

/**
 * Xóa một môn học.
 * @param {string} subjectId - ID của môn học cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy môn học hoặc có lỗi.
 */
export const deleteSubject = async (subjectId) => {
  try {
    const deleted = await Subject.destroy({
      where: { subject_id: subjectId }
    });
    if (deleted) {
      return { message: "Môn học đã được xóa thành công" };
    }
    throw new Error("Không tìm thấy môn học");
  } catch (error) {
    console.error("Lỗi khi xóa môn học:", error);
    throw error;
  }
};

/**
 * Tìm kiếm môn học theo học kỳ.
 * @param {string} semesterId - ID của học kỳ.
 * @returns {Promise<Array>} Danh sách các môn học thuộc học kỳ đó.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getSubjectsBySemester = async (semesterId) => {
  try {
    const subjects = await Subject.findAll({
      where: { semester_id: semesterId }
    });
    return subjects;
  } catch (error) {
    console.error("Lỗi khi lấy môn học theo học kỳ:", error);
    throw error;
  }
}

/**
 * Nhập dữ liệu môn học từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} subjectsData - Mảng các đối tượng môn học.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importSubjectsFromJSON = async (subjectsData) => {
  try {
    if (!subjectsData || !Array.isArray(subjectsData)) {
      throw new Error("Dữ liệu môn học không hợp lệ");
    }
    const results = {
      success: [],
      errors: [],
      total: subjectsData.length
    };

    // Validate và tạo môn học cho từng item
    for (let i = 0; i < subjectsData.length; i++) {
      const subjectData = subjectsData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!subjectData.subject_id) {
          results.errors.push({
            index: index,
            subject_id: subjectData.subject_id || 'N/A',
            error: 'Mã môn học là bắt buộc'
          });
          continue;
        }
        if (!subjectData.subject_name) {
          results.errors.push({
            index: index,
            subject_id: subjectData.subject_id || 'N/A',
            error: 'Tên môn học là bắt buộc'
          });
          continue;
        }
        if (!subjectData.credit) {
          results.errors.push({
            index: index,
            subject_id: subjectData.subject_id || 'N/A',
            error: 'Số tín chỉ là bắt buộc'
          });
          continue;
        }


        // Clean và format data (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
        const cleanedData = {
          subject_id: subjectData.subject_id.toString().trim(),
          subject_name: subjectData.subject_name.toString().trim(),
          credit: subjectData.credit ? parseInt(subjectData.credit) : null, // Chuyển đổi sang số nguyên nếu có
          theory_hours: subjectData.theory_hours ? parseInt(subjectData.theory_hours) : null,
          practice_hours: subjectData.practice_hours ? parseInt(subjectData.practice_hours) : null,
          semester_id: subjectData.semester_id ? subjectData.semester_id.toString().trim() : null,
          status: subjectData.status || 'Hoạt động' // Mặc định là 'hoạt động' nếu không có giá trị,
        };

        // Validate credit, theory_hours, practice_hours
        if (cleanedData.credit !== null && (isNaN(cleanedData.credit) || cleanedData.credit < 0)) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: 'Số tín chỉ phải là số nguyên dương'
          });
          continue;
        }
        if (cleanedData.theory_hours !== null && (isNaN(cleanedData.theory_hours) || cleanedData.theory_hours < 0)) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: 'Số giờ lý thuyết phải là số nguyên dương'
          });
          continue;
        }
        if (cleanedData.practice_hours !== null && (isNaN(cleanedData.practice_hours) || cleanedData.practice_hours < 0)) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: 'Số giờ thực hành phải là số nguyên dương'
          });
          continue;
        }


        // Kiểm tra subject_id đã tồn tại chưa
        const existingSubject = await Subject.findOne({
          where: { subject_id: cleanedData.subject_id }
        });
        if (existingSubject) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: 'Mã môn học đã tồn tại'
          });
          continue;
        }

        // Tạo Subject mới
        const newSubject = await Subject.create(cleanedData);
        results.success.push(newSubject);

      } catch (error) {
        results.errors.push({
          index: index,
          subject_id: subjectData.subject_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }
    return results;
  } catch (error) {
    console.error('Lỗi khi nhập môn học từ JSON:', error);
    throw error;
  }
};

/**
 * Liệt kê các môn học với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.subject_id] - Lọc theo ID môn học (tìm kiếm gần đúng).
 * @param {string} [filters.subject_name] - Lọc theo tên môn học (tìm kiếm gần đúng).
 * @param {number} [filters.credit] - Lọc theo số tín chỉ.
 * @param {string} [filters.semester_id] - Lọc theo ID học kỳ.
 * @param {string} [filters.status] - Lọc theo trạng thái.
 * @returns {Promise<Array>} Danh sách các môn học phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listSubjects = async (filters) => {
  try {
    const whereClause = {};

    if (filters.subject_id) {
      whereClause.subject_id = {
        [Op.iLike]: `%${filters.subject_id}%`
      };
    }
    if (filters.subject_name) {
      whereClause.subject_name = {
        [Op.iLike]: `%${filters.subject_name}%`
      };
    }
    if (filters.credit) {
      whereClause.credit = filters.credit;
    }
    if (filters.semester_id) {
      whereClause.semester_id = filters.semester_id;
    }
    if (filters.status) {
      whereClause.status = {
        [Op.iLike]: `%${filters.status}%`
      };
    }

    const subjects = await Subject.findAll({
      where: whereClause,
      attributes: ['subject_id', 'subject_name', 'credit', 'theory_hours', 'practice_hours', 'semester_id', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return subjects;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê môn học: ' + error.message);
  }
};

/**
 * Nhập dữ liệu môn học từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importSubjectsFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi tên cột tiếng Việt sang tiếng Anh (giả định ExcelUtils có hàm này)
    const subjectsData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: subjectsData.length
    };

    // Validate và tạo môn học cho từng hàng
    for (let i = 0; i < subjectsData.length; i++) {
      const row = subjectsData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.subject_id || !row.subject_name || !row.credit) {
          results.errors.push({
            row: rowIndex,
            subject_id: row.subject_id || 'N/A',
            error: 'Mã môn học, Tên môn học và Số tín chỉ là bắt buộc'
          });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc database
        const subjectData = {
          subject_id: ExcelUtils.cleanString(row.subject_id),
          subject_name: ExcelUtils.cleanString(row.subject_name),
          credit: row.credit ? parseInt(row.credit) : null,
          theory_hours: row.theory_hours ? parseInt(row.theory_hours) : null,
          practice_hours: row.practice_hours ? parseInt(row.practice_hours) : null,
          semester_id: ExcelUtils.cleanString(row.semester_id) || null,
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate credit, theory_hours, practice_hours
        if (subjectData.credit !== null && (isNaN(subjectData.credit) || subjectData.credit < 0)) {
          results.errors.push({
            row: rowIndex,
            subject_id: subjectData.subject_id,
            error: 'Số tín chỉ phải là số nguyên dương'
          });
          continue;
        }
        if (subjectData.theory_hours !== null && (isNaN(subjectData.theory_hours) || subjectData.theory_hours < 0)) {
          results.errors.push({
            row: rowIndex,
            subject_id: subjectData.subject_id,
            error: 'Số giờ lý thuyết phải là số nguyên dương'
          });
          continue;
        }
        if (subjectData.practice_hours !== null && (isNaN(subjectData.practice_hours) || subjectData.practice_hours < 0)) {
          results.errors.push({
            row: rowIndex,
            subject_id: subjectData.subject_id,
            error: 'Số giờ thực hành phải là số nguyên dương'
          });
          continue;
        }

        // Kiểm tra subject_id đã tồn tại chưa
        const existingSubject = await Subject.findByPk(subjectData.subject_id);
        if (existingSubject) {
          results.errors.push({
            row: rowIndex,
            subject_id: subjectData.subject_id,
            error: 'Mã môn học đã tồn tại'
          });
          continue;
        }

        // Tạo Subject mới
        const newSubject = await Subject.create(subjectData);
        results.success.push({
          row: rowIndex,
          subject_id: newSubject.subject_id,
          subject_name: newSubject.subject_name
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          subject_id: row.subject_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập môn học từ Excel:", error);
    throw error;
  }
};

/**
 * Validate cấu trúc template Excel cho môn học.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã môn học', 'Tên môn học', 'Số tín chỉ'];
  const optionalColumns = ['Số giờ lý thuyết', 'Số giờ thực hành', 'Mã học kỳ', 'Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};