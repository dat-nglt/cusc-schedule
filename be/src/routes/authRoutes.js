import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../utils/validation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Login route
router.post('/login', validateLogin, login);

// Register route
router.post('/register', validateRegister, register);

// Logout route (protected)
router.post('/logout', authMiddleware, logout);

export default router;