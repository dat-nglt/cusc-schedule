import { DataTypes } from 'sequelize';

// Định nghĩa model Student - Đại diện cho sinh viên
const Student = (sequelize) => {
  const StudentModel = sequelize.define(
    'Student',
    {
      // Mã số sinh viên (khóa chính)
      student_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      // Họ tên sinh viên
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Email sinh viên - duy nhất, kiểm tra định dạng email
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
      // Mã lớp học (khuyến nghị nên đổi tên thành 'class_id' để liên kết với model Classes)
      class_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Năm nhập học
      admission_year: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Điểm trung bình (GPA)
      gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        validate: {
          min: 0.0,
          max: 4.0,
        },
      },
      // ID Google dùng cho đăng nhập OAuth
      google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      // Trạng thái (active, inactive, suspended,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: 'students',         // Tên bảng trong CSDL
      timestamps: true,              // Tự động thêm created_at và updated_at
      createdAt: 'created_at',       // Tên cột thời gian tạo
      updatedAt: 'updated_at',       // Tên cột thời gian cập nhật
      deletedAt: 'deleted_at',       // Tên cột thời gian xóa mềm
      paranoid: true,                // Bật chế độ xóa mềm (soft delete)
   
    }
  );

  // Khai báo mối quan hệ (association)
  StudentModel.associate = (models) => {
    // Mỗi sinh viên thuộc về một lớp học
    StudentModel.belongsTo(models.Classes, {
      foreignKey: 'class_id',
      onUpdate: 'CASCADE',
       onDelete: "CASCADE", // Xóa sinh viên nếu lớp học bị xóa
    });

    // Một sinh viên có thể đăng ký nhiều khóa học (mối quan hệ nhiều-nhiều)
    // StudentModel.belongsToMany(models.Course, {
    //   through: 'StudentCourses',
    //   foreignKey: 'student_id',
    // });
  };

  return StudentModel;
};

export default Student;
