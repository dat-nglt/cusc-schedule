"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.registerUser = exports.loginUser = void 0;
require("core-js/modules/es.promise.js");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _User = _interopRequireDefault(require("../models/User.js"));
var _constants = require("../config/constants.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\services\authService.js

const registerUser = async userData => {
  const user = new _User.default(userData);
  await user.save();
  return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
  const user = await _User.default.findOne({
    email
  });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = _jsonwebtoken.default.sign({
    id: user._id
  }, _constants.JWT_SECRET, {
    expiresIn: '1h'
  });
  return {
    user,
    token
  };
};
exports.loginUser = loginUser;
const verifyToken = token => {
  try {
    return _jsonwebtoken.default.verify(token, _constants.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
exports.verifyToken = verifyToken;