import express from 'express';
import {
    getAllClassScheduleController,
    getClassScheduleForLecturerController,
    getClassScheduleForStudentController
} from '../controllers/classScheduleController.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const classScheduleRoutes = express.Router();

classScheduleRoutes.get('/getAll', authenticateAndAuthorize(['admin', 'training_officer']), getAllClassScheduleController);
classScheduleRoutes.get('/lecturer/:lecturerId', authenticateAndAuthorize(['admin', 'training_officer', 'lecturer']), getClassScheduleForLecturerController);
classScheduleRoutes.get('/student/:studentId', authenticateAndAuthorize(['admin', 'training_officer', 'student']), getClassScheduleForStudentController);


export default classScheduleRoutes;