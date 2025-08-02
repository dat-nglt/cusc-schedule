import { DataTypes } from 'sequelize';
// import { Hooks } from 'sequelize/lib/hooks';

// Định nghĩa model Semester - Đại diện cho một học kỳ
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
      // Tên học kỳ (ví dụ: Học kỳ 1 - 2025)
      semester_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Ngày bắt đầu học kỳ
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Ngày kết thúc học kỳ
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Trạng thái học kỳ (VD: đang học, đã kết thúc,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Liên kết đến chương trình đào tạo
      program_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
        // Mối quan hệ sẽ được khai báo rõ hơn trong associate
      },
    },
    {
      tableName: 'semesters',         // Tên bảng trong CSDL
      timestamps: true,               // Tự động tạo created_at và updated_at
      createdAt: 'created_at',        // Tên cột thời gian tạo
      updatedAt: 'updated_at',        // Tên cột thời gian cập nhật
      deletedAt: 'deleted_at',        // Tên cột thời gian xóa mềm (nếu sử dụng soft delete)
      paranoid: true,                 // Bật chế độ xóa mềm (soft delete)
    }
  );

  // Khai báo mối quan hệ (association)
  SemesterModel.associate = (models) => {
    // Một học kỳ thuộc về một chương trình đào tạo
    SemesterModel.belongsTo(models.Program, {
      foreignKey: 'program_id',
      as: 'program', // Add alias for consistency
      onUpdate: 'CASCADE',       // Khi cập nhật khóa ngoại ở bảng chương trình
      onDelete: "CASCADE", // Xóa học kỳ nếu chương trình bị xóa
    });
    // Một học kỳ có nhiều học phần
    SemesterModel.hasMany(models.Subject, {
      foreignKey: "semester_id",
      as: "subjects", // Add alias for consistency
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

  };

  return SemesterModel;
};

export default Semester;
