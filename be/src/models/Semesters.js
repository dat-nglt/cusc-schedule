import { DataTypes } from "sequelize";
import { sequelize } from "../config/connectDB";

const Semester = sequelize.define("Semester", {
    semester_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    semester_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    program_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
        references: {
            model: 'programs',
            key: 'program_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    tableName: "semesters",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export default Semester;