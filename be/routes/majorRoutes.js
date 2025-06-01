import express from 'express';
import { getAllMajors } from '../controllers/majorController.js';
// import authMiddleware from '../middleware/authMiddleware.js';

const majorRoutes = express.Router();

// Get all majors
majorRoutes.get('/getAll', getAllMajors);

export default majorRoutes;