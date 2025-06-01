"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTimetable = exports.getTimetableById = exports.getAllTimetables = exports.deleteTimetable = exports.createTimetable = void 0;
require("core-js/modules/es.promise.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.find.js");
var _Timetable = _interopRequireDefault(require("../models/Timetable.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\services\timetableService.js

// Function to create a new timetable entry
const createTimetable = async data => {
  const timetable = new _Timetable.default(data);
  return await timetable.save();
};

// Function to get all timetables
exports.createTimetable = createTimetable;
const getAllTimetables = async () => {
  return await _Timetable.default.find();
};

// Function to get a timetable by ID
exports.getAllTimetables = getAllTimetables;
const getTimetableById = async id => {
  return await _Timetable.default.findById(id);
};

// Function to update a timetable entry
exports.getTimetableById = getTimetableById;
const updateTimetable = async (id, data) => {
  return await _Timetable.default.findByIdAndUpdate(id, data, {
    new: true
  });
};

// Function to delete a timetable entry
exports.updateTimetable = updateTimetable;
const deleteTimetable = async id => {
  return await _Timetable.default.findByIdAndDelete(id);
};
exports.deleteTimetable = deleteTimetable;