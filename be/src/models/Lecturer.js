'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Lecturer extends Model {
        static associate(models) {
            // Define associations here
            // Example: Lecturer.hasMany(models.Course, { foreignKey: 'lecturer_id' });
        }
    }

    Lecturer.init({
        lecturer_id: {
            type: DataTypes.STRING(50),
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
            allowNull: true,
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
        department: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        hire_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        degree: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        google_id: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'Lecturer',
        tableName: 'lecturers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true
    });

    return Lecturer;
};