import { DataTypes } from 'sequelize';

const Course = (sequelize) => {
  const CourseModel = sequelize.define('Course', { // Changed model name to 'Course' (PascalCase) for consistency
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
    tableName: 'courses', // Keep tableName as 'courses' (snake_case)
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Define associations within the factory function
  CourseModel.associate = (models) => {
    // A Course can have many Classes
    CourseModel.hasMany(models.Classes, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };

  return CourseModel;
};

export default Course;