"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logInfo = exports.logError = void 0;
var _winston = _interopRequireDefault(require("winston"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const logger = _winston.default.createLogger({
  level: 'info',
  format: _winston.default.format.combine(_winston.default.format.timestamp(), _winston.default.format.json()),
  transports: [new _winston.default.transports.Console(), new _winston.default.transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }), new _winston.default.transports.File({
    filename: 'logs/combined.log'
  })]
});
const logInfo = message => {
  logger.info(message);
};
exports.logInfo = logInfo;
const logError = message => {
  logger.error(message);
};
exports.logError = logError;