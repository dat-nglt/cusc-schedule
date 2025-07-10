import { DataTypes } from 'sequelize';

// Định nghĩa model TrainingOfficer - Đại diện cho cán bộ đào tạo
const TrainingOfficer = (sequelize) => {
  const TrainingOfficerModel = sequelize.define(
    'TrainingOfficer',
    {
      // Mã cán bộ (primary key)
      staff_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Họ tên cán bộ
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Email - duy nhất, kiểm tra định dạng
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
      // Số điện thoại
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          isNumeric: true,
        },
      },
      // Phòng ban công tác (VD: Đào tạo, Công tác sinh viên,...)
      department: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Chức vụ (VD: Trưởng phòng, Nhân viên,...)
      position: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // ID Google (nếu đăng nhập qua OAuth)
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
      tableName: 'training_officers', // Tên bảng dạng snake_case
      timestamps: true,               // Tự động tạo created_at và updated_at
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,              // Dùng snake_case cho tên cột
    }
  );

  // Khai báo các mối quan hệ nếu có
  TrainingOfficerModel.associate = (models) => {
    // Ví dụ: Một cán bộ đào tạo có thể quản lý nhiều chương trình hoặc lớp học
    // TrainingOfficerModel.hasMany(models.Program, { foreignKey: 'officer_id' });
    // TrainingOfficerModel.hasMany(models.Class, { foreignKey: 'officer_id' });
  };

  return TrainingOfficerModel;
};

export default TrainingOfficer;
