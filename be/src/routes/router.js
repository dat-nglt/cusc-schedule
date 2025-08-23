
import express from "express";
import authRoutes from "./authRoutes.js";
import lecturerRoutes from "./lecturerRoutes.js";
import userRoutes from "./userRoutes.js";
import courseRoutes from "./courseRoutes.js";
import studentRoutes from "./studentRoutes.js";
import programRoutes from "./programRoutes.js";
import semesterRoutes from "./semesterRoutes.js";
import subjectRoutes from "./subjectRoutes.js";
import breakscheduleRoutes from "./breakscheduleRoutes.js";
import classRoutes from "./classRoutes.js";
import createScheduleRouter from "./scheduleRoute.js";
import roomRoutes from "./roomRoutes.js";
import busySlotRoutes from "./busySlotRoute.js";

const router = express.Router();

const setupRoutes = (app, io) => {
  // app.use('/api/timetable', timetableRoutes);
  app.use("/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/lecturers", lecturerRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/programs", programRoutes);
  app.use("/api/semesters", semesterRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/breakschedules", breakscheduleRoutes);
  app.use("/api/classes", classRoutes);
  app.use("/api/busyslots", busySlotRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/schedule", createScheduleRouter(io));
};

export default setupRoutes;
