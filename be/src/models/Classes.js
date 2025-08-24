import { DataTypes } from "sequelize";

// Định nghĩa model Classes - Đại diện cho một lớp học
const Classes = (sequelize) => {
  const ClassesModel = sequelize.define(
    "Classes",
    {
      class_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      class_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      class_size: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      course_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      program_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      deleted_at: {
        // 👈 thêm cột này
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "classes",
      timestamps: true,
      paranoid: true, // 👈 bật soft delete
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at", // Sequelize sẽ set giá trị khi xóa
    }
  );

  // Khai báo mối quan hệ (association)
  ClassesModel.associate = (models) => {
    // Một lớp học thuộc về một khóa học
    ClassesModel.belongsTo(models.Course, {
      foreignKey: "course_id",
      onUpdate: "CASCADE", // Nếu thay đổi ID khóa học, cập nhật theo
      onDelete: "SET NULL", // Nếu xóa khóa học, để null trường course_id
    });
    // Một lớp học có nhiều sinh viên
    ClassesModel.hasMany(models.Student, {
      foreignKey: "class_id", // Khóa ngoại trong bảng Student trỏ về class_id
      onUpdate: "CASCADE", // Nếu thay đổi ID lớp học, cập nhật theo
      onDelete: "SET NULL",
    });
    ClassesModel.belongsTo(models.Program, {
      foreignKey: "program_id",
      onUpdate: "CASCADE", // Nếu thay đổi ID học kỳ, cập nhật theo
      onDelete: "SET NULL", // Nếu xóa học kỳ, để null trường program_id
    });
  };

  return ClassesModel;
};

export default Classes;
