"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\middleware\errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};
var _default = exports.default = errorMiddleware;