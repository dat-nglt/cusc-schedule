import express from 'express';
import { getAllClassScheduleController } from '../controllers/classScheduleController.js';

const classScheduleRoutes = express.Router();

classScheduleRoutes.get('/getAll', getAllClassScheduleController);

export default classScheduleRoutes;