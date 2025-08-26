// web-app/backend/src/services/scheduleService.js

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import models from "../models/index.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const BACKEND_DIR = path.join(__dirname, '../..');;

// Cấu hình đường dẫn và file
const CONFIG = {
  // Đường dẫn đến thư mục thuật toán vẫn như cũ
  GA_ALGORITHM_DIR: path.join(BACKEND_DIR, "../timetabling_GA"),

  // Đường dẫn đến thư mục kết quả NẰM BÊN TRONG BACKEND
  RESULTS_DIR: path.join(BACKEND_DIR, "results"),

  INPUT_DATA_FILENAME: "input_data.json",
  PYTHON_SCRIPT: "main.py",
};

// Định nghĩa các giai đoạn tiến độ của thuật toán
const PROGRESS_STAGES = {
  START: { progress: 0, message: "Đang khởi động thuật toán..." },
  LOADING_DATA: { progress: 5, message: "Đang tải dữ liệu đầu vào..." },
  PROCESSING_DATA: { progress: 10, message: "Đang tiền xử lý dữ liệu..." },
  INITIALIZING_POPULATION: {
    progress: 15,
    message: "Đang khởi tạo quần thể...",
  },
  RUNNING_GA: { progress: 20, message: "Đang chạy thuật toán di truyền..." },
  GENERATING_SEMESTER_SCHEDULE: {
    progress: 85,
    message: "Đang tạo lịch học kỳ...",
  },
  EXPORTING_EXCEL: { progress: 90, message: "Đang xuất file Excel..." },
  GENERATING_VIEWS: {
    progress: 95,
    message: "Đang tạo các chế độ xem lịch...",
  },
  COMPLETED: { progress: 100, message: "Hoàn thành!" },
  ABORTED: { progress: 0, message: "Tiến trình đã bị hủy." },
  ERROR: { progress: 0, message: "Đã xảy ra lỗi trong quá trình chạy." },
  STOPPING: { progress: 0, message: "Đang dừng thuật toán..." },
  IDLE: { progress: 0, message: "Sẵn sàng nhận yêu cầu mới." },
};

// Biến trạng thái toàn cục để quản lý tiến trình
let pythonProcess = null;
let outputBuffer = "";
let errorBuffer = "";
let currentStage = "IDLE";
let currentProgress = 0;
let currentResolve = null;
let currentReject = null;
let currentSemesterInfo = null;
const {
  Account,
  Semester,
  Program,
  Subject,
  Room,
  Lecturer,
  Course,
  BreakSchedule,
  BusySlot,
  Classes,
  TimeSlot,
  ClassSchedule, // Import the ClassSchedule model
  sequelize
} = models;

export const getInputDataForAlgorithmService = async () => {
  try {
    console.log("🚀 [Service] Bắt đầu lấy dữ liệu đầu vào cho thuật toán...");

    // 1. Lớp học
    const classes = await Classes.findAll();
    console.log("✅ [Service] Classes:", classes.length);

    // 2. Chương trình đào tạo kèm học kỳ + môn học
    const programs = await Program.findAll({
      include: [
        {
          model: Semester,
          as: "semesters",
          include: [
            { model: Subject, as: "subjects", attributes: ["subject_id"] },
          ],
        },
      ],
    });
    console.log("✅ [Service] Programs:", programs.length);

    // 3. Học kỳ (độc lập)
    const semesters = await Semester.findAll({
      include: [{ model: Subject, as: "subjects", attributes: ["subject_id"] }],
    });
    console.log("✅ [Service] Semesters:", semesters.length);

    // 4. Phòng học
    const rooms = await Room.findAll();
    console.log("✅ [Service] Rooms:", rooms.length);

    // 5. Giảng viên
    const lecturers = await Lecturer.findAll({
      include: [{ model: Subject, as: "subjects", attributes: ["subject_id"] }],
    });
    console.log("✅ [Service] Lecturers:", lecturers.length);

    // 6. Môn học
    const subjects = await Subject.findAll();
    console.log("✅ [Service] Subjects:", subjects.length);

    // 7. Khung giờ học
    const timeSlots = await TimeSlot.findAll();
    console.log("✅ [Service] TimeSlots:", timeSlots.length);

    // --- Chuẩn hóa dữ liệu ---
    const formattedClasses = classes.map((c) => ({
      class_id: c.class_id,
      size: c.class_size,
      program_id: c.program_id,
    }));

    const formattedPrograms = programs.map((p) => ({
      program_id: p.program_id,
      program_name: p.program_name,
      duration: p.duration,
      semesters: (p.semesters || []).map((s) => ({
        semester_id: s.semester_id,
        subject_ids: (s.subjects || []).map((subj) => subj.subject_id),
      })),
    }));

    const formattedSemesters = semesters.map((s) => ({
      semester_id: s.semester_id,
      subject_ids: (s.subjects || []).map((subj) => subj.subject_id),
      start_date: s.start_date,
      end_date: s.end_date,
      duration_weeks: s.duration_weeks,
    }));

    const formattedRooms = rooms.map((r) => ({
      room_id: r.room_id,
      type: r.type, // "theory" | "practice"
      capacity: r.capacity,
    }));

    const formattedLecturers = lecturers.map((l) => ({
      lecturer_id: l.lecturer_id,
      lecturer_name: l.lecturer_name,
      subjects: (l.subjects || []).map((s) => s.subject_id),
      busy_slots: l.busy_slots || [],
      semester_busy_slots: l.semester_busy_slots || [],
    }));

    const formattedSubjects = subjects.map((s) => ({
      subject_id: s.subject_id,
      name: s.name,
      theory_hours: s.theory_hours,
      practice_hours: s.practice_hours,
    }));

    const formattedTimeSlots = timeSlots.map((t) => ({
      slot_id: t.slot_id,
      start: t.start,
      end: t.end,
      type: t.type,
    }));

    // --- Kết quả cuối cùng ---
    const result = {
      classes: formattedClasses,
      rooms: formattedRooms,
      lecturers: formattedLecturers,
      programs: formattedPrograms,
      semesters: formattedSemesters,
      subjects: formattedSubjects,
      time_slots: formattedTimeSlots,
    };

    console.log("🎯 [Service] Dữ liệu đầu vào cuối cùng:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("❌ [Service] Lỗi khi lấy dữ liệu đầu vào:", error);
    throw error;
  }
};

/**
 * Lấy đường dẫn đến thư mục kết quả
 */
const getResultsDir = () => CONFIG.RESULTS_DIR;

/**
 * Lấy đường dẫn đến file input data
 */
const getInputDataPath = () =>
  path.join(CONFIG.GA_ALGORITHM_DIR, CONFIG.INPUT_DATA_FILENAME);

/**
 * Đảm bảo thư mục kết quả tồn tại, tạo mới nếu chưa có
 */
const ensureResultsDirectory = () => {
  const resultsDir = getResultsDir();
  if (!fs.existsSync(resultsDir)) {
    logger.info(`Tạo thư mục kết quả: ${resultsDir}`);
    fs.mkdirSync(resultsDir, { recursive: true });
  }
};

/**
 * Gửi trạng thái cập nhật tới client qua Socket.IO
 */
const emitStatus = (io, stage, message, progress) => {
  currentStage = stage;
  currentProgress = progress;
  const statusData = {
    message,
    stage,
    progress: Math.round(progress),
    timestamp: new Date().toISOString(),
  };

  io.emit("ga_status", statusData);
  logger.info(`GA Status: [${stage}] ${message} - ${Math.round(progress)}%`);
  return statusData;
};

/**
 * Gửi thông tin lỗi tới client
 */
const emitError = (io, message, error = null) => {
  const errorData = {
    message,
    error: error ? error.message : null,
    pythonConsoleOutput: outputBuffer,
    timestamp: new Date().toISOString(),
  };
  io.emit("ga_error", errorData);
  logger.error(message, error || "");
};

/**
 * Dọn dẹp tài nguyên và giải quyết promise
 */
const cleanupAndResolve = (io, code, killedByUser = false) => {
  if (pythonProcess) {
    pythonProcess.removeAllListeners();
    pythonProcess = null;
  }

  if (killedByUser) {
    logger.info("Thuật toán Python đã bị dừng bởi người dùng.");
    emitStatus(io, "ABORTED", PROGRESS_STAGES.ABORTED.message, 0);
    if (currentResolve) {
      currentResolve({
        message: "Thuật toán đã bị dừng bởi người dùng.",
        aborted: true,
        pythonConsoleOutput: outputBuffer,
        timestamp: new Date().toISOString(),
      });
    }
  } else if (code === 0) {
    handleSuccess(io);
  } else {
    handleFailure(io, code);
  }

  currentResolve = null;
  currentReject = null;
  currentSemesterInfo = null;
};

/**
 * Xử lý khi thuật toán chạy thành công
 */
const handleSuccess = (io) => {
  logger.info("Thuật toán Python chạy thành công.");
  emitStatus(io, "COMPLETED", PROGRESS_STAGES.COMPLETED.message, 100);
  // This now calls the async version which includes saving to the DB
};

/**
 * Xử lý khi thuật toán thất bại
 */
const handleFailure = (io, code) => {
  logger.error(`Thuật toán Python thoát với mã lỗi ${code}.`);
  logger.error("Chi tiết lỗi:", errorBuffer);
  emitError(
    io,
    "Thuật toán thất bại hoặc hoàn thành với lỗi.",
    new Error(`Process Python thoát với mã ${code}`)
  );
  emitStatus(io, "ERROR", PROGRESS_STAGES.ERROR.message, currentProgress);
  if (currentReject) {
    currentReject(new Error(`Thuật toán Python thoát với mã ${code}`));
  }
};

/**
 * [MỚI] Đọc file JSON kết quả và lưu vào DB (ClassSchedule)
 * @param {string} jsonFilePath - Đường dẫn file JSON kết quả
 */
export const processAndSaveResults = async (io, resolve, reject) => {
  // Bắt đầu một transaction
  const t = await sequelize.transaction();

  try {
    const files = await fs.promises.readdir(getResultsDir());
    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    const excelFiles = files.filter((file) => file.endsWith(".xlsx"));

    // Ưu tiên file combined_timetables.json nếu có
    const targetJsonFile = jsonFiles.find(f => f === "combined_timetables.json") || jsonFiles[0];

    if (targetJsonFile) {
      const jsonFilePath = path.join(getResultsDir(), targetJsonFile);
      logger.info(`Phát hiện file JSON. Bắt đầu lưu vào DB từ: ${jsonFilePath}`);

      // Bắt đầu logic của saveClassSchedulesToDb
      const rawData = fs.readFileSync(jsonFilePath, "utf-8");
      const data = JSON.parse(rawData);

      if (!data.semesters || !Array.isArray(data.semesters)) {
        logger.error("File JSON không đúng định dạng.");
        await t.rollback();
        reject(new Error("File JSON không đúng định dạng."));
        return;
      }

      let totalInserted = 0;
      const semesterIdsInFile = data.semesters.map(s => s.semester_id).filter(id => id);

      if (semesterIdsInFile.length > 0) {
        const deletedRows = await ClassSchedule.destroy({
          where: { semester_id: semesterIdsInFile },
          transaction: t
        });
        logger.info(`Đã xóa ${deletedRows} lịch học cũ của ${semesterIdsInFile.length} học kỳ.`);
      }

      const allLessonsToInsert = [];
      for (const semester of data.semesters) {
        const semesterId = semester.semester_id;
        if (!semesterId) continue;

        if (semester.classes && Array.isArray(semester.classes)) {
          for (const classObj of semester.classes) {
            if (classObj.schedule && Array.isArray(classObj.schedule)) {
              classObj.schedule.forEach(lesson => {
                if (lesson.date) {
                  allLessonsToInsert.push({
                    semester_id: lesson.semester_id || semesterId,
                    class_id: lesson.class_id || classObj.id || null,
                    program_id: lesson.program_id || null,
                    slot_id: lesson.slot_id || null,
                    subject_id: lesson.subject_id || null,
                    room_id: lesson.room_id || null,
                    lecturer_id: lesson.lecturer_id || null,
                    date: lesson.date,
                    lesson_id: lesson.lesson_id || null,
                    lesson_type: lesson.lesson_type || null,
                    group_id: lesson.group_id || null,
                    day: lesson.day || null,
                    week: lesson.week || null,
                    size: lesson.size || null
                  });
                }
              });
            }
          }
        }
      }

      if (allLessonsToInsert.length > 0) {
        await ClassSchedule.bulkCreate(allLessonsToInsert, { transaction: t });
        totalInserted = allLessonsToInsert.length;
        logger.info(`Thêm thành công ${totalInserted} lịch học mới vào DB.`);
      } else {
        logger.info("Không có lịch học nào để thêm.");
      }
    } else {
      logger.warn("Không tìm thấy file JSON kết quả nào để lưu vào DB.");
    }

    // Nếu mọi thứ thành công, commit transaction
    await t.commit();
    logger.info(`[HOÀN TẤT] Transaction thành công.`);

    resolve({
      excelFiles,
      jsonFiles,
      pythonConsoleOutput: outputBuffer, // Đảm bảo biến này tồn tại trong phạm vi
      totalFiles: excelFiles.length + jsonFiles.length,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    // Nếu có lỗi, rollback transaction
    await t.rollback();
    logger.error("Lỗi khi xử lý kết quả. Đã rollback transaction:", err);
    reject(new Error("Không thể xử lý kết quả từ thuật toán."));
  }
};

/**
 * Ghi dữ liệu đầu vào vào file JSON
 */
const writeInputData = (inputData) => {
  fs.writeFileSync(getInputDataPath(), JSON.stringify(inputData, null, 2));
  logger.info(`Dữ liệu đầu vào đã lưu: ${getInputDataPath()}`);
};

/**
 * Xử lý lỗi khi khởi chạy process Python
 */
const handleProcessError = (err, io) => {
  logger.error("Lỗi khởi chạy process Python:", err);
  emitStatus(
    io,
    "ERROR",
    "Không thể khởi chạy thuật toán. Kiểm tra cài đặt Python và PATH.",
    0
  );

  if (pythonProcess) {
    pythonProcess.removeAllListeners();
    pythonProcess = null;
  }

  if (currentReject) {
    currentReject(new Error("Lỗi khởi chạy process Python."));
  }
};

/**
 * Xử lý dữ liệu stderr từ Python process
 */
const handlePythonError = (data, io) => {
  const errorOutput = data.toString();
  errorBuffer += errorOutput;
  logger.error(`Python stderr: ${errorOutput}`);
  io.emit("ga_log", {
    type: "stderr",
    message: errorOutput,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Phân tích và xử lý output từ Python process
 */
const handlePythonOutput = (data, io) => {
  const output = data.toString();
  outputBuffer += output;
  const lines = output.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      if (line.startsWith("GA_EVENT:") || line.startsWith("EXPORT_EVENT:")) {
        const prefix = line.startsWith("GA_EVENT:")
          ? "GA_EVENT:"
          : "EXPORT_EVENT:";
        const jsonString = line.substring(prefix.length);
        const parsedData = JSON.parse(jsonString);

        if (parsedData.event_type === "GA_PROGRESS") {
          currentSemesterInfo = parsedData.semester_info;
          io.emit("ga_progress", parsedData);
          logger.info(
            `GA Progress: Generation ${parsedData.generation_info.current}/${parsedData.generation_info.max}`
          );
          const progress = parsedData.generation_info.progress_percentage;
          const scaledProgress = 20 + progress * 0.6;
          emitStatus(
            io,
            "RUNNING_GA",
            `Đang tạo lịch cho ${parsedData.semester_info.semester_name || "học kỳ"
            }...`,
            scaledProgress
          );
        } else if (parsedData.event_type === "EXPORT_STARTED") {
          emitStatus(io, "EXPORTING_EXCEL", "Đang xuất file Excel...", 85);
          io.emit("ga_export", parsedData);
        } else if (parsedData.event_type === "SEMESTER_EXPORT_START") {
          const progress = 85 + (parsedData.current / parsedData.total) * 10;
          emitStatus(
            io,
            "EXPORTING_EXCEL",
            `Đang xuất lịch cho học kỳ ${parsedData.semester_id}...`,
            progress
          );
          io.emit("ga_export", parsedData);
        } else if (parsedData.event_type === "EXPORT_COMPLETE") {
          emitStatus(io, "COMPLETED", "Hoàn thành xuất file!", 100);
          io.emit("ga_export", parsedData);
        }
      } else {
        io.emit("ga_log", {
          type: "stdout",
          message: line,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e) {
      logger.error(`Lỗi parse dữ liệu Python: ${line}`, e);
      io.emit("ga_log", {
        type: "error",
        message: `Lỗi parse dữ liệu: ${line.substring(0, 100)}...`,
        timestamp: new Date().toISOString(),
      });
    }
  }
};

/**
 * Khởi chạy Python process với thuật toán di truyền
 */
const startPythonProcess = (io) => {
  logger.info("Đang khởi chạy thuật toán Python...");

  const pythonScriptPath = path.join(CONFIG.GA_ALGORITHM_DIR, CONFIG.PYTHON_SCRIPT);
  const inputDataDir = CONFIG.GA_ALGORITHM_DIR;
  const resultsDir = CONFIG.RESULTS_DIR; // Lấy đường dẫn kết quả đã được cấu hình

  logger.info(`Tham số 1 (Input Dir): ${inputDataDir}`);
  logger.info(`Tham số 2 (Results Dir): ${resultsDir}`);

  pythonProcess = spawn(
    "python",
    [
      pythonScriptPath,
      inputDataDir, // Argv[1]: Thư mục chứa file input_data.json
      resultsDir,   // Argv[2]: Thư mục để lưu file results
    ],
    {
      cwd: CONFIG.GA_ALGORITHM_DIR, // Vẫn chạy từ thư mục của thuật toán
      stdio: ["pipe", "pipe", "pipe"],
    }
  );

  logger.info(`Python process started với PID: ${pythonProcess.pid}`);

  // Thiết lập event listeners
  pythonProcess.stdout.on("data", (data) => handlePythonOutput(data, io));
  pythonProcess.stderr.on("data", (data) => handlePythonError(data, io));
  pythonProcess.on("close", (code) =>
    cleanupAndResolve(io, code, currentStage === "STOPPING")
  );
  pythonProcess.on("error", (err) => handleProcessError(err, io));
};

/**
 * Chạy thuật toán di truyền với dữ liệu đầu vào
 */
export const runGeneticAlgorithm = (inputData, io) => {
  if (pythonProcess) {
    const errorMsg = "Thuật toán đang chạy. Vui lòng dừng trước khi chạy mới.";
    logger.warn(errorMsg);
    emitStatus(io, "ERROR", errorMsg, currentProgress);
    throw new Error(errorMsg);
  }

  return new Promise((resolve, reject) => {
    currentResolve = resolve;
    currentReject = reject;
    outputBuffer = "";
    errorBuffer = "";

    try {
      emitStatus(io, "START", PROGRESS_STAGES.START.message, 0);
      setTimeout(() => emitStatus(io, "LOADING_DATA", PROGRESS_STAGES.LOADING_DATA.message, 5), 500);
      setTimeout(() => emitStatus(io, "PROCESSING_DATA", PROGRESS_STAGES.PROCESSING_DATA.message, 10), 1000);
      setTimeout(() => emitStatus(io, "INITIALIZING_POPULATION", PROGRESS_STAGES.INITIALIZING_POPULATION.message, 15), 1500);

      ensureResultsDirectory();
      writeInputData(inputData);
      startPythonProcess(io);
    } catch (error) {
      logger.error("Lỗi chuẩn bị thuật toán:", error);
      emitError(io, "Lỗi chuẩn bị thuật toán.", error);
      reject(error);
    }
  });
};

/**
 * Dừng thuật toán đang chạy
 */
export const stopGeneticAlgorithm = (io) => {
  if (pythonProcess && !pythonProcess.killed) {
    logger.info("Đang dừng thuật toán Python...");
    emitStatus(
      io,
      "STOPPING",
      PROGRESS_STAGES.STOPPING.message,
      currentProgress
    );
    pythonProcess.kill("SIGTERM");

    setTimeout(() => {
      if (pythonProcess && !pythonProcess.killed) {
        pythonProcess.kill("SIGKILL");
      }
    }, 3000);
  } else {
    logger.warn("Không có thuật toán nào đang chạy để dừng.");
    emitStatus(
      io,
      "IDLE",
      "Không có tiến trình nào đang chạy.",
      currentProgress
    );
  }
};

/**
 * Lấy đường dẫn file để download
 */
export const getDownloadFilePath = (filename) => {
  const filePath = path.join(getResultsDir(), filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File không tồn tại: ${filename}`);
  }
  return filePath;
};

/**
 * Lấy trạng thái hiện tại của GA service
 */
export const getCurrentGaStatus = () => ({
  message:
    PROGRESS_STAGES[currentStage]?.message || "Trạng thái không xác định",
  stage: currentStage,
  progress: Math.round(currentProgress),
  semesterInfo: currentSemesterInfo,
  timestamp: new Date().toISOString(),
});

/**
 * Reset hoàn toàn trạng thái service
 */
export const resetServiceState = () => {
  if (pythonProcess) {
    pythonProcess.removeAllListeners();
    pythonProcess.kill("SIGKILL");
    pythonProcess = null;
  }
  outputBuffer = "";
  errorBuffer = "";
  currentStage = "IDLE";
  currentProgress = 0;
  currentResolve = null;
  currentReject = null;
  currentSemesterInfo = null;
  logger.info("Service state đã được reset.");
};

// Khởi tạo thư mục kết quả khi import
ensureResultsDirectory();