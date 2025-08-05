import { DataTypes } from "sequelize";
// import { add } from "winston";

// Định nghĩa model Lecturer - Đại diện cho giảng viên
const Lecturer = (sequelize) => {
  const LecturerModel = sequelize.define(
    "Lecturer", // Tên model
    {
      // Khóa ngoại account_id liên kết với bảng Accounts

      //không nên khai báo mối quan hệ ở đây, chỉ cần ràng buộc khóa ngoại
      // account_id: {
      //   type: DataTypes.UUID, // Phải khớp với kiểu của 'id' trong bảng 'accounts'
      //   allowNull: false,
      //   unique: true, // Đảm bảo mối quan hệ 1-1: Một Account chỉ có thể là một Lecturer
      //   references: {
      //     model: "accounts", // Tên bảng đích (Accounts)
      //     key: "id", // Tên cột khóa chính của bảng đích
      //   },
      //   onUpdate: "CASCADE", // Hành động khi ID trong Accounts thay đổi
      //   onDelete: "CASCADE", // Hành động khi Account bị xóa
      // },
      // Mã giảng viên (khóa chính riêng, nếu có ý nghĩa nghiệp vụ)
      lecturer_id: {
        type: DataTypes.STRING(50),
        primaryKey: true, // Giữ lại primary key riêng nếu cần
        allowNull: false,
      },
      // Họ tên giảng viên
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Khoa hoặc bộ môn đang công tác (đặc thù của giảng viên)
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Ngày bắt đầu làm việc (đặc thù của giảng viên)
      hire_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Học vị (cử nhân, thạc sĩ, tiến sĩ,...) (đặc thù của giảng viên)
      degree: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      // Học hàm (GS, PGS) - ví dụ trường đặc thù khác nếu cần
      academic_rank: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(15), // Số điện thoại giảng viên
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10), // Giới tính giảng viên (Nam,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255), // Địa chỉ giảng viên
        allowNull: true,
      },
      day_of_birth: {
        type: DataTypes.DATEONLY, // Ngày sinh giảng viên
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(30), // Trạng thái giảng viên
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
      tableName: "lecturers", // Tên bảng trong CSDL
      timestamps: true, // Tự động thêm created_at và updated_at
      createdAt: "created_at", // Đặt tên cột createdAt
      updatedAt: "updated_at", // Đặt tên cột updatedAt
      deletedAt: "deleted_at", // Đặt tên cột deletedAt nếu cần
    }
  );

  // Khai báo mối quan hệ (association)
  LecturerModel.associate = (models) => {
    // Lecturer thuộc về một Account (mối quan hệ 1-1 ngược lại với hasOne của Account)
    LecturerModel.belongsTo(models.Account, {
      foreignKey: "account_id", // Tên cột khóa ngoại trong bảng 'lecturers'
      as: "account", // Alias để truy cập bản ghi Account từ Lecturer (e.g., lecturer.getAccount())
    });

    // Mối quan hệ nhiều-nhiều: Một Lecturer có thể dạy nhiều Subject
    LecturerModel.belongsToMany(models.Subject, {
      through: models.LecturerAssignment,
      foreignKey: "lecturer_id",
      otherKey: "subject_id",
      as: "subjects",
    });

    // Mối quan hệ một-nhiều với bảng junction LecturerAssignment
    LecturerModel.hasMany(models.LecturerAssignment, {
      foreignKey: "lecturer_id",
      as: "lecturerAssignments",
    });
    // Mối quan hệ một-nhiều với bảng BusySlot
    LecturerModel.hasMany(models.BusySlot, {
      foreignKey: "lecturer_id",
      as: "busy_slots",
    });
  };

  return LecturerModel;
};

export default Lecturer;
