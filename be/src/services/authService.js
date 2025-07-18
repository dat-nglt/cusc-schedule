import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { findUserByEmail, getUserId } from "./userService.js";
import logger from "../utils/logger.js";

/**
 * Tạo JWT token cho user
 * @param {string} userId - ID của người dùng
 * @param {string} role - Vai trò của người dùng (admin, user, lecturer, v.v.)
 * @returns {string} - Mã JWT
 */
export const generateAccessTokenService = (userId, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token có hiệu lực trong 1 giờ
  });
};

/**
 * Tạo refresh token
 * @param {string} userID - ID của người dùng
 * @returns {string} - Refresh Token
 */
export const generateRefreshTokenService = (userID) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userID }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Xác minh token JWT
 * @param {string} token - Chuỗi token cần xác thực
 * @param {string} secret - Chuỗi bí mật dùng để xác thực
 * @returns {Object} - Dữ liệu giải mã từ token
 */
export const verifyTokenService = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.id;
  } catch (error) {
    logger.error("Token verification failed:", error.message);
    throw new Error("accessToken không hợp lệ");
  }
};
