"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _userRoutes = _interopRequireDefault(require("./userRoutes.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import timetableRoutes from './timetableRoutes.js';
// import authRoutes from './authRoutes.js';

const router = _express.default.Router();
const setupRoutes = app => {
  // app.use('/api/timetable', timetableRoutes);
  // app.use('/api/auth', authRoutes);
  app.use('/user', _userRoutes.default);
};
var _default = exports.default = setupRoutes;