import models from "../models/index.js";
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
    // ví dụ, thông qua hàm findUserById hoặc một API riêng.
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
  // Chỉ cần tìm kiếm trong bảng Accounts (User dùng chung)
  const account = await Account.findOne({
    where: { google_id: googleId },
    // Có thể include các bảng chi tiết nếu bạn muốn lấy luôn thông tin đầy đủ,
    // nhưng với mục đích xác thực ban đầu thì không cần thiết.
    // Ví dụ: include: [{ model: Student, required: false }, { model: Lecturer, required: false }]
    // Nhưng tốt nhất là chỉ lấy thông tin tài khoản chung ở đây để giữ cho hàm này đơn giản,
    // và lấy thông tin chi tiết qua một API khác sau khi user đã login.
  });

  if (account) {
    // Trả về thông tin từ bảng Accounts
    return {
      id: account.id, // Chuyển instance Sequelize thành plain object
      role: account.role,
    };
  }

  // Nếu không tìm thấy trong bảng Accounts, trả về null
  return null;
};

/**
 * Tìm kiếm người dùng bằng ID trên tất cả các mô hình.
 * @param {string} id - ID của người dùng cần tìm.
 * @returns {Promise<Object|null>} Một đối tượng chứa thông tin người dùng, vai trò và mô hình nếu tìm thấy, ngược lại trả về null.
 */
export const findUserById = async (id) => {
  // Tìm trong Student
  let user = await Student.findByPk(id);
  if (user) {
    return { user, role: "student", model: "Student" };
  }

  // Tìm trong Lecturer
  user = await Lecturer.findByPk(id);
  if (user) {
    return { user, role: "lecturer", model: "Lecturer" };
  }

  // Tìm trong Admin
  user = await Admin.findByPk(id);
  if (user) {
    return { user, role: "admin", model: "Admin" };
  }

  // Tìm trong TrainingOfficer
  user = await TrainingOfficer.findByPk(id);
  if (user) {
    return { user, role: "training_officer", model: "TrainingOfficer" };
  }

  return null;
};

/**
 * Cập nhật Google ID cho một người dùng.
 * @param {Object} userInfo - Thông tin người dùng bao gồm đối tượng user và tên mô hình.
 * @param {string} googleId - Google ID mới cần cập nhật.
 * @returns {Promise<Array>} Kết quả của hoạt động cập nhật từ Sequelize.
 * @throws {Error} Nếu mô hình người dùng không hợp lệ.
 */
export const updateUserGoogleId = async (accountId, googleId) => {
  // Tìm bản ghi Account bằng ID để đảm bảo nó tồn tại
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
