import { sequelize } from '../config/connectDB';
const fs = require('fs');
const path = require('path');

const db = {};

// Danh sách file cần loại trừ (đã được quản lý trong User.js)
const excludedFiles = ['Student.js', 'Lecturer.js', 'Admin.js', 'TrainingOfficer.js'];

fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== 'index.js' &&
    file.slice(-3) === '.js' &&
    !excludedFiles.includes(file) // Bỏ qua các file đã loại trừ
  )
  .forEach(file => {
    try {
      const modelModule = require(path.join(__dirname, file));
      const model = modelModule.default;
      if (!model || typeof model !== 'function' || !model.name) {
        console.error(`Invalid model export in file: ${file}. Model or name property is missing.`);
        return;
      }
      db[model.name] = model;
    } catch (error) {
      console.error(`Error loading model from file ${file}:`, error);
    }
  });

db.sequelize = sequelize;

// Thiết lập các quan hệ
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log('Loaded models:', Object.keys(db));

export default db;
