"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("../controllers/userController.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const userRoutes = _express.default.Router();

// Get all majors
userRoutes.get('/getAll', _userController.getAllUsersController);
var _default = exports.default = userRoutes;