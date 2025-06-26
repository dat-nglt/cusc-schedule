import express from 'express';
import authMiddleware, { requireRole, authenticateAndAuthorize } from '../middleware/authMiddleware.js';
import {
    getAllLecturersController,
    getLecturerByIdController,
    createLecturerController,
    updateLecturerController,
    deleteLecturerController,
    importLecturersController,
    downloadTemplateController,
} from '../controllers/lecturerController.js';
import { uploadExcel } from '../middleware/excelMiddleware';

const lecturerRoutes = express.Router();

lecturerRoutes.get('/getAll', authenticateAndAuthorize(['admin', 'training_officer']), getAllLecturersController);
lecturerRoutes.get('/:id', authenticateAndAuthorize(['admin', 'training_officer']), getLecturerByIdController);
lecturerRoutes.post('/create', authenticateAndAuthorize(['admin', 'training_officer']), createLecturerController);
lecturerRoutes.put('/update/:id', authenticateAndAuthorize(['admin', 'training_officer']), updateLecturerController);
lecturerRoutes.delete('/delete/:id', authenticateAndAuthorize(['admin', 'training_officer']), deleteLecturerController);

// Import Excel routes
lecturerRoutes.post('/import', authenticateAndAuthorize(['admin', 'training_officer']), uploadExcel, importLecturersController);
lecturerRoutes.get('/template/download', authenticateAndAuthorize(['admin', 'training_officer']), downloadTemplateController);
export default lecturerRoutes;