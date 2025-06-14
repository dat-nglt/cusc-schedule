import User from '../models/User.js';
import { generateToken } from '../services/authService.js';
import { APIResponse } from '../utils/APIResponse.js';

// Handle user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return APIResponse(res, 401, 'Invalid credentials');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return APIResponse(res, 401, 'Invalid credentials');
        }

        const token = generateToken(user.user_id);
        return APIResponse(res, 200, {
            token,

        }, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        return APIResponse(res, 500, 'Server error');
    }
};

// Handle user registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return APIResponse(res, 400, 'User already exists');
        }

        // Create new user (password will be hashed automatically by the beforeCreate hook)
        const newUser = await User.create({
            name,
            email,
            password,
            role: 'admin', // default role
            status: 'active'
        });

        const token = generateToken(newUser.user_id);

        return APIResponse(res, 201, {
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.user_id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return APIResponse(res, 500, 'Server error');
    }
};

// Handle user logout
export const logout = (req, res) => {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // For enhanced security, you could maintain a blacklist of tokens
    return APIResponse(res, 200, 'User logged out successfully');
};

// Handle Google OAuth callback
export const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5000'}/login?error=authentication_failed`);
        }

        // Generate JWT token
        const token = generateToken(user.user_id);

        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        }))}`);
    } catch (error) {
        console.error('Google callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/login?error=server_error`);
    }
};