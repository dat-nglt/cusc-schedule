import Course from "../models/Course.js";
import { Op } from 'sequelize'; // Đảm bảo import Op nếu chưa có
import ExcelUtils from "../utils/ExcelUtils.js";

/**
 * Lấy tất cả các khóa học.
 * @returns {Promise<Array>} Danh sách các khóa học.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllCourses = async () => {
  try {
    const courses = await Course.findAll();
    return courses;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách khóa học: ' + error.message);
  }
};

/**
 * Lấy thông tin một khóa học theo ID.
 * @param {string} course_id - ID của khóa học.
 * @returns {Promise<Object|null>} Khóa học tìm thấy hoặc null nếu không tìm thấy.
 */
export const getCourseById = async (course_id) => {
  return await Course.findByPk(course_id);
};

/**
 * Tạo một khóa học mới.
 * @param {Object} data - Dữ liệu của khóa học mới.
 * @returns {Promise<Object>} Khóa học đã được tạo.
 */
export const createCourse = async (data) => {
  return await Course.create(data);
};

/**
 * Cập nhật thông tin một khóa học.
 * @param {string} course_id - ID của khóa học cần cập nhật.
 * @param {Object} data - Dữ liệu cập nhật cho khóa học.
 * @returns {Promise<Object>} Khóa học đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy khóa học.
 */
export const updateCourse = async (course_id, data) => {
  const course = await Course.findByPk(course_id);
  if (!course) throw new Error("Không tìm thấy khóa học");
  return await course.update(data);
};

/**
 * Xóa một khóa học.
 * @param {string} course_id - ID của khóa học cần xóa.
 * @returns {Promise<number>} Số hàng đã bị xóa.
 * @throws {Error} Nếu không tìm thấy khóa học.
 */
export const deleteCourse = async (course_id) => {
  const course = await Course.findOne({ where: { course_id } });
  if (!course) throw new Error("Không tìm thấy khóa học");
  return await course.destroy();
};

/**
 * Liệt kê các khóa học với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.course_id] - Lọc theo ID khóa học (tìm kiếm gần đúng).
 * @param {string} [filters.course_name] - Lọc theo tên khóa học (tìm kiếm gần đúng).
 * @param {string} [filters.start_date] - Lọc theo ngày bắt đầu (định dạng YYYY-MM-DD).
 * @returns {Promise<Array>} Danh sách các khóa học phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listCourses = async (filters) => {
  try {
    const whereClause = {};

    // Lọc theo course_id
    if (filters.course_id) {
      whereClause.course_id = {
        [Op.iLike]: `%${filters.course_id}%`
      };
    }

    // Lọc theo course_name
    if (filters.course_name) {
      whereClause.course_name = {
        [Op.iLike]: `%${filters.course_name}%`
      };
    }

    // Lọc theo start_date
    if (filters.start_date) {
      whereClause.start_date = filters.start_date; // YYYY-MM-DD
    }

    const courses = await Course.findAll({
      where: whereClause,
      attributes: ['course_id', 'course_name', 'start_date', 'end_date', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return courses;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê khóa học: ' + error.message);
  }
};

/**
 * Nhập dữ liệu khóa học từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importCoursesFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi tên cột tiếng Việt sang tiếng Anh
    const coursesData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: coursesData.length
    };

    // Duyệt qua từng hàng để validate và tạo khóa học
    for (let i = 0; i < coursesData.length; i++) {
      const row = coursesData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.course_id || !row.course_name || !row.start_date || !row.end_date) {
          results.errors.push({
            row: rowIndex,
            course_id: row.course_id || 'N/A',
            error: 'Mã khóa học, Tên khóa học, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc database
        const courseData = {
          course_id: ExcelUtils.cleanString(row.course_id),
          course_name: ExcelUtils.cleanString(row.course_name),
          start_date: ExcelUtils.formatExcelDate(row.start_date),
          end_date: ExcelUtils.formatExcelDate(row.end_date),
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate khoảng ngày
        const startDate = new Date(courseData.start_date);
        const endDate = new Date(courseData.end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5); // Giới hạn 5 năm trong tương lai

        if (isNaN(startDate) || isNaN(endDate)) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Định dạng ngày không hợp lệ'
          });
          continue;
        }

        if (startDate > endDate) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'
          });
          continue;
        }

        if (endDate > maxFutureDate) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Thời gian kết thúc không được quá 5 năm trong tương lai'
          });
          continue;
        }

        // Kiểm tra course_id đã tồn tại chưa
        const existingCourse = await Course.findByPk(courseData.course_id);
        if (existingCourse) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Mã khóa học đã tồn tại'
          });
          continue;
        }

        // Tạo khóa học mới
        const newCourse = await Course.create(courseData);
        results.success.push({
          row: rowIndex,
          course_id: newCourse.course_id,
          course_name: newCourse.course_name
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          course_id: row.course_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập khóa học từ Excel:", error);
    throw error;
  }
};

/**
 * Nhập dữ liệu khóa học từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} coursesData - Mảng các đối tượng khóa học.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importCoursesFromJson = async (coursesData) => {
  try {
    if (!coursesData || !Array.isArray(coursesData)) {
      throw new Error("Dữ liệu khóa học không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: coursesData.length
    };

    // Duyệt qua từng item để validate và tạo khóa học
    for (let i = 0; i < coursesData.length; i++) {
      const courseData = coursesData[i];
      const index = i + 1;

      try {
        // Validate các trường bắt buộc
        if (!courseData.course_id || !courseData.course_name || !courseData.start_date || !courseData.end_date) {
          results.errors.push({
            index: index,
            course_id: courseData.course_id || 'N/A',
            error: 'Mã khóa học, Tên khóa học, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc'
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu
        const cleanedData = {
          course_id: courseData.course_id.toString().trim(),
          course_name: courseData.course_name.toString().trim(),
          start_date: courseData.start_date || null,
          end_date: courseData.end_date || null,
          status: courseData.status || 'Hoạt động',
        };

        // Validate khoảng ngày
        const startDate = new Date(cleanedData.start_date);
        const endDate = new Date(cleanedData.end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5); // Giới hạn 5 năm trong tương lai

        if (isNaN(startDate) || isNaN(endDate)) {
          results.errors.push({
            index: index,
            course_id: cleanedData.course_id,
            error: 'Định dạng ngày không hợp lệ'
          });
          continue;
        }

        if (startDate > endDate) {
          results.errors.push({
            index: index,
            course_id: cleanedData.course_id,
            error: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'
          });
          continue;
        }

        if (endDate > maxFutureDate) {
          results.errors.push({
            index: index,
            course_id: cleanedData.course_id,
            error: 'Thời gian kết thúc không được quá 5 năm trong tương lai'
          });
          continue;
        }

        // Kiểm tra course_id đã tồn tại chưa
        const existingCourse = await Course.findOne({
          where: { course_id: cleanedData.course_id }
        });
        if (existingCourse) {
          results.errors.push({
            index: index,
            course_id: cleanedData.course_id,
            error: 'Mã khóa học đã tồn tại'
          });
          continue;
        }

        // Tạo khóa học mới
        const newCourse = await Course.create(cleanedData);
        results.success.push(newCourse);
      } catch (error) {
        results.errors.push({
          index: index,
          course_id: courseData.course_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập khóa học từ JSON:", error);
    throw error;
  }
};

/**
 * Validate cấu trúc template Excel cho khóa học.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã khóa học', 'Tên khóa học', 'Thời gian bắt đầu', 'Thời gian kết thúc'];
  const optionalColumns = ['Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};