import { DataTypes } from 'sequelize';

const LecturerAssignment = (sequelize) => {
    const LecturerAssignmentModel = sequelize.define('LecturerAssignment', {
        lecturer_id: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'lecturers',
                key: 'lecturer_id'
            }
        },
        subject_id: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'subjects',
                key: 'subject_id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'lecturer_assignments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['lecturer_id', 'subject_id']
            }
        ]
    });

    LecturerAssignmentModel.associate = (models) => {
        // Quan hệ với Lecturer
        LecturerAssignmentModel.belongsTo(models.Lecturer, {
            foreignKey: 'lecturer_id',
            as: 'lecturer',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        // Quan hệ với Subject
        LecturerAssignmentModel.belongsTo(models.Subject, {
            foreignKey: 'subject_id',
            as: 'subject',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    };

    return LecturerAssignmentModel;
};

export default LecturerAssignment;