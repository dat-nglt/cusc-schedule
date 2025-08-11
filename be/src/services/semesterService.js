import models from '../models/index.js'; // Import models từ index.js

const { Semester, Subject } = models; // Lấy model Semester từ models
/**
 * Lấy tất cả các học kỳ.
 * @returns {Promise<Array>} Danh sách tất cả các học kỳ.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllSemestersService = async () => {
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
export const getSemesterByIdService = async (id) => {
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
export const createSemesterService = async (semesterData) => {
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
export const updateSemesterService = async (id, semesterData) => {
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
export const deleteSemesterService = async (id) => {
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
export const importSemestersFromJSONService = async (semestersData) => {
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
        if (!semesterData.semester_id || !semesterData.semester_name) {
          results.errors.push({
            index: index,
            semester_id: semesterData.semester_id || 'N/A',
            error: 'Mã học kỳ, Tên học kỳ là bắt buộc'
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
        const cleanedData = {
          semester_id: semesterData.semester_id.toString().trim(),
          semester_name: semesterData.semester_name.toString().trim(),
          duration_weeks: semesterData.duration_weeks || null, // Chuyển đổi sang chuỗi và xóa khoảng trắng
          program_id: semesterData.program_id ? semesterData.program_id.toString().trim() : null,
          status: semesterData.status || 'Hoạt động' // Mặc định là 'hoạt động' nếu không có giá trị
        };

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
 * Lấy danh sách học kỳ với cấu trúc để tạo thời khóa biểu.
 * @returns {Promise<Object>} Danh sách học kỳ với cấu trúc semesters và subjects.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getSemesterCreateScheduleService = async () => {
  try {
    const semesters = await Semester.findAll({
      attributes: ['semester_id', 'duration_weeks'],
      include: [{
        model: Subject,
        as: 'subjects',
        attributes: ['subject_id']
      }]
    });

    // Chuyển đổi sang cấu trúc JSON yêu cầu
    const formattedSemesters = semesters.map(semester => ({
      semester_id: semester.semester_id,
      duration_weeks: semester.duration_weeks,
      subject_ids: semester.subjects.map(subject => (subject.subject_id))
    }));

    return formattedSemesters;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách học kỳ để tạo thời khóa biểu:', error);
    throw error;
  }
};