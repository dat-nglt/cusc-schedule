import { DataTypes } from 'sequelize';

const BusySlot = (sequelize) => {
    const BusySlotModel = sequelize.define('BusySlot', {
        busy_slot_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        lecturer_id: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        slot_id: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        day: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: 'Day of week (e.g., "Tue", "Thu")'
        }
    }, {
        tableName: 'busy_slots',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['lecturer_id', 'slot_id', 'day']
            }
        ]
    });

    BusySlotModel.associate = (models) => {
        // Quan hệ với Lecturer
        BusySlotModel.belongsTo(models.Lecturer, {
            foreignKey: 'lecturer_id',
            as: 'lecturer',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        // Quan hệ với timeslot
        BusySlotModel.belongsTo(models.TimeSlot, {
            foreignKey: 'slot_id',
            as: 'timeslot',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    };

    return BusySlotModel;
};

export default BusySlot;