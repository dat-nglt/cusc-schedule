import express from 'express';
import { getAllUsersController } from '../controllers/userController';

const userRoutes = express.Router();

// Get all majors
userRoutes.get('/getAll', getAllUsersController);

export default userRoutes;