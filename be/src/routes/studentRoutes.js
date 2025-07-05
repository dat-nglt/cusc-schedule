import express from 'express';
import authMiddleware, { requireRole, authenticateAndAuthorize } from '../middleware/authMiddleware.js';
import {
    getAllStudentsController,
    getStudentByIdController,
    createStudentController,
    updateStudentController,
    deleteStudentController,
    importStudentsController,
    downloadTemplateController
} from '../controllers/studentController.js';
import { uploadExcel } from '../middleware/excelMiddleware';

const studentRoutes = express.Router();

studentRoutes.get('/getAll', authenticateAndAuthorize(['admin', 'training_officer']), getAllStudentsController);
studentRoutes.get('/:id', authenticateAndAuthorize(['admin', 'training_officer']), getStudentByIdController);
studentRoutes.post('/create', authenticateAndAuthorize(['admin', 'training_officer']), createStudentController);
studentRoutes.put('/update/:id', authenticateAndAuthorize(['admin', 'training_officer']), updateStudentController);
studentRoutes.delete('/delete/:id', authenticateAndAuthorize(['admin', 'training_officer']), deleteStudentController);

// Import Excel routes
studentRoutes.post('/import', authenticateAndAuthorize(['admin', 'training_officer']), uploadExcel, importStudentsController);
studentRoutes.get('/template/download', downloadTemplateController);
export default studentRoutes;