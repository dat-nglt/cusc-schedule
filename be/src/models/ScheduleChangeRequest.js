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
                type: DataTypes.STRING(30),
                allowNull: false
            },
            lecturer_id: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            request_type: {
                type: DataTypes.ENUM('RESCHEDULE', 'CANCEL', 'ROOM_CHANGE', 'TIME_CHANGE', 'MAKEUP_CLASS', 'SUBSTITUTE'),
                allowNull: false
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            requested_date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            requested_weekday: {
                type: DataTypes.ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
                allowNull: true
            },
            requested_week_number: {
                type: DataTypes.SMALLINT,
                allowNull: true
            },
            requested_time_slot_id: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            requested_room_id: {
                type: DataTypes.STRING(30),
                allowNull: true
            },
            substitute_lecturer_id: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            priority: {
                type: DataTypes.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
                defaultValue: 'NORMAL',
                allowNull: true
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'EXPIRED'),
                defaultValue: 'PENDING',
                allowNull: false
            },
            admin_response: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            approved_by: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            approved_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            deadline: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            tableName: 'schedule_change_requests',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            indexes: [
                {
                    name: 'idx_schedule_requests_lecturer_status',
                    fields: ['lecturer_id', 'status']
                },
                {
                    name: 'idx_schedule_requests_class_schedule',
                    fields: ['class_schedule_id']
                },
                {
                    name: 'idx_schedule_requests_status_created',
                    fields: ['status', 'created_at']
                }
            ]
        }
    );

    // Define associations
    ScheduleChangeRequestModel.associate = (models) => {
        // Belongs to ClassSchedule
        ScheduleChangeRequestModel.belongsTo(models.ClassSchedule, {
            foreignKey: 'class_schedule_id',
        });

        // Belongs to Lecturer (requester)
        ScheduleChangeRequestModel.belongsTo(models.Lecturer, {
            foreignKey: 'lecturer_id',
        });

        // Belongs to TimeSlot (requested)
        ScheduleChangeRequestModel.belongsTo(models.TimeSlot, {
            foreignKey: 'requested_time_slot_id',
        });

        // Belongs to Room (requested)
        ScheduleChangeRequestModel.belongsTo(models.Room, {
            foreignKey: 'requested_room_id',
        });

        // Belongs to Lecturer (substitute)
        ScheduleChangeRequestModel.belongsTo(models.Lecturer, {
            foreignKey: 'substitute_lecturer_id',
        });

    };
    return ScheduleChangeRequestModel;
};

export default ScheduleChangeRequest;
