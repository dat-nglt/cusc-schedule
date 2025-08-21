import { DataTypes } from "sequelize";

// Định nghĩa model Program - Đại diện cho một chương trình đào tạo
const Program = (sequelize) => {
  const ProgramModel = sequelize.define(
    "Program",
    {
      // Mã chương trình đào tạo (khóa chính)
      program_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên chương trình đào tạo
      program_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Số tuần của chương trình
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // Mô tả chi tiết chương trình
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      // Trạng thái chương trình (active, inactive,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: "programs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  // Khai báo mối quan hệ (association)
  ProgramModel.associate = (models) => {
    // Một Chương trình có nhiều Học kỳ. Liên kết với bảng Program_Semesters.
    ProgramModel.hasMany(models.ProgramSemesters, {
      foreignKey: "program_id",
      as: "program_semesters",
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Xóa tất cả học kỳ thuộc chương trình nếu chương trình bị xóa
    });
    
    // Một Chương trình có nhiều Môn học thông qua các học kỳ.
    // Mối quan hệ này được thiết lập thông qua bảng trung gian Program_Subject_Semesters
    // Bỏ mối quan hệ trực tiếp với bảng Classes để đảm bảo tính toàn vẹn dữ liệu.
  };

  return ProgramModel;
};

export default Program;