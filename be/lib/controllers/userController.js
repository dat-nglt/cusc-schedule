"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllUsersController = void 0;
require("core-js/modules/es.promise.js");
var _userService = require("../services/userService.js");
var _APIResponse = require("../utils/APIResponse.js");
const getAllUsersController = async (req, res) => {
  try {
    const users = await (0, _userService.getAllUsers)();
    return (0, _APIResponse.successResponse)(res, users, "Users fetched successfully");
  } catch (error) {
    return (0, _APIResponse.errorResponse)(res, error.message || "Error fetching users", 500);
  }
};
exports.getAllUsersController = getAllUsersController;