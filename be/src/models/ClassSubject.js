import { DataTypes } from "sequelize";

const ClassSubject = (sequelize) => {
  const ClassSubjectModel = sequelize.define(
    "ClassSubject",
    {
      // Mã lớp học phần (khóa chính)
      class_subject_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên lớp học phần
      class_subject_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // Mã môn học liên kết
      subject_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      // Mã lớp học liên kết
      class_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      tableName: "class_subjects", // Tên bảng trong CSDL
      timestamps: true, // Tự động thêm created_at và updated_at
      createdAt: "created_at", // Đặt tên cột createdAt
      updatedAt: "updated_at", // Đặt tên cột updatedAt
    }
  );

  // Khai báo mối quan hệ (association)
  ClassSubjectModel.associate = (models) => {
    ClassSubjectModel.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Xóa tất cả lớp học phần liên quan nếu môn học bị xóa
    });
    ClassSubjectModel.belongsTo(models.Class, {
      foreignKey: "class_id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Xóa tất cả lớp học phần liên quan nếu lớp học bị xóa
    });
  };

  return ClassSubjectModel;
}