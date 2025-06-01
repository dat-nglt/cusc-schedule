"use strict";

const jwt = require('jsonwebtoken');
const {
  constants
} = require('../config/constants');
const authMiddleware = (req, res, next) => {
  var _req$headers$authoriz;
  const token = (_req$headers$authoriz = req.headers['authorization']) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(' ')[1];
  if (!token) {
    return res.status(constants.UNAUTHORIZED).json({
      message: 'No token provided'
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(constants.FORBIDDEN).json({
        message: 'Failed to authenticate token'
      });
    }
    req.userId = decoded.id;
    next();
  });
};
module.exports = authMiddleware;