import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js";
import {
    getUserNotificationsController,
    markNotificationsAsReadController
} from "../controllers/notificationController.js";

const notificationRoutes = express.Router();
// Lấy thông báo của người dùng
notificationRoutes.get(
    "/userNotifications",
    authenticateAndAuthorize(["admin", "training_officer", "lecturer", "student"]),
    getUserNotificationsController
);

// Đánh dấu thông báo đã đọc
notificationRoutes.post(
    "/markAsRead",
    authenticateAndAuthorize(["admin", "training_officer", "lecturer", "student"]),
    markNotificationsAsReadController
);

export default notificationRoutes;