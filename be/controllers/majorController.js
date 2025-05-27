import Major from "../models/Major.js";
import { successResponse, errorResponse } from '../utils/APIResponse.js';


export const getAllMajor = async (req, res) => {
    try {
        const majors = await Major.findAll();
        return successResponse(res, majors);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};