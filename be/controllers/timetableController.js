// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\controllers\timetableController.js

import Timetable from '../models/Timetable.js';
import APIResponse from '../utils/APIResponse.js';

// Get all timetables
export const getAllTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find();
        return APIResponse.success(res, timetables);
    } catch (error) {
        return APIResponse.error(res, error.message);
    }
};

// Create a new timetable
export const createTimetable = async (req, res) => {
    try {
        const newTimetable = new Timetable(req.body);
        await newTimetable.save();
        return APIResponse.success(res, newTimetable, 201);
    } catch (error) {
        return APIResponse.error(res, error.message);
    }
};

// Update a timetable by ID
export const updateTimetable = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTimetable = await Timetable.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTimetable) {
            return APIResponse.notFound(res, 'Timetable not found');
        }
        return APIResponse.success(res, updatedTimetable);
    } catch (error) {
        return APIResponse.error(res, error.message);
    }
};

// Delete a timetable by ID
export const deleteTimetable = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTimetable = await Timetable.findByIdAndDelete(id);
        if (!deletedTimetable) {
            return APIResponse.notFound(res, 'Timetable not found');
        }
        return APIResponse.success(res, null, 204);
    } catch (error) {
        return APIResponse.error(res, error.message);
    }
};