import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Course = sequelize.define('courses', {
  courseid: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false
  },
  coursename: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  startdate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  enddate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(30),
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Course;

