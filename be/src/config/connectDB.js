// config/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

// Lấy thông tin cấu hình từ biến môi trường
const DB_NAME = process.env.DB_NAME || "cusc_db";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "123";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);

// Khởi tạo Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async (models) => {
  try {
    await sequelize.authenticate();
    logger.info("✅ PostgreSQL successfully connected to Sequelize."); // Changed from console.log
    logger.info("✅ Database connection successfully.");

    // ĐỒNG BỘ CƠ SỞ DỮ LIỆU
    // if (process.env.NODE_ENV === "development") {
    //   if (models && models.sequelize) {
    //     // Ensure models and sequelize instance are available
    //     await models.sequelize.sync({ alter: true }); // Use models.sequelize from the passed models object
    //     logger.info("✅ Database schema synchronized (Development Mode)."); // Changed from console.log
    //   } else {
    //     logger.warn(
    //       // Changed from console.warn
    //       "⚠️ Models object or sequelize instance not found for synchronization."
    //     );
    //   }
    // }
  } catch (error) {
    logger.error(
      // Changed from console.error
      "❌ Database connection or synchronization error:",
      error.message
    );
    if (process.env.NODE_ENV === "development") {
      logger.error(error); // Changed from console.error
    }
    process.exit(1);
  }
};

const DataTypes = Sequelize.DataTypes;

export { sequelize, DataTypes };
export default connectDB;
