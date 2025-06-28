"use strict"; // Kích hoạt chế độ nghiêm ngặt của JavaScript

import fs from "fs"; // Xử lý hệ thống file
import path from "path"; // Xử lý đường dẫn file
import { Sequelize } from "sequelize"; // Thư viện ORM Sequelize
import dotenv from "dotenv"; // Tải biến môi trường từ .env
dotenv.config();

const basename = path.basename(import.meta.url);

const env = process.env.NODE_ENV || "development";

const db = {};

let sequelize; // Biến lưu trữ instance của Sequelize.

const requiredEnvVars = [
  "DB_DATABASE",
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_DIALECT",
  "DB_PORT",
];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(
      `Lỗi: Biến môi trường '${varName}' chưa được định nghĩa trong .env`
    );
    process.exit(1);
  }
}

// Khởi tạo Sequelize trực tiếp với các giá trị từ process.env.
// Đảm bảo DB_PORT được chuyển đổi thành số nguyên.
sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: parseInt(process.env.DB_PORT, 10),
    logging: console.log, // Để hiển thị các truy vấn SQL trong console (debug)
    timezone: '+07:00', // Đặt múi giờ cho database
  }
);

// --- Tải Models ---
// Đọc tất cả các file .js trong thư mục hiện tại (trừ file này và các file test).
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Bỏ qua file ẩn
      file !== basename && // Bỏ qua chính file index.js
      file.slice(-3) === ".js" && // Chỉ lấy file JavaScript
      file.indexOf(".test.js") === -1 // Bỏ qua file test
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// --- Định nghĩa liên kết giữa các Models ---
// Duyệt qua tất cả các model đã tải.
Object.keys(db).forEach((modelName) => {
  // Nếu model có phương thức 'associate', gọi nó để định nghĩa các mối quan hệ (associations).
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// --- Export các đối tượng Sequelize ---
// Gán instance Sequelize và class Sequelize vào đối tượng 'db' để dễ dàng truy cập từ bên ngoài.
db.sequelize = sequelize; // Instance Sequelize đã kết nối
db.Sequelize = Sequelize; // Class Sequelize (để truy cập DataTypes, Op, v.v.)

// Export đối tượng 'db' làm export mặc định của module này (cú pháp ES6 Modules).
export default db;
