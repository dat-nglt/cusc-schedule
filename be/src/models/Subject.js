import { DataTypes } from "sequelize";
import { sequelize } from "../config/connectDB";

const Subject = sequelize.define("Subject", {
    subject_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    subject_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    credit: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    theory_hours: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    practice_hours: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    semester_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
        references: {
            model: 'semesters',
            key: 'semester_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    tableName: "subjects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export default Subject;