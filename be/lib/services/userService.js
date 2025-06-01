"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllUsers = void 0;
require("core-js/modules/es.promise.js");
var _User = _interopRequireDefault(require("../models/User"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const getAllUsers = async () => {
  try {
    const users = await _User.default.findAll();
    return users;
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};
exports.getAllUsers = getAllUsers;