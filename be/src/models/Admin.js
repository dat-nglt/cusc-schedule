import { DataTypes } from 'sequelize';

// Định nghĩa model Admin
const Admin = (sequelize) => {
  const AdminModel = sequelize.define(
    'Admin', // Tên model
    {
      // Khóa ngoại user_id liên kết với bảng Accounts
      account_id: {
        type: DataTypes.UUID, // Phải khớp với kiểu của 'id' trong bảng 'accounts'
        allowNull: false,
        unique: true, // Đảm bảo mối quan hệ 1-1: Một Account chỉ có thể là một Admin
        references: {
          model: 'accounts', // Tên bảng đích (Accounts)
          key: 'id',         // Tên cột khóa chính của bảng đích
        },
        onUpdate: 'CASCADE', // Hành động khi ID trong Accounts thay đổi
        onDelete: 'CASCADE', // Hành động khi Account bị xóa
      },
      // Khoá chính - ID của admin (có thể là mã số riêng của admin trong hệ thống nghiệp vụ)
      admin_id: {
        type: DataTypes.STRING(30),
        primaryKey: true, // Giữ lại primary key riêng nếu có ý nghĩa nghiệp vụ
        allowNull: false,
      },
      // Tên của admin (Họ tên đầy đủ)
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Thêm các trường đặc thù cho Admin nếu có. Ví dụ:
      admin_type: { // Loại quản trị viên (ví dụ: 'Super Admin', 'Content Admin', 'User Manager')
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // BỎ CÁC TRƯỜNG DƯ THỪA ĐÃ CHUYỂN SANG BẢNG ACCOUNTS:
      // email: đã có trong Account
      // day_of_birth: có thể giữ ở đây hoặc chuyển sang Account nếu muốn chung hơn
      // gender: có thể giữ ở đây hoặc chuyển sang Account nếu muốn chung hơn
      // address: có thể giữ ở đây hoặc chuyển sang Account nếu muốn chung hơn
      // phone_number: có thể giữ ở đây hoặc chuyển sang Account nếu muốn chung hơn
      // google_id: đã có trong Account
      // status: đã có trong Account
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

  // Khai báo các mối quan hệ (association)
  AdminModel.associate = (models) => {
    // Admin thuộc về một Account (mối quan hệ 1-1 ngược lại với hasOne của Account)
    AdminModel.belongsTo(models.Account, {
      foreignKey: 'account_id', // Tên cột khóa ngoại trong bảng 'admins'
      as: 'account',         // Alias để truy cập bản ghi Account từ Admin (e.g., admin.getAccount())
    });

    // Các mối quan hệ khác của Admin (ví dụ: Admin quản lý nhiều BlogPost)
    // AdminModel.hasMany(models.BlogPost, { foreignKey: 'admin_id' });
  };

  return AdminModel;
};

export default Admin;