import jwt from 'jsonwebtoken';
import { APIResponse } from '../utils/APIResponse';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return APIResponse(res, 401, 'Access denied. No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // This will be the user_id from the database
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return APIResponse(res, 403, 'Invalid token');
    }
};

export default authMiddleware;