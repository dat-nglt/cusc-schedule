import { DataTypes } from "sequelize";

// Định nghĩa model SemesterBusySlot - Đại diện cho khe thời gian bận của giảng viên
const SemesterBusySlot = (sequelize) => {
    const SemesterBusySlotModel = sequelize.define(
        "SemesterBusySlot",
        {
            // ID khe thời gian bận (khóa chính)
            semester_busy_slot_id: {
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
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false, // Ngày bận không được để trống
            },
            // Mã khe thời gian
            slot_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
        },
        {
            tableName: "semester_busy_slots", // Tên bảng trong CSDL
            timestamps: true, // Tự động thêm created_at và updated_at
            createdAt: "createdAt", // Đặt tên cột createdAt
            updatedAt: "updatedAt", // Đặt tên cột updatedAt
        }
    );

    // Khai báo mối quan hệ (association)
    SemesterBusySlotModel.associate = (models) => {
        SemesterBusySlotModel.belongsTo(models.Lecturer, {
            foreignKey: "lecturer_id",
            as: "lecturer",
            onUpdate: "CASCADE",
            onDelete: "SET NULL", // Xóa khe thời gian bận nếu giảng viên bị xó
        });
    };

    return SemesterBusySlotModel;
};

export default SemesterBusySlot;
