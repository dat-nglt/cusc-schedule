import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

// Import model definitions
import StudentModel from "./Student.js";
import LecturerModel from "./Lecturer.js";
import AdminModel from "./Admin.js";
import TrainingOfficerModel from "./TrainingOfficer.js";

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
};

// Call associate methods if they exist
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default {
  Student,
  Lecturer,
  Admin,
  TrainingOfficer,
  sequelize,
};
