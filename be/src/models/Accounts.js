import { DataTypes } from 'sequelize';

const Account = (sequelize) => {
  const AccountModel = sequelize.define(
    'Account', // Tên model
    {
      // Khóa chính: ID duy nhất cho mỗi người dùng
      id: {
        type: DataTypes.UUID, // Sử dụng UUID để có ID duy nhất và phân tán tốt
        defaultValue: DataTypes.UUIDV4, // Tự động tạo UUID v4
        primaryKey: true,
        allowNull: false,
      },
      // Địa chỉ Email: Bắt buộc và duy nhất cho việc xác thực
      email: {
        type: DataTypes.STRING(70),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Đảm bảo định dạng email hợp lệ
        },
      },
      // Vai trò của người dùng: GiangVien, HocVien, QuanTriVien, CanBoDaoTao
      // Sử dụng ENUM để giới hạn các giá trị có thể có
      role: {
        type: DataTypes.ENUM(
          'student',
          'lecturer',
          'admin',
          'training_officer'
        ),
        allowNull: false,
        defaultValue: 'student' // Đặt giá trị mặc định nếu cần
      },
      // Google ID: Dùng cho đăng nhập OAuth của Google
      // Có thể NULL nếu người dùng không đăng nhập qua Google hoặc chưa liên kết
      google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true, // Duy nhất để một Google ID chỉ liên kết với một tài khoản
      },
      // Trạng thái tài khoản (ví dụ: active, inactive, suspended)
      status: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'accounts', // Tên bảng trong cơ sở dữ liệu
      timestamps: true, // Tự động quản lý created_at và updated_at
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true, // Sử dụng snake_case cho tên cột
    }
  );

  // Khai báo các mối quan hệ (associations)
  AccountModel.associate = (models) => {
    // Một Account có thể là một Admin (1-1)
    AccountModel.hasOne(models.Admin, {
      foreignKey: 'user_id', // Tên cột khóa ngoại trong bảng 'admins'
      as: 'adminInfo',       // Alias để truy cập dữ liệu
      onDelete: 'CASCADE',   // Nếu Account bị xóa, Admin tương ứng cũng bị xóa
      onUpdate: 'CASCADE',
    });

    // Một Account có thể là một Student (1-1)
    AccountModel.hasOne(models.Student, {
      foreignKey: 'user_id',
      as: 'studentInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Một Account có thể là một Lecturer (1-1)
    AccountModel.hasOne(models.Lecturer, {
      foreignKey: 'user_id',
      as: 'lecturerInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Một Account có thể là một TrainingOfficer (1-1)
    AccountModel.hasOne(models.TrainingOfficer, {
      foreignKey: 'user_id',
      as: 'trainingOfficerInfo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return AccountModel;
};

export default Account;