import { DataTypes } from 'sequelize';

// Định nghĩa model Course - Đại diện cho một khóa học
const Course = (sequelize) => {
  const CourseModel = sequelize.define(
    'Course', // Tên model PascalCase
    {
      // Mã khóa học (Primary Key)
      course_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên khóa học
      course_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Ngày bắt đầu
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Ngày kết thúc
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Trạng thái của khóa học (VD: đang diễn ra, đã kết thúc, bị hủy,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: 'courses',          // Tên bảng dạng snake_case
      timestamps: true,              // Tự động thêm created_at & updated_at
      createdAt: 'created_at',       // Đặt tên cho trường thời gian tạo
      updatedAt: 'updated_at',       // Đặt tên cho trường thời gian cập nhật
    }
  );

  // Khai báo mối quan hệ (association)
  CourseModel.associate = (models) => {
    // Một khóa học có thể có nhiều lớp học
    CourseModel.hasMany(models.Classes, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',         // Nếu thay đổi khóa ngoại, cập nhật theo
      onDelete: 'SET NULL',        // Nếu xóa khóa học, thì lớp học sẽ có course_id = null
    });
  };

  return CourseModel;
};

export default Course;