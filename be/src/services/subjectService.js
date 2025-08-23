import models from "../models/index.js"; // Giả định bạn có models đã được export từ index.js
import logger from "../utils/logger.js";

const { Subject } = models; // Lấy model Subject từ models
/**
 * Lấy tất cả các môn học.
 * @returns {Promise<Array>} Danh sách tất cả các môn học.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllSubjectsService = async () => {
  try {
    const subjects = await Subject.findAll();
    return subjects;
  } catch (error) {
    logger.error("Lỗi khi truy vấn danh sách môn học từ CSDL:", error);
    throw new Error("Đã xảy ra lỗi hệ thống khi lấy danh sách môn học.");
  }
};

/**
 * Lấy thông tin một môn học theo ID.
 * @param {string} subjectId - ID của môn học.
 * @returns {Promise<Object|null>} Môn học tìm thấy hoặc null nếu không tìm thấy.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getSubjectByIdService = async (subjectId) => {
  try {
    const subject = await Subject.findOne({
      where: { subject_id: subjectId },
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
export const createSubjectService = async (subjectData) => {
  try {
    // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
    console.log("Kiểm tra tính hợp lệ của dữ liệu môn học:", subjectData);
    
    if (
      !subjectData.subject_id ||
      !subjectData.subject_name ||
      subjectData.theory_hours < 0 ||
      subjectData.practice_hours < 0
    ) {
      // Ném lỗi với tên cụ thể để controller có thể nhận biết
      const error = new Error(
        "Dữ liệu không hợp lệ. Vui lòng điền đầy đủ và đúng thông tin."
      );
      error.name = "ValidationError";
      throw error;
    }

    // 2. Kiểm tra xung đột dữ liệu (ví dụ: tên môn học đã tồn tại)
    const existingSubject = await Subject.findOne({
      where: { subject_id: subjectData.subject_id },
    });

    if (existingSubject) {
      const conflictError = new Error("Môn học với tên này đã tồn tại.");
      conflictError.name = "SequelizeUniqueConstraintError";
      throw conflictError;
    }

    // 3. Thực hiện tạo mới nếu mọi thứ đều hợp lệ
    const newSubject = await Subject.create(subjectData);
    return newSubject;
  } catch (error) {
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
export const updateSubjectService = async (subjectId, subjectData) => {
  try {
    const [updated] = await Subject.update(subjectData, {
      where: { subject_id: subjectId },
    });
    if (updated) {
      const updatedSubject = await Subject.findOne({
        where: { subject_id: subjectId },
      });
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
export const deleteSubjectService = async (subjectId) => {
  try {
    const subject = await Subject.findByPk(subjectId);
    if (!subject) throw new Error("Không tìm thấy môn học");
    await subject.destroy();
    return { message: "Môn học đã được xóa thành công" };
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
export const getSubjectsBySemesterService = async (semesterId) => {
  try {
    const subjects = await Subject.findAll({
      where: { semester_id: semesterId },
    });
    return subjects;
  } catch (error) {
    console.error("Lỗi khi lấy môn học theo học kỳ:", error);
    throw error;
  }
};

/**
 * Nhập dữ liệu môn học từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} subjectsData - Mảng các đối tượng môn học.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importSubjectsFromJSONService = async (subjectsData) => {
  try {
    if (!subjectsData || !Array.isArray(subjectsData)) {
      throw new Error("Dữ liệu môn học không hợp lệ");
    }
    const results = {
      success: [],
      errors: [],
      total: subjectsData.length,
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
            subject_id: subjectData.subject_id || "N/A",
            error: "Mã môn học là bắt buộc",
          });
          continue;
        }
        if (!subjectData.subject_name) {
          results.errors.push({
            index: index,
            subject_id: subjectData.subject_id || "N/A",
            error: "Tên môn học là bắt buộc",
          });
          continue;
        }
        if (!subjectData.credit) {
          results.errors.push({
            index: index,
            subject_id: subjectData.subject_id || "N/A",
            error: "Số tín chỉ là bắt buộc",
          });
          continue;
        }

        // Clean và format data (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
        const cleanedData = {
          subject_id: subjectData.subject_id.toString().trim(),
          subject_name: subjectData.subject_name.toString().trim(),
          credit: subjectData.credit ? parseInt(subjectData.credit) : null, // Chuyển đổi sang số nguyên nếu có
          theory_hours: subjectData.theory_hours
            ? parseInt(subjectData.theory_hours)
            : null,
          practice_hours: subjectData.practice_hours
            ? parseInt(subjectData.practice_hours)
            : null,
          semester_id: subjectData.semester_id
            ? subjectData.semester_id.toString().trim()
            : null,
          status: subjectData.status || "Hoạt động", // Mặc định là 'hoạt động' nếu không có giá trị,
        };

        // Validate credit, theory_hours, practice_hours
        if (
          cleanedData.credit !== null &&
          (isNaN(cleanedData.credit) || cleanedData.credit < 0)
        ) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: "Số tín chỉ phải là số nguyên dương",
          });
          continue;
        }
        if (
          cleanedData.theory_hours !== null &&
          (isNaN(cleanedData.theory_hours) || cleanedData.theory_hours < 0)
        ) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: "Số giờ lý thuyết phải là số nguyên dương",
          });
          continue;
        }
        if (
          cleanedData.practice_hours !== null &&
          (isNaN(cleanedData.practice_hours) || cleanedData.practice_hours < 0)
        ) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: "Số giờ thực hành phải là số nguyên dương",
          });
          continue;
        }

        // Kiểm tra subject_id đã tồn tại chưa
        const existingSubject = await Subject.findOne({
          where: { subject_id: cleanedData.subject_id },
        });
        if (existingSubject) {
          results.errors.push({
            index: index,
            subject_id: cleanedData.subject_id,
            error: "Mã môn học đã tồn tại",
          });
          continue;
        }

        // Tạo Subject mới
        const newSubject = await Subject.create(cleanedData);
        results.success.push(newSubject);
      } catch (error) {
        results.errors.push({
          index: index,
          subject_id: subjectData.subject_id || "N/A",
          error: error.message || "Lỗi không xác định",
        });
      }
    }
    return results;
  } catch (error) {
    console.error("Lỗi khi nhập môn học từ JSON:", error);
    throw error;
  }
};
