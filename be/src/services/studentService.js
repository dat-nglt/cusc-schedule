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
    const students = await Student.findAll({
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
    return students;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Học viên:", error);
    throw new Error(`Lấy danh sách giảng viên không thành công`);
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
  const results = {
    success: [],
    errors: [],
  };

  // Sử dụng Promise.all để xử lý song song, cải thiện hiệu suất
  const importPromises = studentsData.map(async (studentData, index) => {
    const recordIndex = index + 1;

    // 1. Validate dữ liệu
    if (!studentData.student_id) {
      return {
        isError: true,
        record: { student_id: studentData.student_id || "N/A" },
        error: "Mã học viên là bắt buộc",
      };
    }
    if (!studentData.name) {
      return {
        isError: true,
        record: { student_id: studentData.student_id },
        error: "Tên học viên là bắt buộc",
      };
    }
    if (!studentData.email) {
      return {
        isError: true,
        record: { student_id: studentData.student_id },
        error: "Email là bắt buộc",
      };
    }
    if (!isValidEmail(studentData.email)) {
      return {
        isError: true,
        record: { student_id: studentData.student_id },
        error: "Email không đúng định dạng",
      };
    }
    if (
      studentData.gpa &&
      (isNaN(parseFloat(studentData.gpa)) ||
        parseFloat(studentData.gpa) < 0 ||
        parseFloat(studentData.gpa) > 4)
    ) {
      return {
        isError: true,
        record: { student_id: studentData.student_id },
        error: "Điểm trung bình (GPA) phải là số từ 0 đến 4",
      };
    }

    const transaction = await sequelize.transaction();
    try {
      // 2. Kiểm tra dữ liệu đã tồn tại
      const [existingStudentById, existingEmail] = await Promise.all([
        Student.findOne({
          where: { student_id: studentData.student_id },
          transaction,
        }),
        Account.findOne({ where: { email: studentData.email }, transaction }),
      ]);

      if (existingStudentById) {
        throw new Error("Mã học viên đã tồn tại");
      }
      if (existingEmail) {
        throw new Error("Email đã tồn tại");
      }

      // 3. Tạo học viên mới
      const newStudent = await createStudentService(studentData, {
        transaction,
      });
      await transaction.commit();

      return { isError: false, record: newStudent };
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return {
        isError: true,
        record: { student_id: studentData.student_id },
        error: error.message || "Lỗi không xác định",
      };
    }
  });

  const allResults = await Promise.all(importPromises);

  // Phân loại kết quả
  allResults.forEach((result) => {
    if (result.isError) {
      results.errors.push(result.record);
    } else {
      results.success.push(result.record);
    }
  });

  return results;
};
