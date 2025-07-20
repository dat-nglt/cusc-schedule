import { DataTypes } from "sequelize";

const ClassSubject = (sequelize) => {
  const ClassSubjectModel = sequelize.define(
    "ClassSubject",
    {
      class_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
        references: {
          model: "classes",
          key: "class_id",
        },
      },
      // Tên lớp học phần
      subject_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        references: {
          model: "subjects",
          key: "subject_id",
        },
      },
    },
    {
      tableName: "class_sections", // Tên bảng trong CSDL
      timestamps: true, // Tự động thêm created_at và updated_at
      createdAt: "created_at", // Đặt tên cột createdAt
      updatedAt: "updated_at", // Đặt tên cột updatedAt
      indexes: [
        {
          unique: true,
          fields: ["class_id", "subject_id"], // Đảm bảo không có lớp học phần trùng lặp
        },
      ],
    }
  );

  // Khai báo mối quan hệ (association)
  ClassSubjectModel.associate = (models) => {
    ClassSubjectModel.belongsTo(models.Subject, {
      foreignKey: "subject_id",
      as: "subject", // Tên alias cho quan hệ
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Xóa tất cả lớp học phần liên quan nếu môn học bị xóa
    });
    ClassSubjectModel.belongsTo(models.Class, {
      foreignKey: "class_id",
      as: "class", // Tên alias cho quan hệ
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Xóa tất cả lớp học phần liên quan nếu lớp học bị xóa
    });
  };

  return ClassSubjectModel;
};

export default ClassSubject;