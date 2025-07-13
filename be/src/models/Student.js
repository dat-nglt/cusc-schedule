import { DataTypes } from "sequelize";

// Định nghĩa model Student - Đại diện cho sinh viên
const Student = (sequelize) => {
  const StudentModel = sequelize.define(
    "Student", // Tên model
    {
      // Khóa ngoại account_id liên kết với bảng Accounts
      account_id: {
        type: DataTypes.UUID, // Phải khớp với kiểu của 'id' trong bảng 'accounts'
        allowNull: false,
        unique: true, // Đảm bảo mối quan hệ 1-1: Một Account chỉ có thể là một Student
        references: {
          model: "accounts", // Tên bảng đích (Accounts)
          key: "id", // Tên cột khóa chính của bảng đích
        },
        onUpdate: "CASCADE", // Hành động khi ID trong Accounts thay đổi
        onDelete: "CASCADE", // Hành động khi Account bị xóa
      },
      // Mã số sinh viên (khóa chính riêng, nếu có ý nghĩa nghiệp vụ)
      student_id: {
        type: DataTypes.STRING(50),
        primaryKey: true, // Giữ lại primary key riêng nếu cần
        allowNull: false,
      },
      // Họ tên sinh viên (có thể lấy từ Account nếu muốn giữ name ở Account)
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Mã lớp học
      class_id: {
        type: DataTypes.STRING(100), // Kiểu dữ liệu phải khớp với ID của model Classes
        allowNull: true,
      },
      // Năm nhập học (đặc thù của sinh viên)
      admission_year: {
        type: DataTypes.DATEONLY, // Hoặc DataTypes.INTEGER nếu chỉ lưu năm
        allowNull: true,
      },
      // Điểm trung bình (GPA) (đặc thù của sinh viên)
      gpa: {
        type: DataTypes.DECIMAL(3, 2), // Ví dụ: 3 chữ số tổng, 2 chữ số thập phân (4.00)
        allowNull: true,
        validate: {
          min: 0.0,
          max: 4.0,
        },
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
      tableName: "students", // Tên bảng trong CSDL
      timestamps: true, // Tự động thêm created_at và updated_at
      createdAt: "created_at", // Tên cột thời gian tạo
      updatedAt: "updated_at", // Tên cột thời gian cập nhật
      underscored: true, // Dùng snake_case cho tên cột
    }
  );

  // Khai báo mối quan hệ (association)
  StudentModel.associate = (models) => {
    // Student thuộc về một Account (mối quan hệ 1-1 ngược lại với hasOne của Account)
    StudentModel.belongsTo(models.Account, {
      foreignKey: "account_id", // Tên cột khóa ngoại trong bảng 'students'
      as: "account", // Alias để truy cập bản ghi Account từ Student (e.g., student.getAccount())
    });

    // Mỗi sinh viên thuộc về một lớp học
    StudentModel.belongsTo(models.Classes, {
      // Giả sử bạn có model Classes
      foreignKey: "class_id",
      as: "class", // Alias để truy cập thông tin lớp từ Student (e.g., student.getClass())
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Khi một lớp bị xóa, student_id trong Student sẽ đặt về NULL
    });

    // Một sinh viên có thể đăng ký nhiều khóa học (mối quan hệ nhiều-nhiều)
    // StudentModel.belongsToMany(models.Course, {
    //   through: 'StudentCourses', // Tên bảng trung gian
    //   foreignKey: 'student_id',  // Khóa ngoại trong StudentCourses trỏ về Student
    //   otherKey: 'course_id',     // Khóa ngoại trong StudentCourses trỏ về Course
    //   as: 'courses',             // Alias để truy cập các khóa học của sinh viên
    // });
  };

  return StudentModel;
};

export default Student;
