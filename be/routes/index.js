import express from 'express';
import timetableRoutes from './timetableRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

const setupRoutes = (app) => {
    app.use('/api/timetable', timetableRoutes);
    app.use('/api/auth', authRoutes);
};

export default setupRoutes;