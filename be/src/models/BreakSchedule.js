import { DataTypes } from 'sequelize';

// Định nghĩa model BreakSchedule - Quản lý lịch nghỉ
const BreakSchedule = (sequelize) => {
  const BreakScheduleModel = sequelize.define(
    'BreakSchedule', // Tên model dạng PascalCase
    {
      // ID của đợt nghỉ (primary key)
      break_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Ngày bắt đầu nghỉ
      break_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Ngày kết thúc nghỉ
      break_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Số ngày nghỉ
      number_of_days: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      // Loại đợt nghỉ (ví dụ: nghỉ lễ, nghỉ tết,...)
      break_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Mô tả chi tiết (tuỳ chọn)
      description: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Trạng thái (ví dụ: active, cancelled,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: 'break_schedule',      // Tên bảng dạng snake_case
      timestamps: true,                 // Tự động tạo trường createdAt & updatedAt
      createdAt: 'created_at',          // Đổi tên trường createdAt
      updatedAt: 'updated_at',          // Đổi tên trường updatedAt
    }
  );

  // Khai báo mối quan hệ nếu có (association)
  BreakScheduleModel.associate = (models) => {
    // Ví dụ: liên kết với nhân viên hoặc lớp học
    // BreakScheduleModel.belongsTo(models.Employee, { foreignKey: 'employee_id' });
  };

  return BreakScheduleModel;
};

export default BreakSchedule;
