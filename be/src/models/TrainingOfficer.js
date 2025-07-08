import { DataTypes } from 'sequelize';

const TrainingOfficer = (sequelize) => {
  const TrainingOfficerModel = sequelize.define('TrainingOfficer', {
    staff_id: {
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
    department: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(30),
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
    tableName: 'training_officers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  // Define associations
  TrainingOfficerModel.associate = (models) => {
    // Define associations here. For example:
    // A TrainingOfficer might manage many Programs or Classes.
    // TrainingOfficerModel.hasMany(models.Program, { foreignKey: 'officer_id' });
  };

  return TrainingOfficerModel;
};

export default TrainingOfficer;