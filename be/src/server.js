import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import setupRoutes from "./routes/router.js";
// import bodyParser from "body-parser"; // Không cần thiết nếu dùng express.json() và express.urlencoded()
import connectDB from "./config/database.js";
import passport from "passport";
import session from "express-session";

// Tải biến môi trường ngay lập tức
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Khai báo PORT duy nhất tại đây

async function startServer() {
  try {
    // 1. Kết nối cơ sở dữ liệu
    await connectDB();
    console.log('✅ Kết nối CSDL thành công.');

    // 2. Khởi tạo Models và Passport config SAU KHI CSDL được kết nối
    // Đảm bảo models và passport có thể tương tác với DB nếu cần
    await import("./models/index.js");
    await import("./config/passport.js");
    console.log('✅ Models and Passport have been configured.');

    // 3. Cấu hình Session và Passport Middleware (Thứ tự quan trọng: Session trước Passport)
    app.use(session({
      secret: process.env.SESSION_SECRET || 'super-secret-key-please-change-me', // Sử dụng secret mạnh hơn
      resave: false,
      saveUninitialized: true,
      cookie: { secure: process.env.NODE_ENV === 'production' } // Kích hoạt secure cookie trong production
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    console.log('✅ Middleware Session and Passport have been configured.');

    // 4. Cấu hình các Middleware chung
    app.use(cors()); // Cho phép Cross-Origin Requests
    app.use(express.json()); // Xử lý body dạng JSON
    app.use(express.urlencoded({ extended: true })); // Xử lý body dạng URL-encoded (extended: true cho phép đối tượng lồng nhau)
    // console.log('✅ Middleware CORS, JSON, URL-encoded đã được cấu hình.');

    // 5. Cấu hình Router
    setupRoutes(app);
    console.log('✅ Router has been setup.');

    // 6. Khởi động Server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT} (${process.env.NODE_ENV || 'development'} environment)`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error); // In ra toàn bộ lỗi trong môi trường dev để dễ gỡ lỗi
    }
    process.exit(1); // Thoát ứng dụng với mã lỗi
  }
}

// Gọi hàm khởi động server
startServer();