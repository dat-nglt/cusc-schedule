// config/logger.js
import winston from "winston";
import "winston-daily-rotate-file"; // Để xoay vòng log file hàng ngày
import dotenv from "dotenv";

dotenv.config();

const { combine, timestamp, printf, colorize } = winston.format;

// Định dạng log tùy chỉnh
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  // Cấp độ log mặc định nếu không được chỉ định
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    // Transport cho Console (luôn bật trong dev, có thể tắt trong prod)
    new winston.transports.Console({
      format: combine(
        colorize(), // Tô màu cho log trên console
        logFormat
      ),
      level: process.env.NODE_ENV === "development" ? "debug" : "info",
    }),

    // Transport để ghi log lỗi vào file riêng
    new winston.transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log", // File log lỗi, xoay vòng hàng ngày
      datePattern: "YYYY-MM-DD",
      zippedArchive: true, // Nén các log cũ
      maxSize: "20m", // Kích thước tối đa của file log trước khi tạo file mới
      maxFiles: "14d", // Giữ log trong 14 ngày
      level: "error", // Chỉ ghi các log có cấp độ 'error'
    }),

    // Transport để ghi tất cả log (info, warn, error, debug) vào file riêng
    new winston.transports.DailyRotateFile({
      filename: "logs/combined-%DATE%.log", // File log chung, xoay vòng hàng ngày
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info", // Ghi tất cả log từ cấp độ 'info' trở lên
    }),
  ],
  // Xử lý lỗi không bắt được (uncaught exceptions)
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  // Xử lý các Promise bị từ chối không được xử lý (unhandled rejections)
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

export default logger;
