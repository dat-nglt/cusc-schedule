import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB.js';

const Admin = sequelize.define('Admin', {
    admin_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(70),
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    day_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },
    google_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    status: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
}, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

// Define associations
Admin.associate = (models) => {
    // define association here
};

export default Admin;