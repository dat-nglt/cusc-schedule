import models from "../models/index.js";
import logger from "../utils/logger.js";
const { Student, Lecturer, Admin, TrainingOfficer, Account } = models;

/**
 * Lấy tất cả người dùng từ các mô hình Student, Lecturer, Admin, và TrainingOfficer.
 * @returns {Promise<Object>} Một đối tượng chứa danh sách sinh viên, giảng viên, quản trị viên và cán bộ đào tạo.
 * @throws {Error} Nếu có lỗi trong quá trình lấy dữ liệu người dùng.
 */
export const getAllUsers = async () => {
  try {
    const students = await Student.findAll();
    const lecturers = await Lecturer.findAll();
    const admins = await Admin.findAll();
    const trainingOfficers = await TrainingOfficer.findAll();

    return {
      students,
      lecturers,
      admins,
      trainingOfficers,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách người dùng: " + error.message);
  }
};

/**
 * Tìm kiếm người dùng bằng email trên tất cả các mô hình.
 * @param {string} email - Địa chỉ email của người dùng cần tìm.
 * @returns {Promise<Object|null>} Một đối tượng chứa thông tin người dùng, vai trò và mô hình nếu tìm thấy, ngược lại trả về null.
 */
export const findUserByEmail = async (email) => {
  // Chỉ cần tìm kiếm trong bảng Accounts (User dùng chung)
  // Email là trường UNIQUE trong bảng Accounts, nên findOne là hiệu quả nhất
  const account = await Account.findOne({
    where: { email },
    // Không cần include các bảng chi tiết ở đây cho mục đích tìm kiếm ban đầu.
    // Thông tin chi tiết có thể được lấy sau khi xác thực và người dùng đã đăng nhập,
    // ví dụ, thông qua hàm findExistsUserByID hoặc một API riêng.
  });

  if (account) {
    // Trả về thông tin từ bản ghi Account
    return {
      id: account.id, // Chuyển instance Sequelize thành plain object
      googleId: account.google_id || null, // Lấy google_id nếu có
      role: account.role, // Lấy vai trò trực tiếp từ bản ghi Account
    };
  }

  // Nếu không tìm thấy Account nào với email này, trả về null
  return null;
};

/**
 * Tìm kiếm người dùng bằng google_id trên tất cả các mô hình.
 * @param {string} googleId - Google ID của người dùng cần tìm.
 * @returns {Promise<Object|null>} Một đối tượng chứa thông tin người dùng, vai trò và mô hình nếu tìm thấy, ngược lại trả về null.
 */
export const findUserByGoogleId = async (googleId) => {
  const account = await Account.findOne({
    where: { google_id: googleId },
  });

  if (account) {
    return {
      id: account.id, // Chuyển instance Sequelize thành plain object
      role: account.role,
    };
  }

  return null;
};

/**
 * Tìm kiếm người dùng bằng ID trên tất cả các mô hình.
 * @param {string} id - ID của người dùng cần tìm.
 * @returns {Promise<Object|null>} Một đối tượng chứa thông tin người dùng, vai trò và mô hình nếu tìm thấy, ngược lại trả về null.
 */
export const findExistsUserByIdService = async (id) => {
  try {
    const account = await Account.findByPk(id, {
      attributes: ['id', 'role', 'email']
    });

    if (!account) return null;

    switch (account.role) {
      case 'student': {
        const student = await Student.findOne({
          where: { account_id: id },
          attributes: [
            'student_id', 'name', 'day_of_birth', 'address',
            'phone_number', 'gender', 'class_id'
          ]
        });

        return student ? {
          id: account.id,
          role: account.role,
          email: account.email,
          code: student.student_id,
          name: student.name,
          day_of_birth: student.day_of_birth,
          address: student.address,
          phone_number: student.phone_number,
          gender: student.gender,
          class: student.class_id
        } : {
          id: account.id,
          role: account.role,
          email: account.email
        };
      }

      case 'lecturer': {
        const lecturer = await Lecturer.findOne({
          where: { account_id: id },
          attributes: [
            'lecturer_id', 'name', 'day_of_birth', 'address', 'gender',
            'phone_number', 'department', 'status'
          ]
        });

        return lecturer ? {
          id: account.id,
          role: account.role,
          email: account.email,
          code: lecturer.lecturer_id,
          name: lecturer.name,
          day_of_birth: lecturer.day_of_birth,
          address: lecturer.address,
          gender: lecturer.gender,
          phone_number: lecturer.phone_number,
          department: lecturer.department,
          status: lecturer.status
        } : {
          id: account.id,
          role: account.role,
          email: account.email
        };
      }

      case 'training_officer': {
        const officer = await TrainingOfficer.findOne({
          where: { account_id: id },
          attributes: ['training_officer_id']
        });

        return {
          id: account.id,
          role: account.role,
          email: account.email,
          code: officer ? officer.training_officer_id : null
        };
      }

      default:
        return {
          id: account.id,
          role: account.role,
          email: account.email
        };
    }

  } catch (error) {
    console.error("Lỗi khi tìm người dùng:", error);
    throw new Error("Không thể tìm kiếm thông tin người dùng.");
  }
};

export const getAllEmailsService = async () => {
  try {
    const accounts = await Account.findAll({
      attributes: ['email'],
      paranoid: false // Lấy cả bản ghi đã xóa mềm
    });

    return accounts.map(acc => acc.email);
  } catch (error) {
    logger.error("Lỗi khi lấy danh sách email người dùng:", error);
    throw new Error("Không thể lấy danh sách email người dùng.");
  }
};



/**
 * Cập nhật Google ID cho một người dùng.
 * @param {Object} userInfo - Thông tin người dùng bao gồm đối tượng user và tên mô hình.
 * @param {string} googleId - Google ID mới cần cập nhật.
 * @returns {Promise<Array>} Kết quả của hoạt động cập nhật từ Sequelize.
 * @throws {Error} Nếu mô hình người dùng không hợp lệ.
 */
export const updateUserGoogleId = async (accountId, googleId) => {
  const account = await Account.findByPk(accountId);

  if (!account) {
    throw new Error(
      `Không tìm thấy Account với ID: ${accountId} để cập nhật Google ID.`
    );
  }

  // Cập nhật trường google_id cho bản ghi Account đó
  const [rowsAffected, updatedAccount] = await Account.update(
    { google_id: googleId }, // Giá trị mới cho google_id
    {
      where: { id: accountId }, // Điều kiện tìm kiếm: theo ID của Account
      returning: true, // Trả về bản ghi đã cập nhật (nếu được hỗ trợ bởi DB và Sequelize)
    }
  );

  if (rowsAffected === 0) {
    // Trường hợp này hiếm khi xảy ra nếu findByPk đã thành công,
    // nhưng là một kiểm tra an toàn.
    throw new Error(
      `Không thể cập nhật Google ID cho Account ID: ${accountId}.`
    );
  }

  // `updatedAccount[0]` sẽ chứa bản ghi đã được cập nhật nếu `returning: true`
  return updatedAccount[0]; // Trả về đối tượng Account đã cập nhật
};
