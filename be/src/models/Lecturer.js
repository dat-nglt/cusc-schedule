import { DataTypes } from 'sequelize';

const Lecturer = (sequelize) => {
  const LecturerModel = sequelize.define('Lecturer', {
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
    tableName: 'lecturers', // The table name is already correctly 'lecturers'
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true // Keep underscored true for automatic snake_case column mapping
  });

  // Define associations
  LecturerModel.associate = (models) => {
    // Define associations here
    // Example: A Lecturer might teach many Classes or Subjects
    // LecturerModel.hasMany(models.Class, { foreignKey: 'lecturer_id' });
    // LecturerModel.hasMany(models.Subject, { foreignKey: 'lecturer_id' });
  };

  return LecturerModel;
};

export default Lecturer;