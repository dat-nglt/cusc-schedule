// web-app/backend/src/routes/scheduleRoutes.js

import { Router } from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js"; // Import middleware
import {
  generateScheduleController,
  downloadScheduleController,
  stopScheduleGenerationController,
  getInputDataForAlgorithmController,
  processResultsController,
} from "../controllers/scheduleController.js";

// Đây là hàm factory sẽ nhận đối tượng `io` và trả về một Express Router
const createScheduleRouter = (io) => {
  const router = Router();

  // Route POST để tạo thời khóa biểu
  router.post(
    "/generate",
    authenticateAndAuthorize(["admin", "training_officer"]), // Áp dụng middleware bảo mật
    (req, res) => generateScheduleController(req, res, io) // Truyền `io` vào controller
  );

  router.post(
    "/stop-ga",
    authenticateAndAuthorize(["admin", "training_officer"]), // Áp dụng middleware bảo mật
    (req, res) => stopScheduleGenerationController(req, res, io) // Truyền `io` vào controller
  );

  router.get(
    "/get-input-data",
    authenticateAndAuthorize(["admin", "training_officer"]),
    getInputDataForAlgorithmController
  );

  // Route GET để tải file kết quả
  router.get("/download/:filename", downloadScheduleController); // Không cần `io` ở đây
  router.post('/process-results', processResultsController);
  return router;
};

export default createScheduleRouter;
