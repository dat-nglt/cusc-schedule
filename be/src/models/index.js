import { sequelize } from "../config/connectDB.js";
import { DataTypes } from "sequelize";

// Import model definitions
import AdminModel from "./Admin.js";
import ClassesModel from "./Classes.js";
import BreakScheduleModel from "./BreakSchedule.js";
import CourseModel from "./Course.js";
import LecturerModel from "./Lecturer.js";
import ProgramModel from "./Program.js";
import SemesterModel from "./Semester.js";
import StudentModel from "./Student.js";
import SubjectModel from "./Subject.js";
import TrainingOfficerModel from "./TrainingOfficer.js";

// Initialize models with sequelize instance and DataTypes
const Admin = AdminModel(sequelize, DataTypes);
const Classes = ClassesModel(sequelize, DataTypes);
const BreakSchedule = BreakScheduleModel(sequelize, DataTypes);
const Course = CourseModel(sequelize, DataTypes);
const Lecturer = LecturerModel(sequelize, DataTypes);
const Program = ProgramModel(sequelize, DataTypes);
const Semester = SemesterModel(sequelize, DataTypes);
const Student = StudentModel(sequelize, DataTypes);
const Subject = SubjectModel(sequelize, DataTypes);
const TrainingOfficer = TrainingOfficerModel(sequelize, DataTypes);

// Define associations if needed
const models = {
  Admin,
  Classes,
  BreakSchedule,
  Course,
  Lecturer,
  Program,
  Semester,
  Student,
  Subject,
  TrainingOfficer,
  sequelize
};

// Call associate methods if they exist
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default models