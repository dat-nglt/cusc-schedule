import {Student, Lecturer, Admin, TrainingOfficer} from '../models/User.js';

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
        throw new Error('Error fetching users: ' + error.message);
    }
};

// Service để tìm kiếm user từ tất cả các model
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

// Service để tìm kiếm user bằng google_id
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

// Service để tìm kiếm user bằng ID
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

// Service để cập nhật google_id cho user
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
            throw new Error('Invalid user model');
    }
};

// Service để lấy ID của user
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
            throw new Error('Invalid user model');
    }
};