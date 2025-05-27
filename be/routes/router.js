import express from 'express';
// import timetableRoutes from './timetableRoutes.js';
// import authRoutes from './authRoutes.js';
import majorRoutes from './majorRoutes.js';

const router = express.Router();

const setupRoutes = (app) => {
    // app.use('/api/timetable', timetableRoutes);
    // app.use('/api/auth', authRoutes);
    app.use('/major', majorRoutes);
};

export default setupRoutes;