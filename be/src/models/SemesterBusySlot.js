import { DataTypes } from "sequelize";

const SemesterBusySlot = (sequelize) => {
    const SemesterBusySlotModel = sequelize.define(
        "SemesterBusySlot",
        {
            semester_busy_slot_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
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
                allowNull: false,
            },
            slot_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
        },
        {
            tableName: "semester_busy_slots",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",  // bật soft delete
            paranoid: true,           // bật paranoid
            underscored: true,        // đồng bộ snake_case
        }
    );

    SemesterBusySlotModel.associate = (models) => {
        SemesterBusySlotModel.belongsTo(models.Lecturer, {
            foreignKey: "lecturer_id",
            as: "lecturer",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    };

    return SemesterBusySlotModel;
};

export default SemesterBusySlot;
