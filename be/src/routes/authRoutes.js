import express from 'express';
import passport from 'passport';
import { login, register, logout, googleCallback } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../utils/validation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Login route
router.post('/login', validateLogin, login);

// Register route
router.post('/register', validateRegister, register);

// Logout route (protected)
router.post('/logout', authMiddleware, logout);

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    googleCallback
);

export default router;