import { DataTypes } from "sequelize";

const BusySlot = (sequelize) => {
    const BusySlotModel = sequelize.define(
        "BusySlot",
        {
            busy_slot_id: {
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
            slot_id: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            day: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
        },
        {
            tableName: "busy_slots",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at", // bật soft delete
            paranoid: true,          // bật paranoid
            underscored: true,       // đồng bộ snake_case
        }
    );

    BusySlotModel.associate = (models) => {
        BusySlotModel.belongsTo(models.Lecturer, {
            foreignKey: "lecturer_id",
            as: "lecturer",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        });
    };

    return BusySlotModel;
};

export default BusySlot;
