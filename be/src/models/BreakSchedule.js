import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const BreakSchedule = sequelize.define('break_schedule', {
  break_id: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false,
  },
  break_start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  break_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  number_of_days: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  break_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
}, {
  tableName: 'break_schedule',
  timestamps: true,
  createdAt: 'created_at', // Ánh xạ createdAt thành cột created_at
  updatedAt: 'updated_at', // Ánh xạ updatedAt thành cột updated_at
});

export default BreakSchedule;