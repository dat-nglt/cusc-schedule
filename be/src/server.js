import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";

import logger from "./utils/logger.js";
import setupRoutes from "./routes/router.js";
import connectDB from "./config/connectDB.js";
import models from "./models/index.js";
import configurePassport from "./config/passport.js";

dotenv.config();

const app = express();
const serverIO = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(serverIO, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

async function startServer() {
  try {
    await connectDB(models);

    configurePassport();
    logger.info("✅ Passport has been configured.");

    app.use(
      morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
      })
    );
    logger.info("✅ Middleware Morgan for HTTP request logging configured.");

    io.on("connection", (socket) => {
      logger.info(`⚡️ Client connected: ${socket.id}`);
      socket.emit("message", "Welcome to the Timetable GA Server!"); // Gửi tin nhắn chào mừng
      socket.on("disconnect", () => {
        logger.warn(`🔌 Client disconnected: ${socket.id}`);
      });
      // Có thể thêm các event listener khác từ client tại đây
    });
    logger.info(
      "✅ Socket.IO server configured and listening for connections."
    );

    app.use(
      session({
        secret:
          process.env.SESSION_SECRET || "super-secret-key-please-change-me",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === "production" },
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    logger.info("✅ Middleware Session and Passport have been configured.");

    // Cấu hình các Middleware chung
    app.use(
      cors({
        origin: process.env.FRONTEND_URL, // Hoặc một mảng các origins được phép
        credentials: true, // RẤT QUAN TRỌNG để cho phép gửi/nhận cookies
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"], // Các headers bạn cho phép
      })
    );
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Cấu hình Router
    setupRoutes(app, io);
    logger.info("✅ Router has been setup.");

    serverIO.listen(PORT, () => {
      logger.info(
        `✅ Server is running on port ${PORT} (${
          process.env.NODE_ENV || "development"
        } environment)`
      );
    });

    // 10. Tăng socket timeout cho Node.js server (quan trọng cho các tác vụ dài)
    serverIO.setTimeout(600000); // 10 phút
    logger.info("✅ Server socket timeout set to 10 minutes.");
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Gọi hàm khởi động server
startServer();
