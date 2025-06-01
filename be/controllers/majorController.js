import { getAllMajor } from '../services/majorService.js';
import { successResponse, errorResponse } from '../utils/APIResponse.js';


export const getAllMajors = async (req, res) => {
    try {
        const majors = await getAllMajor();
        return successResponse(res, majors);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};