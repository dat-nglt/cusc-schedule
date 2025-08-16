// web-app/backend/src/services/scheduleService.js

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js"; // Đảm bảo đường dẫn này đúng

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GA_ALGORITHM_DIR = path.join(__dirname, "../../../timetabling_GA");
const INPUT_DATA_FILENAME = "input_data.json";
const RESULTS_DIR_NAME = "results";

const INPUT_DATA_PATH = path.join(GA_ALGORITHM_DIR, INPUT_DATA_FILENAME);
const RESULTS_DIR = path.join(GA_ALGORITHM_DIR, RESULTS_DIR_NAME);

// Biến toàn cục để giữ tiến trình Python
let pythonProcess = null;
let pythonOutput = "";
let pythonError = "";
let currentResolve = null; // Lưu hàm resolve cho Promise
let currentReject = null; // Lưu hàm reject cho Promise

// Đảm bảo thư mục 'results' tồn tại
if (!fs.existsSync(RESULTS_DIR)) {
  logger.info(`Creating results directory: ${RESULTS_DIR}`);
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// --- Định nghĩa các giai đoạn tiến độ ---
const progressStages = {
  START: { start: 0, end: 0, message: "Đang khởi động thuật toán..." },
  LOADING_DATA: { start: 0, end: 5, message: "Đang tải dữ liệu đầu vào..." },
  PROCESSING_DATA: { start: 5, end: 10, message: "Đang tiền xử lý dữ liệu..." },
  INITIALIZING_POPULATION: {
    start: 10,
    end: 15,
    message: "Đang khởi tạo quần thể...",
  },
  RUNNING_GA: {
    start: 15,
    end: 80,
    message: "Đang chạy thuật toán di truyền...",
  },
  GENERATING_SEMESTER_SCHEDULE: {
    start: 80,
    end: 85,
    message: "Đang tạo lịch học kỳ...",
  },
  EXPORTING_EXCEL: { start: 85, end: 90, message: "Đang xuất file Excel..." },
  GENERATING_VIEWS: {
    start: 90,
    end: 95,
    message: "Đang tạo các chế độ xem lịch...",
  },
  COMPLETED: { start: 100, end: 100, message: "Hoàn thành!" },
  ABORTED: { start: 0, end: 0, message: "Tiến trình đã bị hủy." }, // Vẫn dùng ABORTED cho trường hợp bị ngắt
  ERROR: { start: 0, end: 0, message: "Đã xảy ra lỗi trong quá trình chạy." },
  STOPPING: { start: 0, end: 0, message: "Đang dừng thuật toán..." },
};

let currentStage = "START";
let currentProgress = 0;

// --- Hàm cập nhật trạng thái GA cho client qua Socket.IO ---
const emitGaStatus = (io, stage, message, progress) => {
  currentStage = stage;
  currentProgress = progress;
  io.emit("ga_status", { message, stage, progress: Math.round(progress) });
  logger.info(`GA Status: [${stage}] ${message} - ${Math.round(progress)}%`);
};

// --- Hàm xử lý dọn dẹp tiến trình và giải quyết Promise ---
const cleanupAndResolve = (io, code, killedByNode = false) => {
  if (pythonProcess) {
    pythonProcess.removeAllListeners(); // Dọn dẹp listener để tránh rò rỉ bộ nhớ
    pythonProcess = null;
  }

  if (killedByNode) {
    // Nếu bị Node.js chủ động kill
    logger.info("Python GA algorithm forcibly stopped by Node.js.");
    emitGaStatus(io, "ABORTED", progressStages.ABORTED.message, 0);
    if (currentResolve)
      currentResolve({
        message: "GA algorithm aborted by user.",
        aborted: true,
        pythonConsoleOutput: pythonOutput,
      });
  } else if (code === 0) {
    // Python tự thoát với mã 0 (hoàn thành bình thường)
    logger.info("Python GA algorithm finished successfully.");
    io.emit("ga_log", {
      type: "system",
      message: "Python process exited with code 0 (completed).",
    });
    emitGaStatus(io, "COMPLETED", progressStages.COMPLETED.message, 100);

    fs.readdir(RESULTS_DIR, (err, files) => {
      if (err) {
        logger.error("Error reading results directory:", err);
        io.emit("ga_error", {
          message: "Failed to retrieve GA results.",
          error: err.message,
        });
        if (currentReject)
          currentReject(new Error("Failed to retrieve GA results."));
      } else {
        const excelFiles = files.filter((file) => file.endsWith(".xlsx"));
        const jsonFiles = files.filter((file) => file.endsWith(".json"));
        if (currentResolve)
          currentResolve({
            excelFiles,
            jsonFiles,
            pythonConsoleOutput: pythonOutput,
          });
      }
    });
  } else {
    // Python thoát với mã lỗi
    logger.error(`Python GA algorithm exited with code ${code}.`);
    logger.error("Python full error output:", pythonError);
    io.emit("ga_error", {
      message: "GA algorithm failed or completed with errors.",
      error: pythonError,
      pythonConsoleOutput: pythonOutput,
    });
    emitGaStatus(io, "ERROR", progressStages.ERROR.message, currentProgress); // Cập nhật trạng thái lỗi
    if (currentReject)
      currentReject(new Error(`Python GA algorithm exited with code ${code}`));
  }

  currentResolve = null;
  currentReject = null;
};

// --- Hàm Service chính để chạy thuật toán Di truyền ---
export const runGeneticAlgorithm = (inputData, io) => {
  return new Promise((resolve, reject) => {
    if (pythonProcess) {
      logger.warn("GA process is already running. Please stop it first.");
      emitGaStatus(
        io,
        "ERROR",
        "Một tiến trình GA đang chạy. Vui lòng dừng lại trước.",
        currentProgress
      );
      return reject(new Error("GA process is already running."));
    }

    currentResolve = resolve;
    currentReject = reject;

    pythonOutput = "";
    pythonError = "";
    emitGaStatus(io, "START", progressStages.START.message, 0);

    // 1. Ghi dữ liệu đầu vào
    try {
      fs.writeFileSync(INPUT_DATA_PATH, JSON.stringify(inputData, null, 2));
      logger.info(`Input data saved to ${INPUT_DATA_PATH}`);
      io.emit("ga_log", {
        type: "system",
        message: `Input data saved to: ${INPUT_DATA_PATH}`,
      });
    } catch (writeErr) {
      logger.error("Error writing input_data.json:", writeErr);
      io.emit("ga_error", {
        message: "Failed to prepare input data for GA.",
        error: writeErr.message,
      });
      return reject(new Error("Failed to prepare input data for GA."));
    }

    logger.info("Attempting to run Python GA algorithm...");
    io.emit("ga_log", {
      type: "system",
      message: `Spawning Python process: ${path.join(
        GA_ALGORITHM_DIR,
        "main.py"
      )} with base_dir ${GA_ALGORITHM_DIR}`,
    });

    // Khởi tạo tiến trình Python, truyền GA_ALGORITHM_DIR làm đối số
    pythonProcess = spawn("python", [
      path.join(GA_ALGORITHM_DIR, "main.py"),
      GA_ALGORITHM_DIR, // Truyền thư mục gốc cho script Python
    ]);

    logger.info(`Python process started with PID: ${pythonProcess.pid}`);

    // --- Xử lý stdout của Python (Tiến độ và Log) ---
    pythonProcess.stdout.on("data", (data) => {
      const output = data.toString();
      pythonOutput += output;
      io.emit("ga_log", { type: "stdout", message: output }); // Gửi log thô cho client

      // 1. Phân tích cập nhật trạng thái chung (ví dụ: LOADING_DATA, PROCESSING_DATA)
      const statusMatch = output.match(/GA_STATUS:(\w+)/);
      if (statusMatch) {
        const status = statusMatch[1];
        if (progressStages[status]) {
          emitGaStatus(
            io,
            status,
            progressStages[status].message,
            progressStages[status].start
          );
          return;
        }
      }

      // 2. Phân tích tiến độ theo thế hệ (ví dụ: GA_PROGRESS_GENERATION:5/100)
      const generationProgressMatch = output.match(
        /GA_PROGRESS_GENERATION:(\d+)\/(\d+)/
      );
      if (generationProgressMatch) {
        const currentGeneration = parseInt(generationProgressMatch[1]);
        const maxGenerations = parseInt(generationProgressMatch[2]);

        const stageInfo = progressStages["RUNNING_GA"];
        if (stageInfo) {
          const stageRange = stageInfo.end - stageInfo.start;
          const progressInStage =
            (currentGeneration / maxGenerations) * stageRange;
          currentProgress = stageInfo.start + progressInStage;
          currentProgress = Math.min(
            stageInfo.end,
            Math.max(stageInfo.start, currentProgress)
          );

          emitGaStatus(
            io,
            "RUNNING_GA",
            `Đang chạy thuật toán di truyền: Thế hệ ${currentGeneration}/${maxGenerations}...`,
            currentProgress
          );
        }
        return;
      }

      // 3. Phân tích tiến độ nội bộ thế hệ (ví dụ: GA_PROGRESS_INTERNAL:5/100:20/50)
      const internalProgressMatch = output.match(
        /GA_PROGRESS_INTERNAL:(\d+)\/(\d+):(\d+)\/(\d+)/
      );
      if (internalProgressMatch) {
        const currentGeneration = parseInt(internalProgressMatch[1]);
        const maxGenerations = parseInt(internalProgressMatch[2]);
        const processedItems = parseInt(internalProgressMatch[3]);
        const totalItems = parseInt(internalProgressMatch[4]);

        const stageInfo = progressStages["RUNNING_GA"];
        if (stageInfo) {
          const currentGenerationFraction =
            (currentGeneration - 1) / maxGenerations;
          const internalGenerationFraction = processedItems / totalItems;

          const overallProgressFraction =
            currentGenerationFraction +
            internalGenerationFraction / maxGenerations;
          const stageRange = stageInfo.end - stageInfo.start;

          currentProgress =
            stageInfo.start + overallProgressFraction * stageRange;
          currentProgress = Math.min(
            stageInfo.end,
            Math.max(stageInfo.start, currentProgress)
          );

          emitGaStatus(
            io,
            "RUNNING_GA",
            `Đang chạy thuật toán di truyền: Thế hệ ${currentGeneration}/${maxGenerations} (${Math.round(
              internalGenerationFraction * 100
            )}% hoàn thành)...`,
            currentProgress
          );
        }
        return;
      }
    });

    // --- Xử lý stderr của Python (Lỗi) ---
    pythonProcess.stderr.on("data", (data) => {
      const error = data.toString();
      pythonError += error;
      logger.error(`Python stderr: ${error}`);
      io.emit("ga_log", { type: "stderr", message: error });
    });

    // --- Sự kiện đóng của tiến trình Python ---
    pythonProcess.on("close", (code) => {
      logger.info(`Python process exited with code ${code}`);
      // Kiểm tra xem tiến trình có bị kill bởi Node.js hay không
      // Nếu currentStage là "STOPPING", nghĩa là Node.js đã yêu cầu dừng
      cleanupAndResolve(io, code, currentStage === "STOPPING");
    });

    // --- Sự kiện lỗi của tiến trình Python (ví dụ: không thể khởi chạy) ---
    pythonProcess.on("error", (err) => {
      logger.error("Failed to spawn Python process:", err);
      io.emit("ga_log", {
        type: "system",
        message: `Failed to spawn Python process: ${err.message}`,
      });
      emitGaStatus(
        io,
        "ERROR",
        "Không thể khởi chạy tiến trình thuật toán. Đảm bảo Python đã được cài đặt và trong PATH.",
        0
      );

      if (pythonProcess) {
        pythonProcess.removeAllListeners();
        pythonProcess = null;
      }
      if (currentReject)
        currentReject(new Error("Failed to spawn Python process."));
    });
  });
};

// --- Hàm dừng thuật toán Di truyền (Đơn giản hơn) ---
export const stopGeneticAlgorithm = (io) => {
  if (pythonProcess && !pythonProcess.killed) {
    logger.info("Forcibly stopping Python GA process...");
    emitGaStatus(
      io,
      "STOPPING",
      progressStages.STOPPING.message,
      currentProgress
    );

    pythonProcess.kill("SIGKILL");
  } else {
    logger.warn("No GA process running to stop.");
    io.emit("ga_status", {
      message: "Không có tiến trình thuật toán nào đang chạy để dừng.",
      stage: "IDLE",
      progress: currentProgress,
    });
  }
};

export const getDownloadFilePath = (filename) => {
  return path.join(RESULTS_DIR, filename);
};

// Lấy trạng thái GA hiện tại (hữu ích khi client kết nối lại)
export const getCurrentGaStatus = () => {
  return {
    message: progressStages[currentStage].message,
    stage: currentStage,
    progress: Math.round(currentProgress),
  };
};

