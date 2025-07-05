// import { DataTypes } from 'sequelize';
// import { sequelize } from '../config/database';

// const Course = sequelize.define('courses', {
//   course_id: {
//     type: DataTypes.STRING(30),
//     primaryKey: true,
//     allowNull: false,
//   },
//   course_name: {
//     type: DataTypes.STRING(50),
//     allowNull: true,
//   },
//   start_date: {
//     type: DataTypes.DATEONLY,
//     allowNull: true,
//   },
//   end_date: {
//     type: DataTypes.DATEONLY,
//     allowNull: true,
//   },
//   status: {
//     type: DataTypes.STRING(30),
//     allowNull: true,
//   },
// }, {
//   tableName: 'courses',
//   timestamps: true,
//   createdAt: 'created_at', // Ánh xạ createdAt thành cột created_at
//   updatedAt: 'updated_at', // Ánh xạ updatedAt thành cột updated_at
// });

// export default Course;
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import Classes from './Classes'; // Import Classes để định nghĩa mối quan hệ

class Course extends Model {
  static associate(models) {
    // Định nghĩa mối quan hệ với bảng Classes
    Course.hasMany(models.Classes, {
      foreignKey: 'course_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  }
}

Course.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Course;