import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const User = sequelize.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }, name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(70),
    allowNull: true,
    unique: true
  }, phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(1000),
    allowNull: true
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
  role: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['admin', 'training_officer', 'student', 'lecturer']]
    }
  },
  status: {
    type: DataTypes.STRING(30),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default User;