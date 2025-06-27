import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'; // Cài đặt: npm install dotenv

// Tải biến môi trường từ tệp .env
dotenv.config();

// Lấy thông tin cấu hình từ biến môi trường
// Cung cấp giá trị mặc định an toàn cho môi trường phát triển
const DB_NAME = process.env.DB_NAME || 'cusc_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '123';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10); // Đảm bảo là số nguyên

// Khởi tạo Sequelize
const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    // Bật logging chỉ trong môi trường phát triển
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL successfully connected to Sequelize.');
    // await sequelize.sync({ force: false });
    console.log('✅ The database has been synchronized successfully.');
  } catch (error) {
    console.error('❌ Database connection or synchronization error:', error.message);
    // In ra toàn bộ đối tượng lỗi để gỡ lỗi chi tiết hơn
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    process.exit(1); // Thoát ứng dụng với mã lỗi
  }
};

const DataTypes = Sequelize.DataTypes;

export { sequelize, DataTypes };
export default connectDB;