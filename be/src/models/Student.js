'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            // Define associations here
            // Example: Student.belongsToMany(models.Course, { through: 'StudentCourses', foreignKey: 'student_id' });
        }
    }

    Student.init({
        student_id: {
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
        class: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        admission_year: {
            type: DataTypes.DECIMAL(4, 0),
            allowNull: true
        },
        gpa: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: {
                min: 0.00,
                max: 4.00
            }
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
        modelName: 'Student',
        tableName: 'students',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true
    });

    return Student;
};