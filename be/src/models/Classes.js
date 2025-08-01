import { DataTypes } from 'sequelize';

// Định nghĩa model Classes - Đại diện cho một lớp học
const Classes = (sequelize) => {
  const ClassesModel = sequelize.define(
    'Classes', // Tên model dạng PascalCase
    {
      // Mã lớp học (Primary key)
      class_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên lớp học
      class_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Sĩ số lớp
      class_size: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      // Trạng thái lớp (VD: active, inactive,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Khóa học liên kết (foreign key đến Course)
      course_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Thời điểm tạo bản ghi
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      // Thời điểm cập nhật bản ghi
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: 'classes',          // Tên bảng trong CSDL
      timestamps: true,              // Tự động xử lý createdAt và updatedAt
      createdAt: 'created_at',       // Đặt tên cột createdAt
      updatedAt: 'updated_at',       // Đặt tên cột updatedAt
    }
  );

  // Khai báo mối quan hệ (association)
  ClassesModel.associate = (models) => {
    // Một lớp học thuộc về một khóa học
    ClassesModel.belongsTo(models.Course, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',       // Nếu thay đổi ID khóa học, cập nhật theo
      onDelete: 'SET NULL',      // Nếu xóa khóa học, để null trường course_id
    });
    // Một lớp học có nhiều sinh viên
    ClassesModel.hasMany(models.Student, {
      foreignKey: 'class_id',    // Khóa ngoại trong bảng Student trỏ về class_id
      as: 'students', // Add consistent alias for the reverse relationship
      onUpdate: 'CASCADE',       // Nếu thay đổi ID lớp học, cập nhật theo
      onDelete: 'SET NULL',
    });
    ClassesModel.belongsTo(models.Semester, {
      foreignKey: 'semester_id',
      onUpdate: 'CASCADE',       // Nếu thay đổi ID học kỳ, cập nhật theo
      onDelete: 'SET NULL',      // Nếu xóa học kỳ, để null trường semester_id
    });
  };

  return ClassesModel;
};

export default Classes;
