import { DataTypes } from 'sequelize';

const Student = (sequelize) => {
  const StudentModel = sequelize.define('Student', {
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
    class: { // Consider if 'class' should be a foreign key to a 'Classes' model
      type: DataTypes.STRING(100),
      allowNull: true
    },
    admission_year: {
      type: DataTypes.DATEONLY,
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
      allowNull: true
    }
  }, {
    tableName: 'students',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  // Define associations
  StudentModel.associate = (models) => {
    // Define associations here
    // Example: A student might belong to a Class:
    // StudentModel.belongsTo(models.Classes, { foreignKey: 'class_id' }); // Assuming 'class' column becomes 'class_id'
    // Example: A student might enroll in many Courses (many-to-many):
    // StudentModel.belongsToMany(models.Course, { through: 'StudentCourses', foreignKey: 'student_id' });
  };

  return StudentModel;
};

export default Student;