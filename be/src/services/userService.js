import models from '../models/index.js';
const { Student, Lecturer, Admin, TrainingOfficer } = models;

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
            trainingOfficers
        };
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách người dùng: ' + error.message);
    }
};

/**
 * Tìm kiếm người dùng bằng email trên tất cả các mô hình.
 * @param {string} email - Địa chỉ email của người dùng cần tìm.
 * @returns {Promise<Object|null>} Một đối tượng chứa thông tin người dùng, vai trò và mô hình nếu tìm thấy, ngược lại trả về null.
 */
export const findUserByEmail = async (email) => {
    // Tìm trong Student
    let user = await Student.findOne({ where: { email } });
    if (user) {
        return { user, role: 'student', model: 'Student' };
    }

    // Tìm trong Lecturer
    user = await Lecturer.findOne({ where: { email } });
    if (user) {
        return { user, role: 'lecturer', model: 'Lecturer' };
    }

    // Tìm trong Admin
    user = await Admin.findOne({ where: { email } });
    if (user) {
        return { user, role: 'admin', model: 'Admin' };
    }

    // Tìm trong TrainingOfficer
    user = await TrainingOfficer.findOne({ where: { email } });
    if (user) {
        return { user, role: 'training_officer', model: 'TrainingOfficer' };
    }

    return null;
};

/**
 * Tìm kiếm người dùng bằng google_id trên tất cả các mô hình.
 * @param {string} googleId - Google ID của người dùng cần tìm.
 * @returns {Promise<Object|null>} Một đối tượng chứa thông tin người dùng, vai trò và mô hình nếu tìm thấy, ngược lại trả về null.
 */
export const findUserByGoogleId = async (googleId) => {
    // Tìm trong Student
    let user = await Student.findOne({ where: { google_id: googleId } });
    if (user) {
        return { user, role: 'student', model: 'Student' };
    }

    // Tìm trong Lecturer
    user = await Lecturer.findOne({ where: { google_id: googleId } });
    if (user) {
        return { user, role: 'lecturer', model: 'Lecturer' };
    }

    // Tìm trong Admin
    user = await Admin.findOne({ where: { google_id: googleId } });
    if (user) {
        return { user, role: 'admin', model: 'Admin' };
    }

    // Tìm trong TrainingOfficer
    user = await TrainingOfficer.findOne({ where: { google_id: googleId } });
    if (user) {
        return { user, role: 'training_officer', model: 'TrainingOfficer' };
    }

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
        return { user, role: 'student', model: 'Student' };
    }

    // Tìm trong Lecturer
    user = await Lecturer.findByPk(id);
    if (user) {
        return { user, role: 'lecturer', model: 'Lecturer' };
    }

    // Tìm trong Admin
    user = await Admin.findByPk(id);
    if (user) {
        return { user, role: 'admin', model: 'Admin' };
    }

    // Tìm trong TrainingOfficer
    user = await TrainingOfficer.findByPk(id);
    if (user) {
        return { user, role: 'training_officer', model: 'TrainingOfficer' };
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
export const updateUserGoogleId = async (userInfo, googleId) => {
    const { user, model } = userInfo;

    switch (model) {
        case 'Student':
            return await Student.update({ google_id: googleId }, {
                where: { student_id: user.student_id }
            });
        case 'Lecturer':
            return await Lecturer.update({ google_id: googleId }, {
                where: { lecturer_id: user.lecturer_id }
            });
        case 'Admin':
            return await Admin.update({ google_id: googleId }, {
                where: { admin_id: user.admin_id }
            });
        case 'TrainingOfficer':
            return await TrainingOfficer.update({ google_id: googleId }, {
                where: { staff_id: user.staff_id }
            });
        default:
            throw new Error('Mô hình người dùng không hợp lệ');
    }
};

/**
 * Lấy ID đặc trưng của người dùng dựa trên vai trò của họ.
 * @param {Object} userInfo - Thông tin người dùng bao gồm đối tượng user và tên mô hình.
 * @returns {string} ID của người dùng.
 * @throws {Error} Nếu mô hình người dùng không hợp lệ.
 */
export const getUserId = (userInfo) => {
    const { user, model } = userInfo;

    switch (model) {
        case 'Student':
            return user.student_id;
        case 'Lecturer':
            return user.lecturer_id;
        case 'Admin':
            return user.admin_id;
        case 'TrainingOfficer':
            return user.staff_id;
        default:
            throw new Error('Mô hình người dùng không hợp lệ');
    }
};