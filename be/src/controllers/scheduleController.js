// web-app/backend/src/controllers/scheduleController.js

import {
  runGeneticAlgorithm,
  getDownloadFilePath,
  stopGeneticAlgorithm,
  getInputDataForAlgorithmService,
  processAndSaveResults,
  getDistinctScheduleEntities,
} from "../services/scheduleService.js";
import logger from "../utils/logger.js";
import fs from "fs";

export const getDataForFilterScheduleController = async (req, res) => {
  try {
    const result = await getDistinctScheduleEntities();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Xử lý lỗi và trả về phản hồi lỗi
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller để tạo thời khóa biểu
// Nhận `io` để gửi thông báo qua WebSocket
export const generateScheduleController = async (req, res, io) => {
  // Bỏ `next` nếu không dùng
  const inputDataFromFrontend = req.body;

  res.status(202).json({
    success: true,
    message: "Yêu cầu khởi tạo thời khóa biểu đã được nhận và đang xử lý...",
  });

  // Bắt đầu quá trình GA trong nền
  try {
    io.emit("ga_status", {
      message: "Bắt đầu khởi tạo thời khoá biểu...",
      stage: "INIT",
      progress: 0,
    });

    const result = await runGeneticAlgorithm(inputDataFromFrontend, io);

    io.emit("ga_status", {
      message: "dd!",
      stage: "COMPLETED",
      progress: 100,
      excelFiles: result.excelFiles,
      jsonFiles: result.jsonFiles,
    });
    logger.info(
      "GA process completed successfully and results sent via WebSocket."
    );
  } catch (error) {
    logger.error("Error during GA process:", error);
    io.emit("ga_error", {
      message:
        error.message || "An unexpected error occurred during GA generation.",
      details: error.toString(),
    });
  }
};

export const stopScheduleGenerationController = (req, res, io) => {
  stopGeneticAlgorithm(io); // Giả sử bạn có hàm này để dừng GA
  res.status(200).json({ message: "Quá trình tạo thời khóa biểu đã dừng." });
};

// Controller để tải file kết quả
export const downloadScheduleController = (req, res) => {
  const filename = req.params.filename;
  const filePath = getDownloadFilePath(filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      logger.error(`File not found for download: ${filePath}`, err);
      return res
        .status(404)
        .json({ success: false, message: "File không tìm thấy." });
    }
    res.download(filePath, (downloadErr) => {
      if (downloadErr) {
        logger.error("Error during file download:", downloadErr);
        // Kiểm tra nếu lỗi là do "Headers already sent", có nghĩa là client đã ngắt kết nối
        if (downloadErr.code === "ERR_STREAM_WRITE_AFTER_END") {
          logger.warn("Client disconnected during file download.");
        } else {
          res
            .status(500)
            .json({ success: false, message: "Lỗi khi tải file." });
        }
      } else {
        logger.info(`File ${filename} downloaded successfully.`);
      }
    });
  });
};

export const getInputDataForAlgorithmController = async (req, res) => {
  try {
    const inputData = await getInputDataForAlgorithmService();
  } catch (error) {}
};

export const processResultsController = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      processAndSaveResults(null, resolve, reject);
    });
    // Nếu promise resolve thành công, gửi phản hồi thành công về client.
    logger.info("Quá trình xử lý và lưu trữ kết quả hoàn tất.");
    res.status(200).json({
      success: true,
      message:
        "Quá trình xử lý và lưu trữ kết quả lịch học đã hoàn tất thành công.",
    });
  } catch (error) {
    // Nếu có lỗi xảy ra, gửi phản hồi lỗi về client.
    logger.error("Lỗi khi xử lý yêu cầu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý yêu cầu.",
      error: error.message,
    });
  }
};
