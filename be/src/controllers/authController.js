import { findUserByEmail, getUserId } from '../services/userService.js';
import { generateToken } from '../services/authService.js';
import { APIResponse } from '../utils/APIResponse.js';

// Handle user login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userInfo = await findUserByEmail(email);
        if (!userInfo) {
            return APIResponse(res, 401, 'Invalid credentials');
        }

        const { user, role } = userInfo;

        // Check if user has password (traditional login)
        if (!user.password) {
            return APIResponse(res, 401, 'This account uses Google login only');
        }

        // Verify password (if user model has comparePassword method)
        if (typeof user.comparePassword === 'function') {
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return APIResponse(res, 401, 'Invalid credentials');
            }
        } else {
            // If no password comparison method, assume it's a Google-only account
            return APIResponse(res, 401, 'This account uses Google login only');
        }

        const userId = getUserId(userInfo);
        const token = generateToken(userId, role);
        
        return APIResponse(res, 200, {
            token,
            user: {
                id: userId,
                name: user.name,
                email: user.email,
                role: role
            }
        }, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        return APIResponse(res, 500, 'Server error');
    }
};

// Handle user registration - Disabled for this system
export const register = async (req, res) => {
    return APIResponse(res, 400, 'Registration is disabled. Please contact administrator to create account.');
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
        const userObj = req.user;
        if (!userObj) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5000'}/login?error=authentication_failed`);
        }

        // Generate JWT token
        const token = generateToken(userObj.id, userObj.role);

        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
            id: userObj.id,
            name: userObj.user.name,
            email: userObj.user.email,
            role: userObj.role
        }))}`);
    } catch (error) {
        console.error('Google callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
        return res.redirect(`${frontendUrl}/login?error=server_error`);
    }
};