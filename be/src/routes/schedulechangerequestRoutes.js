import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js"; // Đảm bảo import .js extension nếu dùng ES Modules
import {
    getAllScheduleChangeRequestController,
    createScheduleChangeRequestController,
} from "../controllers/schedulechangerequestController.js"
const schedulechangerequestRouter = express.Router();

schedulechangerequestRouter.get("/getAll", authenticateAndAuthorize(["admin", "training_officer"]), getAllScheduleChangeRequestController);
schedulechangerequestRouter.post("/create", authenticateAndAuthorize(['leturer']), createScheduleChangeRequestController);

export default schedulechangerequestRouter;