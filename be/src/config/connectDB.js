// config/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../utils/logger"; // Đảm bảo đường dẫn đến logger đúng

dotenv.config(); // Tải các biến môi trường từ file .env

// Lấy thông tin cấu hình cơ sở dữ liệu từ biến môi trường
// Cung cấp giá trị mặc định để dễ dàng chạy trong môi trường cục bộ nếu biến môi trường không được thiết lập
const DB_NAME = process.env.DB_NAME || "cusc_db";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "123";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10); // Chuyển đổi port sang số nguyên

// Khởi tạo Sequelize instance với các thông số kết nối
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres", // Chỉ định loại cơ sở dữ liệu là PostgreSQL
    // Tùy chọn logging: chỉ hiển thị các truy vấn SQL ra console trong môi trường phát triển
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    // Cấu hình pool kết nối để quản lý hiệu quả các kết nối database
    pool: {
        max: 5, // Số lượng kết nối tối đa trong pool
        min: 0, // Số lượng kết nối tối thiểu trong pool
        acquire: 30000, // Thời gian tối đa (ms) để cố gắng lấy kết nối trước khi lỗi
        idle: 10000, // Thời gian tối đa (ms) mà một kết nối có thể không hoạt động trước khi bị đóng
    },
});

/**
 * Hàm thiết lập kết nối đến cơ sở dữ liệu và đồng bộ hóa schema.
 *
 * @param {Object} models - Đối tượng chứa các models của Sequelize và instance sequelize (thường là db/index.js).
 */
const connectDB = async (models) => {
    try {
        // Kiểm tra kết nối đến cơ sở dữ liệu
        await sequelize.authenticate();

        logger.info("✅ Kết nối PostgreSQL với Sequelize thành công.");
        logger.info("✅ Kết nối cơ sở dữ liệu thành công.");

        // ĐỒNG BỘ CƠ SỞ DỮ LIỆU (chỉ trong môi trường phát triển)
        // `alter: true` sẽ cố gắng thực hiện các thay đổi cần thiết trong DB để phù hợp với models
        // if (process.env.NODE_ENV === "development") {
        //     // Đảm bảo đối tượng models và instance sequelize có sẵn trước khi đồng bộ hóa
        //     if (models && models.sequelize) {
        //         await models.sequelize.sync({ alter: true }); // Sử dụng instance sequelize từ đối tượng models đã truyền vào
        //         logger.info("✅ Schema cơ sở dữ liệu đã được đồng bộ hóa (Chế độ phát triển).");
        //     } else {
        //         logger.warn(
        //             "⚠️ Không tìm thấy đối tượng models hoặc instance sequelize để đồng bộ hóa. Bỏ qua đồng bộ hóa schema."
        //         );
        //     }
        // }
    } catch (error) {
        // Ghi lại lỗi kết nối hoặc đồng bộ hóa
        logger.error(`❌ Lỗi kết nối hoặc đồng bộ hóa cơ sở dữ liệu: ${error.message}`);
        if (process.env.NODE_ENV === "development") {
            logger.error(error); // Ghi chi tiết lỗi trong môi trường phát triển
        }
        // Thoát ứng dụng với mã lỗi nếu kết nối thất bại nghiêm trọng
        process.exit(1);
    }
};

// Xuất DataTypes từ Sequelize để dễ dàng truy cập khi định nghĩa models
const DataTypes = Sequelize.DataTypes;

export { sequelize, DataTypes };
export default connectDB;