import jwt from 'jsonwebtoken';
import { APIResponse } from '../utils/APIResponse.js';
import { findUserById } from '../services/userService.js';

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return APIResponse(res, 401, 'Access denied. No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user still exists in database
        const userInfo = await findUserById(decoded.id);
        if (!userInfo) {
            return APIResponse(res, 403, 'User not found');
        }

        req.userId = decoded.id;
        req.userRole = decoded.role || userInfo.role;
        req.userInfo = userInfo;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return APIResponse(res, 403, 'Invalid token');
    }
};

// Middleware để kiểm tra role
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return APIResponse(res, 403, 'Access denied. No role information');
        }

        if (!allowedRoles.includes(req.userRole)) {
            return APIResponse(res, 403, 'Access denied. Insufficient permissions');
        }

        next();
    };
};

export default authMiddleware;