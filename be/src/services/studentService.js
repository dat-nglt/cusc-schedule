import models from "../models/index.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import { Op } from "sequelize";

const { Student, Account, Classes, sequelize } = models;
/**
 * Lấy tất cả Học viên.
 * @returns {Promise<Array>} Danh sách tất cả Học viên.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllStudentsService = async () => {
  try {
    // Lấy dữ liệu sinh viên kèm account + class
    const studentsData = await Student.findAll({
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["id", "email", "role", "status"],
        },
        {
          model: Classes,
          as: "class",
          attributes: ["class_id", "class_name"],
        },
      ],
    });

    // Lấy toàn bộ email từ Account
    const allAccounts = await Account.findAll({
      attributes: ["id", "email", "role", "status"],
    });

    // Làm phẳng dữ liệu student
    const studentsWithExtras = studentsData.map((student) => {
      const plainStudent = student.get({ plain: true });

      return {
        ...plainStudent,
        email: plainStudent.account?.email || null,
        role: plainStudent.account?.role || null,
        status: plainStudent.account?.status || null,
        class_id: plainStudent.class?.class_id || null,
        class_name: plainStudent.class?.class_name || null,
      };
    });

    return {
      students: studentsWithExtras,
      allAccounts, // chứa tất cả email trong bảng Account
    };
  } catch (error) {
    logger.error("Lỗi khi lấy danh sách Học viên:", error);
    throw new Error("Lấy danh sách học viên không thành công");
  }
};

/**
 * Lấy thông tin chi tiết một Học viên theo ID.
 * @param {string} id - ID của Học viên.
 * @returns {Promise<Object>} Thông tin Học viên.
 * @throws {Error} Nếu không tìm thấy Học viên hoặc có lỗi.
 */
export const getStudentByIdService = async (id) => {
  try {
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Account,
          as: "account", // Giả sử có quan hệ với Account
          attributes: ["id", "email", "role", "status"], // Chỉ lấy các trường cần thiết từ Account
        },
        {
          model: Classes,
          as: "class", // Giả sử có quan hệ với Class
          attributes: ["class_id", "class_name"], // Chỉ lấy các trường cần thiết từ Class
        },
      ],
    });
    if (!student) {
      throw new Error(`Không tìm thấy Học viên với ID ${id}`);
    }
    return student;
  } catch (error) {
    console.error(`Lỗi khi lấy Học viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Tạo một Học viên mới.
 * @param {Object} studentData - Dữ liệu của Học viên mới.
 * @returns {Promise<Object>} Học viên đã được tạo.
 * @throws {Error} Nếu có lỗi khi tạo Học viên.
 */
export const createStudentService = async (studentData) => {
  const transaction = await sequelize.transaction();
  try {
    const [existingStudent, existingAccount] = await Promise.all([
      Student.findByPk(studentData.student_id),
      Account.findOne({ where: { email: studentData.email } }),
    ]);

    if (existingStudent) {
      throw new Error(`Mã học viên ${studentData.student_id} đã tồn tại`);
    }
    if (existingAccount) {
      throw new Error("Email đã tồn tại");
    }

    // 2. Tạo tài khoản
    const account = await Account.create(
      {
        email: studentData.email,
        role: "student",
        status: "active",
        password: "student_default_password", // Nên thêm một mật khẩu mặc định an toàn
      },
      { transaction }
    );

    const student = await Student.create(
      {
        student_id: studentData.student_id,
        account_id: account.id,
        name: studentData.name,
        gender: studentData.gender,
        address: studentData.address,
        day_of_birth: studentData.day_of_birth,
        phone_number: studentData.phone_number,
        class_id: studentData.class_id,
        admission_year: studentData.admission_year,
        gpa: studentData.gpa,
        status: studentData.status || "Đang học",
      },
      { transaction }
    );

    await transaction.commit();

    const result = await Student.findByPk(student.student_id, {
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["email", "role", "status"],
        },
      ],
    });
    return result;
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    throw new Error("Không thể tạo học viên: " + error.message);
  }
};

/**
 * Cập nhật thông tin một Học viên theo ID.
 * @param {string} id - ID của Học viên cần cập nhật.
 * @param {Object} studentData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} Học viên đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy Học viên hoặc có lỗi.
 */
export const updateStudentService = async (id, studentData) => {
  const transaction = await sequelize.transaction();
  try {
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Account,
          as: "account", // Giả sử có quan hệ với Account
        },
      ],
    });
    if (!student) {
      throw new Error(`Không tìm thấy Học viên với ID ${id}`);
    }
    // Kiểm tra xem email đã tồn tại chưa (nếu có)
    if (studentData.email && studentData.email !== student.account.email) {
      const existingAccount = await Account.findOne({
        where: {
          email: studentData.email,
          id: { [Op.ne]: student.account.id }, // Tránh trùng với tài khoản hiện tại
        },
      });
      if (existingAccount) {
        throw new Error("Email đã tồn tại");
      }
    }
    await student.account.update(
      {
        email: studentData.email,
      },
      { transaction }
    );

    // Cập nhật thông tin Học viên
    const updateData = {};
    if (studentData.name) updateData.name = studentData.name;
    if (studentData.day_of_birth !== undefined)
      updateData.day_of_birth = studentData.day_of_birth;
    if (studentData.gender !== undefined)
      updateData.gender = studentData.gender; // Fixed: use studentData.gender instead of student.gender
    if (studentData.address !== undefined)
      updateData.address = studentData.address;
    if (studentData.phone_number !== undefined)
      updateData.phone_number = studentData.phone_number;
    if (studentData.class_id !== undefined || studentData.class !== undefined)
      updateData.class_id = studentData.class_id || studentData.class; // Use class_id
    if (studentData.admission_year !== undefined)
      updateData.admission_year = studentData.admission_year;
    if (studentData.gpa !== undefined) updateData.gpa = studentData.gpa;
    if (studentData.status !== undefined)
      updateData.status = studentData.status;

    await student.update(updateData, { transaction });
    await transaction.commit();

    return await Student.findByPk(id, {
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["email", "role", "status"],
        },
      ],
    });
  } catch (error) {
    if (!transaction.finished) {
      // Kiểm tra xem transaction đã hoàn thành chưa
      await transaction.rollback(); // Rollback transaction nếu có lỗi
    }
    console.error(`Lỗi khi cập nhật Học viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa một Học viên theo ID.
 * @param {string} id - ID của Học viên cần xóa.
 * @returns {Promise<Object>} Thông báo xóa thành công.
 * @throws {Error} Nếu không tìm thấy Học viên hoặc có lỗi.
 */
export const deleteStudentService = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    // 1. Tìm học viên và tài khoản liên kết
    const student = await Student.findByPk(id, {
      include: [{ model: Account, as: "account" }],
      transaction,
    });

    // 2. Nếu không tìm thấy, trả về false
    if (!student) {
      return false;
    }

    const accountId = student.account.id;

    // 3. Xóa học viên và tài khoản trong cùng một transaction
    // Sử dụng tùy chọn cascade delete của Sequelize là một lựa chọn tốt hơn,
    // nhưng nếu không có, cách này vẫn đảm bảo.
    await student.destroy({ transaction });
    await student.account.destroy({ transaction });

    await transaction.commit();

    return true;
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    throw new Error(`Không thể xóa học viên với ID ${id}: ${error.message}`);
  }
};

/**
 * Nhập dữ liệu Học viên từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} studentsData - Mảng các đối tượng Học viên.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importStudentsFromJSONService = async (studentsData) => {
  try {
    if (!studentsData || !Array.isArray(studentsData)) {
      throw new Error("Dữ liệu học viên không hợp lệ");
    }

    const results = {
      success: [],
      errors: [],
      total: studentsData.length,
    };

    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];
      const index = i + 1;

      try {
        // Validate required fields
        if (
          !studentData.student_id ||
          !studentData.name ||
          !studentData.email
        ) {
          results.errors.push({
            index: index,
            student_id: studentData.student_id || "N/A",
            error: "Mã học viên, Tên và Email là bắt buộc",
          });
          continue;
        }

        // Clean và format data
        const cleanedData = {
          student_id: studentData.student_id.toString().trim(),
          name: studentData.name.toString().trim(),
          email: studentData.email ? studentData.email.toString().trim() : null,
          gender: studentData.gender
            ? studentData.gender.toString().trim()
            : null,
          address: studentData.address
            ? studentData.address.toString().trim()
            : null,
          day_of_birth: studentData.day_of_birth || null,
          phone_number: studentData.phone_number
            ? studentData.phone_number.toString().trim()
            : null,
          class_id: studentData.class_id
            ? studentData.class_id.toString().trim()
            : null,
          admission_year: studentData.admission_year || null,
          gpa:
            studentData.gpa !== undefined ? parseFloat(studentData.gpa) : null,
          status: studentData.status || "Đang học",
        };

        // Validate GPA nếu có
        if (
          cleanedData.gpa !== null &&
          (isNaN(cleanedData.gpa) || cleanedData.gpa < 0 || cleanedData.gpa > 4)
        ) {
          results.errors.push({
            index: index,
            student_id: cleanedData.student_id,
            error: "Điểm trung bình (GPA) phải là số từ 0 đến 4",
          });
          continue;
        }

        // Validate email format nếu có
        if (cleanedData.email && !ExcelUtils.isValidEmail(cleanedData.email)) {
          results.errors.push({
            index: index,
            student_id: cleanedData.student_id,
            error: "Email không đúng định dạng",
          });
          continue;
        }

        // Kiểm tra student_id đã tồn tại chưa
        const existingStudentById = await Student.findOne({
          where: { student_id: cleanedData.student_id },
        });
        if (existingStudentById) {
          results.errors.push({
            index: index,
            student_id: cleanedData.student_id,
            error: "Mã học viên đã tồn tại",
          });
          continue;
        }

        // Kiểm tra email đã tồn tại chưa (nếu có)
        if (cleanedData.email) {
          const existingStudentByEmail = await Account.findOne({
            where: { email: cleanedData.email },
          });
          if (existingStudentByEmail) {
            results.errors.push({
              index: index,
              student_id: cleanedData.student_id,
              error: "Email đã tồn tại",
            });
            continue;
          }
        }

        // Tạo student mới
        const newStudent = await createStudentService(cleanedData);
        results.success.push(newStudent);
      } catch (error) {
        results.errors.push({
          index: index,
          student_id: studentData.student_id || "N/A",
          error: error.message || "Lỗi không xác định",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập học viên từ JSON:", error);
    throw error;
  }
};
