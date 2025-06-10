// import mongoose from 'mongoose';

// const timetableSchema = new mongoose.Schema({
//   subject: {
//     type: String,
//     required: true,
//   },
//   startTime: {
//     type: Date,
//     required: true,
//   },
//   endTime: {
//     type: Date,
//     required: true,
//   },
//   dayOfWeek: {
//     type: String,
//     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//     required: true,
//   },
//   classroom: {
//     type: String,
//     required: true,
//   },
//   teacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
// }, { timestamps: true });

// const Timetable = mongoose.model('Timetable', timetableSchema);

// export default Timetable;
"use strict";