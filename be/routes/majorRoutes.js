import express from 'express';
import { getAllMajor } from '../controllers/majorController.js'; // Add .js extension

const majorRoutes = express.Router();

// Get all majors
majorRoutes.get('/getAll', getAllMajor);

export default majorRoutes;