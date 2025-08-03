import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware.js";
import {
  getAllBusySlotsController,
  getBusySlotByIdController,
  createBusySlotController,
  updateBusySlotController,
  deleteBusySlotController,
  importBusySlotsFromJSONController,
  downloadTemplateController,
} from "../controllers/busyslotController.js";

const busySlotRoutes = express.Router();

/**
 * @route GET /api/busyslots/
 * @desc Lấy tất cả các khe thời gian bận có sẵn trong hệ thống.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
busySlotRoutes.get(
  "/getAll",
  authenticateAndAuthorize(["admin", "training_officer"]),
  getAllBusySlotsController
);

/**
 * @route GET /api/busyslots/:id
 * @desc Lấy thông tin chi tiết của một khe thời gian bận bằng ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
busySlotRoutes.get(
  "/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  getBusySlotByIdController
);

/**
 * @route POST /api/busyslots/add
 * @desc Tạo một khe thời gian bận mới.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
busySlotRoutes.post(
  "/create",
  authenticateAndAuthorize(["admin", "training_officer"]),
  createBusySlotController
);

/**
 * @route PUT /api/busyslots/edit/:id
 * @desc Cập nhật thông tin một khe thời gian bận bằng ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
busySlotRoutes.put(
  "/edit/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  updateBusySlotController
);

/**
 * @route DELETE /api/busyslots/delete/:id
 * @desc Xóa một khe thời gian bận bằng ID.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
busySlotRoutes.delete(
  "/delete/:id",
  authenticateAndAuthorize(["admin", "training_officer"]),
  deleteBusySlotController
);

/**
 * @route POST /api/busyslots/importJson
 * @desc Nhập dữ liệu khe thời gian bận từ dữ liệu JSON.
 * Yêu cầu quyền admin hoặc training_officer.
 * @access Private
 */
busySlotRoutes.post(
  "/importJson",
  authenticateAndAuthorize(["admin", "training_officer"]),
  importBusySlotsFromJSONController
);

/**
 * @route GET /api/busyslots/template/download
 * @desc Tải xuống template Excel cho khe thời gian bận.
 * @access Private
 */
busySlotRoutes.get(
  "/template/download",
  authenticateAndAuthorize(["admin", "training_officer"]),
  downloadTemplateController
);

export default busySlotRoutes;
