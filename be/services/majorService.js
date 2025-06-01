import Major from '../models/Major.js';

export const getAllMajor = async () => {
    return await Major.findAll();
}