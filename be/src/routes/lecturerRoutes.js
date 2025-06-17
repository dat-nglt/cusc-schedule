import express from 'express';
import authMiddleware, { requireRole, authenticateAndAuthorize } from '../middleware/authMiddleware.js';
import { getAllLecturersController, getLecturerByIdController } from '../controllers/lecturerController.js';

const lecturerRoutes = express.Router();

lecturerRoutes.get('/getAll', authenticateAndAuthorize(['admin', 'training_officer']), getAllLecturersController);
lecturerRoutes.get('/:id', authenticateAndAuthorize(['admin', 'training_officer']), getLecturerByIdController);
export default lecturerRoutes;