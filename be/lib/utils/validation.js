"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUser = exports.validateTimetable = void 0;
var _expressValidator = require("express-validator");
const validateTimetable = exports.validateTimetable = [(0, _expressValidator.body)('title').notEmpty().withMessage('Title is required'), (0, _expressValidator.body)('startTime').isISO8601().withMessage('Start time must be a valid ISO 8601 date'), (0, _expressValidator.body)('endTime').isISO8601().withMessage('End time must be a valid ISO 8601 date'), (0, _expressValidator.body)('classId').notEmpty().withMessage('Class ID is required'), (req, res, next) => {
  const errors = (0, _expressValidator.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  next();
}];
const validateUser = exports.validateUser = [(0, _expressValidator.body)('username').notEmpty().withMessage('Username is required'), (0, _expressValidator.body)('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long'), (req, res, next) => {
  const errors = (0, _expressValidator.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  next();
}];