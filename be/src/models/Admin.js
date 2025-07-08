import { DataTypes } from 'sequelize';

// Định nghĩa model Admin
const Admin = (sequelize) => {
  const AdminModel = sequelize.define(
    'Admin',
    {
      // Khoá chính - ID của admin
      admin_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên của admin
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Email - duy nhất, kiểm tra định dạng email
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
      // Địa chỉ
      address: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Số điện thoại - chỉ cho phép ký tự số
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          isNumeric: true,
        },
      },
      // ID Google dùng cho đăng nhập OAuth
      google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      // Trạng thái của admin (ví dụ: hoạt động, đã khóa, ...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      // Cấu hình bảng
      tableName: 'admins',           // Tên bảng trong CSDL
      timestamps: true,              // Tự động tạo trường createdAt và updatedAt
      createdAt: 'created_at',       // Đổi tên trường createdAt
      updatedAt: 'updated_at',       // Đổi tên trường updatedAt
      underscored: true,             // Dùng định dạng snake_case cho tên cột
    }
  );

  // Khai báo các mối quan hệ (association) nếu có
  AdminModel.associate = (models) => {
    // Ví dụ: AdminModel.hasMany(models.BlogPost, { foreignKey: 'admin_id' });
  };

  return AdminModel;
};

export default Admin;
