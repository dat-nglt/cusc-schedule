'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  Admin.init({
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
      unique: true
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
      allowNull: true
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
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Admin;
};
