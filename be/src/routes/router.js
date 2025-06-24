import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import courseRoutes from './courseRoutes.js';

const router = express.Router();

const setupRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/courses', courseRoutes);
};

export default setupRoutes;