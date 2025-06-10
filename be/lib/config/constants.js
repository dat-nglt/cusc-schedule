"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USER_ROLES = exports.STATUS_CODES = void 0;
const USER_ROLES = exports.USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};
const STATUS_CODES = exports.STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};