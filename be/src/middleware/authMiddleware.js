import jwt from 'jsonwebtoken';
import { APIResponse } from '../utils/APIResponse.js';
import { findUserById } from '../services/userService.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return APIResponse(res, 401, 'Access denied. Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return APIResponse(res, 401, 'Access denied. Token missing from authorization header');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user still exists in database
        const userInfo = await findUserById(decoded.id);
        if (!userInfo) {
            return APIResponse(res, 401, 'User not found or has been deleted');
        }

        req.userId = decoded.id;
        req.userRole = decoded.role || userInfo.role;
        req.userInfo = userInfo;

        console.log(`User authenticated: ID=${req.userId}, Role=${req.userRole}`);
        next();
    } catch (error) {
        console.error('Token verification error:', error);

        if (error.name === 'TokenExpiredError') {
            return APIResponse(res, 401, 'Token has expired. Please login again');
        } else if (error.name === 'JsonWebTokenError') {
            return APIResponse(res, 401, 'Invalid token format');
        } else if (error.name === 'NotBeforeError') {
            return APIResponse(res, 401, 'Token not active yet');
        } else {
            return APIResponse(res, 401, 'Authentication failed');
        }
    }
};

// Middleware để kiểm tra role
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Đảm bảo user đã được authenticate trước
        if (!req.userId || !req.userRole) {
            return APIResponse(res, 401, 'Authentication required');
        }

        // Kiểm tra nếu allowedRoles không phải là array
        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        // Kiểm tra role của user có trong danh sách cho phép không
        if (!rolesArray.includes(req.userRole)) {
            return APIResponse(res, 403, `Access denied. Required role: ${rolesArray.join(' or ')}, but user has role: ${req.userRole}`);
        }

        next();
    };
};

// Middleware kết hợp authenticate và authorize trong một bước
export const authenticateAndAuthorize = (allowedRoles) => {
    return async (req, res, next) => {
        // Bước 1: Authenticate
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return APIResponse(res, 401, 'Access denied. No token provided');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verify user still exists in database
            const userInfo = await findUserById(decoded.id);
            if (!userInfo) {
                return APIResponse(res, 401, 'User not found or has been deleted');
            }

            req.userId = decoded.id;
            req.userRole = decoded.role || userInfo.role;
            req.userInfo = userInfo;

            // Bước 2: Authorize
            const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

            if (!rolesArray.includes(req.userRole)) {
                return APIResponse(res, 403, `Access denied. Required role: ${rolesArray.join(' or ')}, but user has role: ${req.userRole}`);
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            if (error.name === 'TokenExpiredError') {
                return APIResponse(res, 401, 'Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                return APIResponse(res, 401, 'Invalid token');
            } else {
                return APIResponse(res, 401, 'Authentication failed');
            }
        }
    };
};

export default authMiddleware;