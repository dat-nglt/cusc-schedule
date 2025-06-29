// app.js (hoặc server.js)
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import morgan from "morgan"; // Import Morgan
import logger from "./utils/logger.js"; // Import logger đã cấu hìnhwinston-daily-rotate-file'
import setupRoutes from "./routes/router.js";
import connectDB from "./config/connectDB.js";
import configurePassport from "./config/passport.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    configurePassport();
    logger.info("✅ Passport has been configured.");

    app.use(
      morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
      })
    );
    logger.info("✅ Middleware Morgan for HTTP request logging configured.");

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
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Cấu hình Router
    setupRoutes(app);
    logger.info("✅ Router has been setup.");

    // Khởi động Server
    app.listen(PORT, () => {
      logger.info(
        `✅ Server is running on port ${PORT} (${process.env.NODE_ENV || "development"
        } environment)`
      );
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Gọi hàm khởi động server
startServer();
