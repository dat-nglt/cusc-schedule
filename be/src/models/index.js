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
import AccountModel from "./Accounts.js";
import BlacklistedTokenModel from "./BlacklistedToken.js";

// Khởi tạo từng model với instance của Sequelize
const Account = AccountModel(sequelize, DataTypes);
const BlacklistedToken = BlacklistedTokenModel(sequelize, DataTypes);
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
  Account,
  BlacklistedToken,
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
  if (typeof models[modelName].associate === "function") {
    models[modelName].associate(models);
  }
});

// Export toàn bộ models ra ngoài
export default models;
