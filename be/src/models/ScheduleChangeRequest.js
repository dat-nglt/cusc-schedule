import { DataTypes } from 'sequelize';

const ScheduleChangeRequest = (sequelize) => {
    const ScheduleChangeRequestModel = sequelize.define(
        'ScheduleChangeRequest',
        {
            request_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            class_schedule_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            lecturer_id: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            requested_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            requested_room_id: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            requested_slot_id: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'EXPIRED'),
                allowNull: false,
                defaultValue: 'PENDING'
            }
        },
        {
            tableName: 'schedule_change_requests',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                {
                    name: 'idx_schedule_requests_lecturer',
                    fields: ['lecturer_id']
                },
                {
                    name: 'idx_schedule_requests_class_schedule',
                    fields: ['class_schedule_id']
                },
                {
                    name: 'idx_schedule_requests_status',
                    fields: ['status']
                }
            ]
        }
    );

    // Define associations
    ScheduleChangeRequestModel.associate = (models) => {
        // Belongs to ClassSchedule
        if (models.ClassSchedule) {
            ScheduleChangeRequestModel.belongsTo(models.ClassSchedule, {
                foreignKey: 'class_schedule_id',
                as: 'classSchedule'
            });
        }

        // Belongs to Lecturer
        if (models.Lecturer) {
            ScheduleChangeRequestModel.belongsTo(models.Lecturer, {
                foreignKey: 'lecturer_id',
                as: 'lecturer'
            });
        }

        // Belongs to Room (requested)
        if (models.Room) {
            ScheduleChangeRequestModel.belongsTo(models.Room, {
                foreignKey: 'requested_room_id',
                as: 'requestedRoom'
            });
        }
    };

    return ScheduleChangeRequestModel;
};

export default ScheduleChangeRequest;
