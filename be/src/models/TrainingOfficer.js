import { DataTypes } from "sequelize";

// Định nghĩa model TrainingOfficer - Đại diện cho cán bộ đào tạo
const TrainingOfficer = (sequelize) => {
  const TrainingOfficerModel = sequelize.define(
    "TrainingOfficer", // Tên model
    {
      // Khóa ngoại account_id liên kết với bảng Accounts
      account_id: {
        type: DataTypes.UUID, // Phải khớp với kiểu của 'id' trong bảng 'accounts'
        allowNull: false,
        unique: true, // Đảm bảo mối quan hệ 1-1: Một Account chỉ có thể là một TrainingOfficer
        references: {
          model: "accounts", // Tên bảng đích (Accounts)
          key: "id", // Tên cột khóa chính của bảng đích
        },
        onUpdate: "CASCADE", // Hành động khi ID trong Accounts thay đổi
        onDelete: "CASCADE", // Hành động khi Account bị xóa
      },
      // Mã cán bộ (primary key riêng, nếu có ý nghĩa nghiệp vụ)
      staff_id: {
        type: DataTypes.STRING(30),
        primaryKey: true, // Giữ lại primary key riêng nếu cần
        allowNull: false,
      },
      // Họ tên cán bộ
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Phòng ban công tác (đặc thù của cán bộ đào tạo)
      department: {
        type: DataTypes.STRING(100), // Tăng độ dài nếu cần thiết
        allowNull: true,
      },
      // Chức vụ (đặc thù của cán bộ đào tạo)
      position: {
        type: DataTypes.STRING(50), // Tăng độ dài nếu cần thiết
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
      tableName: "training_officers", // Tên bảng trong CSDL
      timestamps: true, // Tự động tạo created_at và updated_at
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true, // Dùng snake_case cho tên cột
    }
  );

  // Khai báo các mối quan hệ (association)
  TrainingOfficerModel.associate = (models) => {
    // TrainingOfficer thuộc về một Account (mối quan hệ 1-1 ngược lại với hasOne của Account)
    TrainingOfficerModel.belongsTo(models.Account, {
      foreignKey: "account_id", // Tên cột khóa ngoại trong bảng 'training_officers'
      as: "account", // Alias để truy cập bản ghi Account từ TrainingOfficer (e.g., officer.getAccount())
    });

    // Các mối quan hệ khác của Cán bộ đào tạo (ví dụ: quản lý nhiều chương trình/lớp học)
    // TrainingOfficerModel.hasMany(models.Program, { foreignKey: 'officer_id' });
    // TrainingOfficerModel.hasMany(models.Class, { foreignKey: 'officer_id' });
  };

  return TrainingOfficerModel;
};

export default TrainingOfficer;
