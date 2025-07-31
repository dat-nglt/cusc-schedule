import express from "express";
// Import middleware xác thực và phân quyền
import authMiddleware, {
  authenticateAndAuthorize,
} from "../middleware/authMiddleware.js"; // Thêm .js nếu là ES Modules

// Import controller của bạn
// Lưu ý: generateScheduleController sẽ cần được điều chỉnh để chấp nhận `io`
import { generateScheduleController } from "../controllers/scheduleController.js";

// Đây là hàm factory sẽ nhận đối tượng `io` và trả về một Express Router
const createScheduleRouter = (io) => {
  const scheduleRoutes = express.Router();

  // Định nghĩa route POST cho việc tạo thời khóa biểu
  // Truyền đối tượng `io` vào controller thông qua một hàm middleware trung gian
  scheduleRoutes.post(
    "/generate",
    authenticateAndAuthorize(["admin", "training_officer"]),
    (req, res, next) => generateScheduleController(req, res, io, next) // <-- Thay đổi chính ở đây
  );

  // Nếu có các routes khác liên quan đến schedule (ví dụ: download), bạn có thể thêm vào đây
  // Ví dụ: import { downloadScheduleController } from "../controllers/scheduleController.js";
  // scheduleRoutes.get("/download/:filename", downloadScheduleController);

  return scheduleRoutes;
};

export default createScheduleRouter; // Export hàm factory thay vì Router trực tiếp
