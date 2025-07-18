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
      // Thời lượng đào tạo (VD: 3 năm, 4 năm,...)
      training_duration: {
        type: DataTypes.STRING(50),
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
      tableName: "programs", // Tên bảng trong CSDL
      timestamps: true, // Tự động thêm created_at và updated_at
      createdAt: "created_at", // Đặt tên cột createdAt
      updatedAt: "updated_at", // Đặt tên cột updatedAt
    }
  );

  // Khai báo mối quan hệ (association)
  ProgramModel.associate = (models) => {
   
  };

  return ProgramModel;
};

export default Program;
