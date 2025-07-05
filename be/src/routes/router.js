import express from 'express';
import authRoutes from './authRoutes';
import lecturerRoutes from './lecturerRoutes';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import studentRoutes from './studentRoutes';
import breakscheduleRoutes from './breakscheduleRoutes';
import classRoutes from './classRotes';

const router = express.Router();

const setupRoutes = (app) => {
    // app.use('/api/timetable', timetableRoutes);
    app.use('/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/lecturers', lecturerRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/breakschedules', breakscheduleRoutes);
    app.use('/api/classes', classRoutes);
};

export default setupRoutes;