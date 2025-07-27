import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
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
    expiresIn: "15m", // Token có hiệu lực trong 30 giây
  });
};

export const generateRefreshTokenService = (userId) => {
  return jwt.sign(
    { id: userId, jti: uuidv4() }, // Thêm jti vào payload
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Xác minh token JWT
 * @param {string} token - Chuỗi token cần xác thực
 * @param {string} secret - Chuỗi bí mật dùng để xác thực
 * @returns {Object} - Dữ liệu giải mã từ token
 */
export const verifyTokenService = (token, secret) => {
  try {
    const decode = jwt.verify(typeToken, secret);
    return {
      existsUserID: decode.id,
      existsUserJTI: decode.jti,
      exp: decode.exp,
    };
  } catch (error) {
    logger.error("Token verification failed:", error.message);
    throw new Error("accessToken không hợp lệ");
  }
};

export const clearSpecificCookie = (res, name, option = {}) => {
  res.clearCookie(name, {
    path: option.path || "/",
    httpOnly: option.httpOnly || true,
    secure: option.secure || process.env.NODE_ENV === "production",
    samsite: option.samsite || "Lax",
  });
};
