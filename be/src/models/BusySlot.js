import { DataTypes } from "sequelize";

// Định nghĩa model BusySlot - Đại diện cho khe thời gian bận của giảng viên
const BusySlot = (sequelize) => {
    const BusySlotModel = sequelize.define(
        "BusySlot",
        {
            // ID khe thời gian bận (khóa chính)
            busy_slot_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            // Mã giảng viên (khóa ngoại)
            lecturer_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
                references: {
                    model: "lecturers",
                    key: "lecturer_id",
                },
            },
            // Mã khe thời gian
            slot_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            // Ngày trong tuần (VD: "Tue", "Thu")
            day: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
        },
        {
            tableName: "busy_slots", // Tên bảng trong CSDL
            timestamps: true, // Tự động thêm created_at và updated_at
            createdAt: "createdAt", // Đặt tên cột createdAt
            updatedAt: "updatedAt", // Đặt tên cột updatedAt
        }
    );

    // Khai báo mối quan hệ (association)
    BusySlotModel.associate = (models) => {
        BusySlotModel.belongsTo(models.Lecturer, {
            foreignKey: "lecturer_id",
            as: "lecturer",
            onUpdate: "CASCADE",
            onDelete: "SET NULL", // Xóa khe thời gian bận nếu giảng viên bị xó
        });
    };

    return BusySlotModel;
};

export default BusySlot;

