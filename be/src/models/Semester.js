import { DataTypes } from 'sequelize';

const Semester = (sequelize) => {
  const SemesterModel = sequelize.define(
    'Semester',
    {
      // Mã học kỳ (khóa chính)
      semester_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên học kỳ (ví dụ: Học kỳ I - 2025)
      semester_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Số tuần của học kỳ
      duration_weeks: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // Ngày bắt đầu
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Ngày kết thúc
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Trạng thái học kỳ
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: 'semesters',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  );

  // Mối quan hệ được định nghĩa trong các bảng liên kết
  SemesterModel.associate = (models) => {
    // Một học kỳ được sử dụng bởi nhiều Chương trình thông qua bảng Program_Semesters
    SemesterModel.hasMany(models.ProgramSemesters, {
      foreignKey: 'semester_id',
      as: 'program_semesters',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return SemesterModel;
};

export default Semester;