"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationErrorResponse = exports.successResponse = exports.notFoundResponse = exports.errorResponse = void 0;
const successResponse = exports.successResponse = function successResponse(res, data) {
  let message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Success';
  return res.status(200).json({
    status: 'success',
    message,
    data
  });
};
const errorResponse = exports.errorResponse = function errorResponse(res) {
  let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Error';
  let statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;
  return res.status(statusCode).json({
    status: 'error',
    message
  });
};
const notFoundResponse = exports.notFoundResponse = function notFoundResponse(res) {
  let message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Resource not found';
  return res.status(404).json({
    status: 'error',
    message
  });
};
const validationErrorResponse = (res, errors) => {
  return res.status(422).json({
    status: 'error',
    message: 'Validation Error',
    errors
  });
};
exports.validationErrorResponse = validationErrorResponse;