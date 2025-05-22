import express from 'express';
import { getTimetable, createTimetable, updateTimetable, deleteTimetable } from '../controllers/timetableController.js';

const router = express.Router();

// Get all timetables
router.get('/', getTimetable);

// Create a new timetable
router.post('/', createTimetable);

// Update a timetable by ID
router.put('/:id', updateTimetable);

// Delete a timetable by ID
router.delete('/:id', deleteTimetable);

export default router;