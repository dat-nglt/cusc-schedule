import express from 'express';
// import timetableRoutes from './timetableRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes';

const router = express.Router();

const setupRoutes = (app) => {
    // app.use('/api/timetable', timetableRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
};

export default setupRoutes;