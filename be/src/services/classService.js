import models from "../models/index.js";
import { Op } from "sequelize";
import ExcelUtils from "../utils/ExcelUtils.js";
import logger from "../utils/logger.js";

/**
 * Lấy tất cả các lớp học.
 * @returns {Promise<Array>} Danh sách các lớp học cùng với thông tin khóa học.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */

// export const getAllClassesService = async () => {
//   try {
//     const classes = await models.Classes.findAll({
//       include: [
//         { model: models.Course, attributes: ["course_id", "course_name"] },
//       ],
//     });

//     return classes;
//   } catch (error) {
//     throw new Error("Lỗi khi lấy danh sách lớp học: " + error.message);
//   }
// };

const { Classes, Course, sequelize } = models;
export const getAllClassesService = async () => {
  try {
    const classes = await models.Classes.findAll({});
    return classes;
  } catch (error) {
    console.error("Lỗi service khi lấy danh sách lớp học:", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để lấy danh sách lớp học.");
  }
};

/**
 * Lấy thông tin một lớp học theo ID.
 * @param {string} class_id - ID của lớp học.
 * @returns {Promise<Object|null>} Lớp học tìm thấy hoặc null nếu không tìm thấy, kèm thông tin khóa học.
 */
export const getClassByIdService = async (class_id) => {
  try {
    const classesInstance = await models.Classes.findByPk(class_id, {
      include: [
        {
          model: models.Course,
          as: "course",
          attributes: ["course_id", "course_name"],
        },
      ],
    });
    return classesInstance;
  } catch (error) {
    logger.error("Lỗi service khi lấy lớp học theo ID: ", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để lấy lớp học theo ID.");
  }
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
export const createClassService = async (data) => {
  try {
    const { class_id, class_name, course_id } = data;

    // Kiểm tra lớp học đã tồn tại chưa
    const existingClass = await Classes.findByPk(class_id);
    if (existingClass) {
      throw new Error(`Mã lớp học ${class_id} đã tồn tại.`);
    }

    // Kiểm tra tên lớp học
    if (class_name && class_name.length > 50) {
      throw new Error("Tên lớp học không được vượt quá 50 ký tự.");
    }

    // Kiểm tra khóa học có tồn tại không
    if (course_id) {
      const course = await Course.findByPk(course_id);
      if (!course) {
        throw new Error("Không tìm thấy khóa học.");
      }
    }
    // Kiểm tra chương trình có tồn tại không
    if (data.program_id) {
      const program = await models.Program.findByPk(data.program_id);
      if (!program) {
        throw new Error("Không tìm thấy chương trình.");
      }
    }

    // Tạo lớp học
    const newClass = await Classes.create(data);
    return newClass;
  } catch (error) {
    console.error("Lỗi service khi tạo lớp học:", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để tạo lớp học.");
  }
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
export const updateClassService = async (class_id, data) => {
  try {
    const classInstance = await Classes.findByPk(class_id);
    if (!classInstance) {
      return null;
    }

    if (data.course_id) {
      const course = await Course.findByPk(data.course_id);
      if (!course) {
        throw new Error("Không tìm thấy khóa học.");
      }
    }

    // Tên lớp học không được vượt quá 50 ký tự (logic này cũng có thể đặt ở đây để đảm bảo an toàn)
    if (data.class_name && data.class_name.length > 50) {
      throw new Error("Tên lớp học không được vượt quá 50 ký tự");
    }

    // Cập nhật lớp học
    await classInstance.update(data);
    return classInstance;
  } catch (error) {
    console.error("Lỗi service khi cập nhật lớp học:", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để cập nhật lớp học.");
  }
};
/**
 * Xóa một lớp học.
 * @param {string} class_id - ID của lớp học cần xóa.
 * @returns {Promise<number>} Số hàng đã bị xóa.
 * @throws {Error} Nếu không tìm thấy lớp học.
 */
export const deleteClassService = async (class_id) => {
  try {
    const deletedCount = await Classes.destroy({
      where: { class_id },
    });

    // `deletedCount` sẽ là 1 nếu xóa thành công, 0 nếu không tìm thấy.
    return deletedCount > 0;
  } catch (error) {
    console.error("Lỗi service khi xóa lớp học:", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để xóa lớp học.");
  }
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
export const listClassesService = async (filters = {}) => {
  try {
    const whereClause = {};

    // Xây dựng whereClause một cách hiệu quả hơn
    if (filters.class_id) {
      whereClause.class_id = { [Op.iLike]: `%${filters.class_id}%` };
    }
    if (filters.class_name) {
      whereClause.class_name = { [Op.iLike]: `%${filters.class_name}%` };
    }
    if (filters.status) {
      whereClause.status = { [Op.iLike]: `%${filters.status}%` };
    }
    if (filters.course_id) {
      whereClause.course_id = { [Op.iLike]: `%${filters.course_id}%` };
    }

    const classes = await Classes.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["course_id", "course_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return classes;
  } catch (error) {
    console.error("Lỗi service khi liệt kê lớp học:", error);
    throw new Error("Lỗi khi truy vấn cơ sở dữ liệu để liệt kê lớp học.");
  }
};

/**
 * Nhập dữ liệu lớp học từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importClassesFromExcelService = async (fileBuffer) => {
  try {
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng.");
    }

    const classesData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);
    const results = { success: [], errors: [], total: classesData.length };

    // Sử dụng Promise.all để xử lý song song, cải thiện hiệu suất
    const importPromises = classesData.map(async (row, index) => {
      const rowIndex = index + 2;

      try {
        // Validation và xử lý dữ liệu
        if (!row.class_id) {
          throw new Error("Mã lớp học là bắt buộc.");
        }

        const classData = {
          class_id: ExcelUtils.cleanString(row.class_id),
          class_name: ExcelUtils.cleanString(row.class_name),
          class_size: row.class_size ? parseInt(row.class_size) : null,
          status: ExcelUtils.cleanString(row.status),
          course_id: ExcelUtils.cleanString(row.course_id),
        };

        if (classData.class_name && classData.class_name.length > 50) {
          throw new Error("Tên lớp học không được vượt quá 50 ký tự.");
        }

        if (
          classData.class_size &&
          (isNaN(classData.class_size) || classData.class_size < 0)
        ) {
          throw new Error("Sĩ số lớp học không hợp lệ.");
        }

        const transaction = await sequelize.transaction();
        try {
          // Kiểm tra tồn tại và mối quan hệ
          const [existingClass, existingCourse] = await Promise.all([
            Classes.findByPk(classData.class_id, { transaction }),
            classData.course_id
              ? Course.findByPk(classData.course_id, { transaction })
              : Promise.resolve(true),
          ]);

          if (existingClass) {
            throw new Error("Mã lớp học đã tồn tại.");
          }
          if (classData.course_id && !existingCourse) {
            throw new Error("Mã khóa học không tồn tại.");
          }

          const newClass = await Classes.create(classData, { transaction });
          await transaction.commit();

          return {
            row: rowIndex,
            class_id: newClass.class_id,
            class_name: newClass.class_name,
            course_id: newClass.course_id,
          };
        } catch (dbError) {
          await transaction.rollback();
          throw dbError;
        }
      } catch (error) {
        return {
          row: rowIndex,
          class_id: row.class_id || "N/A",
          error: error.message || "Lỗi không xác định.",
        };
      }
    });

    const allResults = await Promise.all(importPromises);

    // Phân loại kết quả
    allResults.forEach((result) => {
      if (result.error) {
        results.errors.push(result);
      } else {
        results.success.push(result);
      }
    });

    return results;
  } catch (error) {
    console.error("Lỗi service khi nhập lớp học từ Excel:", error);
    throw new Error("Lỗi khi nhập dữ liệu lớp học từ file Excel.");
  }
};

/**
 * Nhập dữ liệu lớp học từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} classesData - Mảng các đối tượng lớp học.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importClassesFromJsonService = async (classesData) => {
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
          results.errors.push({
            index,
            class_id: classData.class_id || "N/A",
            error: "Mã lớp học là bắt buộc",
          });
          continue;
        }

        // Làm sạch và định dạng dữ liệu
        const cleanedData = {
          class_id: classData.class_id.toString().trim(),
          class_name: classData.class_name
            ? classData.class_name.toString().trim()
            : null,
          class_size: classData.class_size
            ? parseInt(classData.class_size)
            : null,
          status: classData.status
            ? classData.status.toString().trim()
            : "Hoạt động",
          course_id: classData.course_id
            ? classData.course_id.toString().trim()
            : null,
        };

        if (cleanedData.class_name && cleanedData.class_name.length > 50) {
          results.errors.push({
            index,
            class_id: cleanedData.class_id,
            error: "Tên lớp học không được vượt quá 50 ký tự",
          });
          continue;
        }

        // Validate course_id nếu được cung cấp
        if (cleanedData.course_id) {
          const course = await models.Course.findByPk(cleanedData.course_id);
          if (!course) {
            results.errors.push({
              index,
              class_id: cleanedData.class_id,
              error: "Mã khóa học không tồn tại",
            });
            continue;
          }
        }

        if (
          cleanedData.class_size &&
          (isNaN(cleanedData.class_size) || cleanedData.class_size < 0)
        ) {
          results.errors.push({
            index,
            class_id: cleanedData.class_id,
            error: "Sĩ số lớp học không hợp lệ",
          });
          continue;
        }

        // Kiểm tra class_id đã tồn tại chưa
        const existingClass = await models.Classes.findOne({
          where: { class_id: cleanedData.class_id },
        });
        if (existingClass) {
          results.errors.push({
            index,
            class_id: cleanedData.class_id,
            error: "Mã lớp học đã tồn tại",
          });
          continue;
        }

        // Tạo lớp học mới
        const newClass = await models.Classes.create(cleanedData);
        results.success.push(newClass);
      } catch (error) {
        results.errors.push({
          index,
          class_id: classData.class_id || "N/A",
          error: error.message || "Lỗi không xác định",
        });
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
  const requiredColumns = ["Mã lớp học"];
  const optionalColumns = ["Tên lớp học", "Sĩ số", "Trạng thái", "Mã khóa học"];
  const validation = ExcelUtils.validateTemplate(
    fileBuffer,
    requiredColumns,
    optionalColumns
  );

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};
