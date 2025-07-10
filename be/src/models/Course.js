import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connectDB.js';

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false,
  },
  course_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Định nghĩa mối quan hệ với bảng Classes
Course.associate = function (models) {
  Course.hasMany(models.Classes, {
    foreignKey: 'course_id',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });
};

export default Course;