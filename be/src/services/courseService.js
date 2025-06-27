import Course from "../models/Course.js";
import { Op } from 'sequelize'; // Đảm bảo import Op nếu chưa có
import ExcelUtils from "../utils/ExcelUtils.js";

export const getAllCourses = async () => {
  try {
    const courses = await Course.findAll();
    return courses;
  } catch (error) {
    throw new Error('Error fetching courses: ' + error.message);
  }
};

// Get one course by ID
export const getCourseById = async (course_id) => {
  return await Course.findByPk(course_id);
};

// Create a new course
export const createCourse = async (data) => {
  return await Course.create(data);
};

// Update a course
export const updateCourse = async (course_id, data) => {
  const course = await Course.findByPk(course_id);
  if (!course) throw new Error("Course not found");
  return await course.update(data);
};

// Delete a course
export const deleteCourse = async (course_id) => {
  const course = await Course.findOne({ where: { course_id } });
  if (!course) throw new Error("Course not found");
  return await course.destroy();
};

/**
 * Lọc danh sách các khóa học theo mã, tên, và thời gian bắt đầu
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
    throw new Error('Error listing courses: ' + error.message);
  }
};

export const importCoursesFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi cột tiếng Việt sang tiếng Anh
    const coursesData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: coursesData.length,
    };

    // Validate và tạo course cho từng row
    for (let i = 0; i < coursesData.length; i++) {
      const row = coursesData[i];
      const rowIndex = i + 2; // Bắt đầu từ row 2 (sau header)

      try {
        // Validate required fields
        if (!row.course_id || !row.course_name || !row.start_date || !row.end_date) {
          results.errors.push({
            row: rowIndex,
            course_id: row.course_id || 'N/A',
            error: 'Mã khóa học, Tên khóa học, Thời gian bắt đầu và Thời gian kết thúc là bắt buộc',
          });
          continue;
        }

        // Format data theo structure của database
        const courseData = {
          course_id: ExcelUtils.cleanString(row.course_id),
          course_name: ExcelUtils.cleanString(row.course_name),
          start_date: ExcelUtils.formatExcelDate(row.start_date),
          end_date: ExcelUtils.formatExcelDate(row.end_date),
          status: ExcelUtils.cleanString(row.status) || 'Hoạt động',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate date range
        const startDate = new Date(courseData.start_date);
        const endDate = new Date(courseData.end_date);
        const today = new Date();
        const maxFutureDate = new Date(today);
        maxFutureDate.setFullYear(today.getFullYear() + 5); // Giới hạn 5 năm trong tương lai

        if (isNaN(startDate) || isNaN(endDate)) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Định dạng ngày không hợp lệ',
          });
          continue;
        }

        if (startDate > endDate) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc',
          });
          continue;
        }

        if (endDate > maxFutureDate) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Thời gian kết thúc không được quá 5 năm trong tương lai',
          });
          continue;
        }

        // Kiểm tra course_id đã tồn tại chưa
        const existingCourse = await Course.findByPk(courseData.course_id);
        if (existingCourse) {
          results.errors.push({
            row: rowIndex,
            course_id: courseData.course_id,
            error: 'Mã khóa học đã tồn tại',
          });
          continue;
        }

        // Tạo course mới
        const newCourse = await Course.create(courseData);
        results.success.push({
          row: rowIndex,
          course_id: newCourse.course_id,
          course_name: newCourse.course_name,
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          course_id: row.course_id || 'N/A',
          error: error.message || 'Lỗi không xác định',
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error importing courses from Excel:", error);
    throw error;
  }
};

// Validate Excel template structure
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã khóa học', 'Tên khóa học', 'Thời gian bắt đầu', 'Thời gian kết thúc'];
  const optionalColumns = ['Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};