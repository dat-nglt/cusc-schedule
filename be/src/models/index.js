// <<<<<<< HEAD
// import { sequelize } from '../config/connectDB';
// const fs = require('fs');
// const path = require('path');

// const db = {};

// // Danh sách file cần loại trừ (đã được quản lý trong User.js)
// const excludedFiles = ['Student.js', 'Lecturer.js', 'Admin.js', 'TrainingOfficer.js'];

// fs.readdirSync(__dirname)
//   .filter(file =>
//     file.indexOf('.') !== 0 &&
//     file !== 'index.js' &&
//     file.slice(-3) === '.js' &&
//     !excludedFiles.includes(file) // Bỏ qua các file đã loại trừ
//   )
//   .forEach(file => {
//     try {
//       const modelModule = require(path.join(__dirname, file));
//       const model = modelModule.default;
//       if (!model || typeof model !== 'function' || !model.name) {
//         console.error(`Invalid model export in file: ${file}. Model or name property is missing.`);
//         return;
//       }
//       db[model.name] = model;
//     } catch (error) {
//       console.error(`Error loading model from file ${file}:`, error);
//     }
//   });

// db.sequelize = sequelize;

// // Thiết lập các quan hệ
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// console.log('Loaded models:', Object.keys(db));

// export default db;

// Kết nối Sequelize từ file config
import { sequelize } from "../config/connectDB.js";
import { DataTypes } from "sequelize";

// Import các định nghĩa model (mỗi file là một bảng)
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

// Khởi tạo từng model với instance của Sequelize
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

// Gom tất cả model vào object `models`
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
  sequelize, // export luôn cả instance Sequelize
};

// Gọi phương thức associate nếu model có định nghĩa quan hệ
Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === 'function') {
    models[modelName].associate(models);
  }
});

// Export toàn bộ models ra ngoài
export default models;
