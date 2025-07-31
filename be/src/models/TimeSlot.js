import { DataTypes } from "sequelize";

// Định nghĩa model Program - Đại diện cho một chương trình đào tạo
const TimeSlot = (sequelize) => {
  const TimeSlotModel = sequelize.define(
    "TimeSlot",
    {
      // Mã khung thời gian  (khóa chính)
      slot_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên khung thời gian 
      slot_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Thời gian bắt đầu
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      // Thời gian kết thúc
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      // buổi (sáng, trưa, chiều, tối)
      type: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Mô tả chi tiết khung thời gian
      description: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Trạng thái khung thời gian (active, inactive,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

    },
    {
      tableName: "time_slots", // Tên bảng trong CSDL
      timestamps: true, // Tự động thêm created_at và updated_at
      createdAt: "created_at", // Đặt tên cột createdAt
      updatedAt: "updated_at", // Đặt tên cột updatedAt
    }
  );

  // Khai báo mối quan hệ (association)
  TimeSlotModel.associate = (models) => {

  };

  return TimeSlotModel;
};

export default TimeSlot;
