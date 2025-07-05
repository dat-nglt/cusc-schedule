import { sequelize } from "../config/connectDB.js";
import { DataTypes } from "sequelize";

// Import model definitions
import StudentModel from './Student.js';
import LecturerModel from './Lecturer.js';
import AdminModel from './Admin.js';
import TrainingOfficerModel from './TrainingOfficer.js';
import Course from './Course.js';
import Classes from './Classes.js';

// Initialize models with sequelize instance
const Student = StudentModel(sequelize, DataTypes);
const Lecturer = LecturerModel(sequelize, DataTypes);
const Admin = AdminModel(sequelize, DataTypes);
const TrainingOfficer = TrainingOfficerModel(sequelize, DataTypes);

// Define associations if needed
const models = {
    Student,
    Lecturer,
    Admin,
    TrainingOfficer,
    Course,
    Classes
};

// Call associate methods if they exist
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export {
    Student,
    Lecturer,
    Admin,
    TrainingOfficer,
    sequelize,
    Course,
    Classes
};
