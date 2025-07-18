import models from "../models/index.js";
import Lecturer from "../models/Lecturer.js";
import ExcelUtils from "../utils/ExcelUtils.js";
import { Op } from 'sequelize';

const { Student, Account, sequelize } = models;
/**
 * Lấy tất cả Học viên.
 * @returns {Promise<Array>} Danh sách tất cả Học viên.
 * @throws {Error} Nếu có lỗi khi lấy dữ liệu.
 */
export const getAllStudents = async () => {
  try {
    const students = await Student.findAll({
      include: [{
        model: Account,
        as: 'account', // Giả sử có quan hệ với Account
        attributes: ['id', 'email', 'role', 'status'] // Chỉ lấy các trường cần thiết từ Account
      }]
    });
    return students;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Học viên:", error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết một Học viên theo ID.
 * @param {string} id - ID của Học viên.
 * @returns {Promise<Object>} Thông tin Học viên.
 * @throws {Error} Nếu không tìm thấy Học viên hoặc có lỗi.
 */
export const getStudentById = async (id) => {
  try {
    const student = await Student.findByPk(id, {
      include: [{
        model: Account,
        as: 'account', // Giả sử có quan hệ với Account
        attributes: ['id', 'email', 'role', 'status'] // Chỉ lấy các trường cần thiết từ Account
      }]
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
export const createStudent = async (studentData) => {
  const transaction = await sequelize.transaction();
  try {
    // Kiểm tra xem student_id đã tồn tại chưa
    const existingStudent = await Student.findByPk(studentData.student_id);
    if (existingStudent) {
      throw new Error(`Mã học viên ${studentData.student_id} đã tồn tại`);
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingAccount = await Account.findOne({
      where: { email: studentData.email }
    });
    if (existingAccount) {
      throw new Error('Email đã tồn tại');
    }
    // Tạo tài khoản trước
    const account = await Account.create({
      email: studentData.email,
      role: 'student',
      status: 'active'
    }, { transaction });

    // Tạo Học viên với account_id
    const student = await Student.create({
      student_id: studentData.student_id,
      account_id: account.id, // Giả sử có trường account_id trong Student
      name: studentData.name,
      gender: studentData.gender || null,
      address: studentData.address || null,
      day_of_birth: studentData.day_of_birth || null,
      phone_number: studentData.phone_number || null,
      class: studentData.class || null,
      admission_year: studentData.admission_year || null,
      gpa: studentData.gpa || null,
      status: studentData.status || 'Đang học'
    }, { transaction });
    await transaction.commit();

    // trả về Học viên kèm theo thông tin tài khoản
    const result = await Student.findByPk(student.student_id, {
      include: [
        {
          model: Account,
          as: 'account',
          attributes: ['email', 'role', 'status']
        }
      ]
    });
    return result;

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Lỗi khi tạo Học viên:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một Học viên theo ID.
 * @param {string} id - ID của Học viên cần cập nhật.
 * @param {Object} studentData - Dữ liệu cập nhật.
 * @returns {Promise<Object>} Học viên đã được cập nhật.
 * @throws {Error} Nếu không tìm thấy Học viên hoặc có lỗi.
 */
export const updateStudent = async (id, studentData) => {
  const transaction = await sequelize.transaction();
  try {
    const student = await Student.findByPk(id, {
      include: [{
        model: Account,
        as: 'account', // Giả sử có quan hệ với Account
      }]
    }
    );
    if (!student) {
      throw new Error(`Không tìm thấy Học viên với ID ${id}`);
    }
    // Kiểm tra xem email đã tồn tại chưa (nếu có)
    if (studentData.email && studentData.email !== student.account.email) {
      const existingAccount = await Account.findOne({
        where: {
          email: studentData.email,
          id: { [Op.ne]: student.account.id } // Tránh trùng với tài khoản hiện tại
        }
      });
      if (existingAccount) {
        throw new Error('Email đã tồn tại');
      }
    }
    await student.account.update({
      email: studentData.email
    }, { transaction });

    // Cập nhật thông tin Học viên
    const updateData = {};
    if (studentData.name) updateData.name = studentData.name;
    if (studentData.day_of_birth !== undefined) updateData.day_of_birth = studentData.day_of_birth;
    if (studentData.gender !== undefined) updateData.gender = student.gender;
    if (studentData.address !== undefined) updateData.address = studentData.address;
    if (studentData.phone_number !== undefined) updateData.phone_number = studentData.phone_number;
    if (studentData.class !== undefined) updateData.class = studentData.class;
    if (studentData.admission_year !== undefined) updateData.admission_year = studentData.admission_year;
    if (studentData.gpa !== undefined) updateData.gpa = studentData.gpa;
    if (studentData.status !== undefined) updateData.status = studentData.status;

    await student.update(updateData, { transaction });
    await transaction.commit();

    return await Student.findByPk(id, {
      include: [{
        model: Account,
        as: 'account',
        attributes: ['email', 'role', 'status']
      }]
    });

  } catch (error) {
    if (!transaction.finished) { // Kiểm tra xem transaction đã hoàn thành chưa
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
export const deleteStudent = async (id) => {
  const transaction = await models.sequelize.transaction();
  try {
    const student = await Student.findByPk(id, {
      include: [{
        model: Account,
        as: 'account'
      }]
    });
    if (!student) {
      throw new Error(`Không tìm thấy Học viên với ID ${id}`);
    }
    // Xóa tài khoản liên kết với Học viên
    const accountId = student.account.id;

    //xóa account liên kết với Học viên
    await Account.destroy({
      where: { id: accountId },
      transaction
    });
    await transaction.commit();

    return { message: "Học viên đã được xóa thành công" };
  } catch (error) {
    if (!transaction.finished) { // Kiểm tra xem transaction đã hoàn thành chưa
      await transaction.rollback(); // Rollback transaction nếu có lỗi
    }
    console.error(`Lỗi khi xóa Học viên với ID ${id}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu Học viên từ JSON (dùng cho tính năng xem trước).
 * @param {Array<Object>} studentsData - Mảng các đối tượng Học viên.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu dữ liệu JSON không hợp lệ hoặc lỗi trong quá trình nhập.
 */
export const importStudentsFromJSON = async (studentsData) => {
  try {
    if (!studentsData || !Array.isArray(studentsData)) {
      throw new Error("Dữ liệu Học viên không hợp lệ"); // Changed "giảng viên" to "Học viên"
    }

    const results = {
      success: [],
      errors: [],
      total: studentsData.length
    };

    // Validate và tạo Học viên cho từng item
    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];
      const index = i + 1;

      try {
        // Validate required fields
        if (!studentData.student_id) {
          results.errors.push({
            index: index,
            student_id: studentData.student_id || 'N/A',
            error: 'Mã học viên là bắt buộc'
          });
          continue;
        }
        if (!studentData.name) { // Added name as a required field
          results.errors.push({
            index: index,
            student_id: studentData.student_id || 'N/A',
            error: 'Tên học viên là bắt buộc'
          });
          continue;
        }
        if (!studentData.email) {
          results.errors.push({
            index: index,
            student_id: studentData.student_id || 'N/A',
            error: 'Email là bắt buộc'
          });
          continue;
        }


        // Clean and format data (chuyển sang kiểu chuỗi và xóa khoảng cách thừa ở đầu chuỗi và cuối chuỗi)
        const cleanedData = {
          student_id: studentData.student_id.toString().trim(),
          name: studentData.name.toString().trim(),
          email: studentData.email.toString().trim(),
          day_of_birth: studentData.day_of_birth || null,
          gender: studentData.gender ? studentData.gender.toString().trim() : null,
          address: studentData.address ? studentData.address.toString().trim() : null,
          phone_number: studentData.phone_number ? studentData.phone_number.toString().trim() : null,
          class: studentData.class ? studentData.class.toString().trim() : null,
          admission_year: studentData.admission_year || null,
          gpa: studentData.gpa ? parseFloat(studentData.gpa) : null,
          status: studentData.status || 'Đang học'
        };

        // Validate email format nếu có
        if (cleanedData.email && !ExcelUtils.isValidEmail(cleanedData.email)) {
          results.errors.push({
            index: index,
            student_id: cleanedData.student_id,
            error: 'Email không đúng định dạng'
          });
          continue;
        }

        // Validate GPA if provided
        if (cleanedData.gpa !== null && (isNaN(cleanedData.gpa) || cleanedData.gpa < 0 || cleanedData.gpa > 4)) { // Assuming GPA is on a 4.0 scale
          results.errors.push({
            index: index,
            student_id: cleanedData.student_id,
            error: 'Điểm trung bình (GPA) phải là số từ 0 đến 4'
          });
          continue;
        }


        // Kiểm tra student_id đã tồn tại chưa
        const existingStudentById = await Student.findOne({
          where: { student_id: cleanedData.student_id }
        });
        if (existingStudentById) {
          results.errors.push({
            index: index,
            student_id: cleanedData.student_id,
            error: 'Mã học viên đã tồn tại'
          });
          continue;
        }

        // Kiểm tra email đã tồn tại chưa (nếu có)
        if (cleanedData.email) {
          const existingEmail = await Account.findOne({
            where: { email: cleanedData.email }
          });
          if (existingEmail) {
            results.errors.push({
              index: index,
              student_id: cleanedData.student_id,
              error: 'Email đã tồn tại'
            });
            continue;
          }
        }

        // Tạo Student mới
        const newStudent = await createStudent(cleanedData);
        results.success.push(newStudent);

      } catch (error) {
        results.errors.push({
          index: index,
          student_id: studentData.student_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }
    return results;
  } catch (error) {
    console.error("Lỗi khi nhập Học viên từ JSON:", error);
    throw error;
  }
};


/**
 * Liệt kê các Học viên với các bộ lọc tùy chọn.
 * @param {Object} filters - Các tiêu chí lọc.
 * @param {string} [filters.student_id] - Lọc theo ID Học viên (tìm kiếm gần đúng).
 * @param {string} [filters.name] - Lọc theo tên Học viên (tìm kiếm gần đúng).
 * @param {string} [filters.email] - Lọc theo email (tìm kiếm gần đúng).
 * @param {string} [filters.gender] - Lọc theo giới tính.
 * @param {string} [filters.class] - Lọc theo lớp.
 * @param {number} [filters.admission_year] - Lọc theo năm nhập học.
 * @param {string} [filters.status] - Lọc theo trạng thái.
 * @returns {Promise<Array>} Danh sách các Học viên phù hợp với bộ lọc.
 * @throws {Error} Nếu có lỗi khi liệt kê dữ liệu.
 */
export const listStudents = async (filters) => {
  try {
    const whereClause = {};

    if (filters.student_id) {
      whereClause.student_id = {
        [Op.iLike]: `%${filters.student_id}%`
      };
    }
    if (filters.name) {
      whereClause.name = {
        [Op.iLike]: `%${filters.name}%`
      };
    }
    if (filters.email) {
      whereClause.email = {
        [Op.iLike]: `%${filters.email}%`
      };
    }
    if (filters.gender) {
      whereClause.gender = {
        [Op.iLike]: `%${filters.gender}%`
      };
    }
    if (filters.class) {
      whereClause.class = {
        [Op.iLike]: `%${filters.class}%`
      };
    }
    if (filters.admission_year) {
      whereClause.admission_year = filters.admission_year;
    }
    if (filters.status) {
      whereClause.status = {
        [Op.iLike]: `%${filters.status}%`
      };
    }

    const students = await Student.findAll({
      where: whereClause,
      attributes: ['student_id', 'name', 'email', 'day_of_birth', 'gender', 'address', 'phone_number', 'class', 'admission_year', 'gpa', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return students;
  } catch (error) {
    throw new Error('Lỗi khi liệt kê Học viên: ' + error.message);
  }
};

/**
 * Nhập dữ liệu Học viên từ file Excel.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Promise<Object>} Kết quả nhập khẩu bao gồm danh sách thành công và lỗi.
 * @throws {Error} Nếu file Excel không có dữ liệu hoặc định dạng không đúng, hoặc lỗi trong quá trình nhập.
 */
export const importStudentsFromExcel = async (fileBuffer) => {
  try {
    // Đọc file Excel từ buffer
    const rawData = ExcelUtils.readExcelToJSON(fileBuffer);

    if (!rawData || rawData.length === 0) {
      throw new Error("File Excel không có dữ liệu hoặc định dạng không đúng");
    }

    // Chuyển đổi tên cột tiếng Việt sang tiếng Anh (giả định ExcelUtils có hàm này)
    const studentsData = ExcelUtils.convertVietnameseColumnsToEnglish(rawData);

    const results = {
      success: [],
      errors: [],
      total: studentsData.length
    };

    // Validate và tạo Học viên cho từng hàng
    for (let i = 0; i < studentsData.length; i++) {
      const row = studentsData[i];
      const rowIndex = i + 2; // Bắt đầu từ hàng 2 (sau tiêu đề)

      try {
        // Validate các trường bắt buộc
        if (!row.student_id || !row.name || !row.email) {
          results.errors.push({
            row: rowIndex,
            student_id: row.student_id || 'N/A',
            error: 'Mã học viên, Tên và Email là bắt buộc'
          });
          continue;
        }

        // Định dạng dữ liệu theo cấu trúc database
        const studentData = {
          student_id: ExcelUtils.cleanString(row.student_id),
          name: ExcelUtils.cleanString(row.name),
          email: ExcelUtils.cleanString(row.email),
          day_of_birth: row.day_of_birth ? ExcelUtils.formatExcelDate(row.day_of_birth) : null,
          gender: ExcelUtils.cleanString(row.gender) || null,
          address: ExcelUtils.cleanString(row.address) || null,
          phone_number: ExcelUtils.cleanString(row.phone_number) || null,
          class: ExcelUtils.cleanString(row.class) || null,
          admission_year: row.admission_year || null,
          gpa: row.gpa ? parseFloat(row.gpa) : null,
          status: ExcelUtils.cleanString(row.status) || 'Đang học',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Validate email format
        if (!ExcelUtils.isValidEmail(studentData.email)) {
          results.errors.push({
            row: rowIndex,
            student_id: studentData.student_id,
            error: 'Email không đúng định dạng'
          });
          continue;
        }

        // Validate GPA
        if (studentData.gpa !== null && (isNaN(studentData.gpa) || studentData.gpa < 0 || studentData.gpa > 4)) {
          results.errors.push({
            row: rowIndex,
            student_id: studentData.student_id,
            error: 'Điểm trung bình (GPA) phải là số từ 0 đến 4'
          });
          continue;
        }


        // Kiểm tra student_id đã tồn tại chưa
        const existingStudentById = await Student.findByPk(studentData.student_id);
        if (existingStudentById) {
          results.errors.push({
            row: rowIndex,
            student_id: studentData.student_id,
            error: 'Mã học viên đã tồn tại'
          });
          continue;
        }

        // Kiểm tra email đã tồn tại chưa
        const existingStudentByEmail = await Student.findOne({ where: { email: studentData.email } });
        if (existingStudentByEmail) {
          results.errors.push({
            row: rowIndex,
            student_id: studentData.student_id,
            error: 'Email đã tồn tại'
          });
          continue;
        }

        // Tạo Student mới
        const newStudent = await Student.create(studentData);
        results.success.push({
          row: rowIndex,
          student_id: newStudent.student_id,
          name: newStudent.name,
        });

      } catch (error) {
        results.errors.push({
          row: rowIndex,
          student_id: row.student_id || 'N/A',
          error: error.message || 'Lỗi không xác định'
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Lỗi khi nhập Học viên từ Excel:", error);
    throw error;
  }
};

/**
 * Validate cấu trúc template Excel cho Học viên.
 * @param {Buffer} fileBuffer - Buffer của file Excel.
 * @returns {Object} Kết quả validation bao gồm valid (boolean) và error (string, nếu có).
 * @throws {Error} Nếu template không hợp lệ.
 */
export const validateExcelTemplate = (fileBuffer) => {
  const requiredColumns = ['Mã học viên', 'Tên học viên', 'Email'];
  const optionalColumns = ['Ngày sinh', 'Giới tính', 'Địa chỉ', 'Số điện thoại', 'Lớp', 'Năm nhập học', 'Điểm trung bình (GPA)', 'Trạng thái'];
  const validation = ExcelUtils.validateTemplate(fileBuffer, requiredColumns, optionalColumns);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation;
};