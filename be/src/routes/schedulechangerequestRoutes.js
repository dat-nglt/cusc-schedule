import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js"; // Đảm bảo import .js extension nếu dùng ES Modules
import {
    getAllScheduleChangeRequestController,
    createScheduleChangeRequestController,
    approveScheduleChangeRequestController,
    rejectScheduleChangeRequestController,
} from "../controllers/schedulechangerequestController.js"
const schedulechangerequestRouter = express.Router();

schedulechangerequestRouter.get("/getAll", authenticateAndAuthorize(["admin", "training_officer"]), getAllScheduleChangeRequestController);
schedulechangerequestRouter.post("/create", authenticateAndAuthorize(["admin", "lecturer"]), createScheduleChangeRequestController);
schedulechangerequestRouter.put("/approve/:requestId", authenticateAndAuthorize(["admin"]), approveScheduleChangeRequestController);
schedulechangerequestRouter.put("/reject/:requestId", authenticateAndAuthorize(["admin"]), rejectScheduleChangeRequestController);

export default schedulechangerequestRouter;