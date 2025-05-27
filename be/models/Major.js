import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Major = sequelize.define('majors', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  }
}, {
  tableName: 'majors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Major;