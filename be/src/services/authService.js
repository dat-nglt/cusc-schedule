import jwt from "jsonwebtoken";
import { findUserByEmail, getUserId } from "./userService.js";
import logger from "../utils/logger.js";

/**
 * Tạo JWT token cho user
 * @param {string} userId - ID của người dùng
 * @param {string} role - Vai trò của người dùng (admin, user, lecturer, v.v.)
 * @returns {string} - Mã JWT
 */
export const generateAccessTokenService = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token có hiệu lực trong 12 giờ
  });
};

export const generateRefreshTokenService = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Xác minh token JWT
 * @param {string} token - Chuỗi token cần xác thực
 * @returns {Object} - Dữ liệu giải mã từ token
 */
export const verifyTokenService = (typeToken, secret) => {
  try {
    const decode = jwt.verify(typeToken, secret);
    return decode.id;
  } catch (error) {
    logger.error("Token verification failed:", error.message);
    throw new Error("accessToken không hợp lệ");
  }
};
