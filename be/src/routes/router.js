import express from 'express';
// import timetableRoutes from './timetableRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import lecturerRoutes from './lecturerRoutes.js';
const router = express.Router();

const setupRoutes = (app) => {
    // app.use('/api/timetable', timetableRoutes);
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
    app.use('/lecturer', lecturerRoutes);
};

export default setupRoutes;