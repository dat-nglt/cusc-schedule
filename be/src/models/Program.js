import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB';

const Program = sequelize.define('Program', {
    program_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    program_name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    training_duration: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
}, {
    tableName: 'programs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Program;