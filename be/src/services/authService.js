import jwt from "jsonwebtoken";
import { findUserByEmail, getUserId } from "./userService.js";

/**
 * Tạo JWT token cho user
 * @param {string} userId - ID của người dùng
 * @param {string} role - Vai trò của người dùng (admin, user, lecturer, v.v.)
 * @returns {string} - Mã JWT
 */
export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "12h", // Token có hiệu lực trong 12 giờ
  });
};

/**
 * Xác minh token JWT
 * @param {string} token - Chuỗi token cần xác thực
 * @returns {Object} - Dữ liệu giải mã từ token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Token không hợp lệ");
  }
};
