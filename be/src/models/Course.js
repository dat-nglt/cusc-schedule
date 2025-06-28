import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db/database';

const Course = sequelize.define('courses', {
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
  createdAt: 'created_at', // Ánh xạ createdAt thành cột created_at
  updatedAt: 'updated_at', // Ánh xạ updatedAt thành cột updated_at
});

export default Course;