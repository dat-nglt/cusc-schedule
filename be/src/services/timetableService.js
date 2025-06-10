// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\services\timetableService.js

import Timetable from '../models/Timetable.js';

// Function to create a new timetable entry
export const createTimetable = async (data) => {
    const timetable = new Timetable(data);
    return await timetable.save();
};

// Function to get all timetables
export const getAllTimetables = async () => {
    return await Timetable.find();
};

// Function to get a timetable by ID
export const getTimetableById = async (id) => {
    return await Timetable.findById(id);
};

// Function to update a timetable entry
export const updateTimetable = async (id, data) => {
    return await Timetable.findByIdAndUpdate(id, data, { new: true });
};

// Function to delete a timetable entry
export const deleteTimetable = async (id) => {
    return await Timetable.findByIdAndDelete(id);
};