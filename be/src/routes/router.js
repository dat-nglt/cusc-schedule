import express from 'express';
import authRoutes from './authRoutes';
import lecturerRoutes from './lecturerRoutes';
import userRoutes from './userRoutes';
import courseRoutes from './courseRoutes';
import studentRoutes from './studentRoutes';
import programRoutes from './programRoutes';
import semesterRoutes from './semesterRoutes';
import subjectRoutes from './subjectRoutes';

const router = express.Router();

const setupRoutes = (app) => {
    // app.use('/api/timetable', timetableRoutes);
    app.use('/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/lecturers', lecturerRoutes);
    app.use('/api/students', studentRoutes);
    app.use('/api/programs', programRoutes);
    app.use('/api/semesters', semesterRoutes);
    app.use('/api/subjects', subjectRoutes)
};

export default setupRoutes;