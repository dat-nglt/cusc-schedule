import { DataTypes } from 'sequelize';

// Định nghĩa model Lecturer - Đại diện cho giảng viên
const Lecturer = (sequelize) => {
  const LecturerModel = sequelize.define(
    'Lecturer',
    {
      // Mã giảng viên (khóa chính)
      lecturer_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      // Họ tên giảng viên
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Email giảng viên - duy nhất, kiểm tra định dạng
      email: {
        type: DataTypes.STRING(70),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      // Ngày sinh
      day_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Giới tính
      gender: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Địa chỉ thường trú
      address: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Số điện thoại (chỉ số)
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          isNumeric: true,
        },
      },
      // Khoa hoặc bộ môn đang công tác
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Ngày bắt đầu làm việc
      hire_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Học vị (cử nhân, thạc sĩ, tiến sĩ,...)
      degree: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // ID Google dùng cho đăng nhập OAuth (nếu có)
      google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      // Trạng thái tài khoản (active, inactive,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: 'lecturers',          // Tên bảng trong CSDL
      timestamps: true,                // Tự động thêm created_at và updated_at
      createdAt: 'created_at',         // Đặt tên cột createdAt
      updatedAt: 'updated_at',         // Đặt tên cột updatedAt
      deletedAt: "deleted_at", // Thêm cột deleted_at để hỗ trợ soft delete
      paranoid: true, // Bật chế độ soft delete
    }
  );

  // Khai báo mối quan hệ (association)
  LecturerModel.associate = (models) => {
    // Ví dụ: Giảng viên có thể dạy nhiều lớp hoặc môn học
    // LecturerModel.hasMany(models.Class, { foreignKey: 'lecturer_id' });
    // LecturerModel.hasMany(models.Subject, { foreignKey: 'lecturer_id' });
  };

  return LecturerModel;
};

export default Lecturer;
