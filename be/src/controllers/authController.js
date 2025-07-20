// BE: controllers/authController.js
import {
  generateAccessTokenService,
  generateRefreshTokenService,
  verifyTokenService,
} from "../services/authService.js";
import { findExistsUserByIdService } from "../services/userService.js";
import { APIResponse } from "../utils/APIResponse.js";
import logger from "../utils/logger.js";
import models from "../models/index.js";

export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent(
        "refresh_token_missing"
      )}`
    );
  }

  try {
    const { existsUserID, existsUserJTI, exp } = verifyTokenService(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Kiểm tra xem RefreshToken được cấp đã sử dụng hay chưa
    const isBlacklisted = await models.BlacklistedToken.findOne({
      where: { jti: existsUserJTI },
    });

    if (isBlacklisted) {
      console.warn(`RefreshToken has been added to the Blacklist!`);
      res.clearCookie("refreshToken", {
        path: "/auth/refresh-token",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      res.clearCookie("accessToken", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(
          "refresh_token_revoked"
        )}`
      );
    }

    if (!existsUserID) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          "refresh_token_missing"
        )}`
      );
    }
    // Kiểm tra sự tồn tại của người dùng trong DB
    // Lấy dữ liệu của người dùng để tạo lại accessToken
    const existsUser = await findExistsUserByIdService(existsUserID);

    if (!existsUser) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          "refresh_token_missing"
        )}`
      );
    }

    // Tuỳ chọn thêm refreshToken vào danh sách đã sử dụng mỗi lần refresh hoặc không
    // await models.BlacklistedToken.create({
    //   jti: existsUserJTI,
    //   user_id: existsUserID,
    //   expires_at: new Date(exp * 1000),
    // });

    const newAccessToken = generateAccessTokenService(
      existsUser.id,
      existsUser.role
    );
    const newRefreshToken = generateRefreshTokenService(existsUser.id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000, // 15 phút
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh-token",
    });

    return res.status(200).json({ message: "Tokens refreshed successfully." });
  } catch (error) {
    logger.error("Error refresh token:", error.message);

    res.clearCookie("refreshToken", {
      path: "/auth/refresh-token",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    res.clearCookie("accessToken", {
      path: "/", // Phải khớp path khi set
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          "refresh_token_expired_or_invalid"
        )}`
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent(
        "server_error_refreshing_token"
      )}`
    );
  }
};

export const googleCallbackController = async (req, res) => {
  try {
    const authenticatedUser = req.authenticatedUser;

    if (
      !authenticatedUser ||
      !authenticatedUser.id ||
      !authenticatedUser.role
    ) {
      logger.error(
        "Passport.js callback: authenticatedUser is null or missing id/role"
      );

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";

      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          "user_data_missing_after_auth"
        )}`
      );
    }

    const accessToken = generateAccessTokenService(
      authenticatedUser.id,
      authenticatedUser.role
    );
    const refreshToken = generateRefreshTokenService(authenticatedUser.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh-token",
    });

    // gọi lại auth-callback sau khi đã xác thực và tạo token cho người dùng
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
    return res.redirect(`${frontendUrl}/auth-callback`);
  } catch (error) {
    logger.error(
      "Error processing Google callback (Internal server error):",
      error
    );
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
    return res.redirect(
      `${frontendUrl}/login?error=${encodeURIComponent(
        "server_error_during_google_auth"
      )}`
    );
  }
};

// Endpoint này sẽ được Frontend gọi để lấy thông tin người dùng
export const getCurrentUserDataController = async (req, res) => {
  if (!req.user || !req.user.id || !req.user.role) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No valid session found." });
  }

  return res.status(200).json({
    success: true,
    id: req.user.id,
    role: req.user.role,
  });
};

export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Lấy refreshToken để clear và blacklist

  // Xóa cả hai cookies ngay lập tức để vô hiệu hóa chúng ở phía client
  res.clearCookie("accessToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.clearCookie("refreshToken", {
    path: "/auth/refresh-token", // <-- khớp path
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  // Nếu không có refreshToken, không cần blacklist, chỉ cần thông báo đăng xuất thành công.
  if (!refreshToken) {
    logger.info(
      "Người dùng đăng xuất thành công (không có refresh token trong cookie)."
    );
    return res.status(200).json("Đăng xuất thành công");
  }

  try {
    const { existsUserID, existsUserJTI, exp } = verifyTokenService(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const jti = existsUserJTI;
    const userId = existsUserID;
    const expiresAt = new Date(exp * 1000);

    const existingBlacklistEntry = await models.BlacklistedToken.findOne({
      where: { jti: jti },
    });

    if (existingBlacklistEntry) {
      logger.warn(
        `Refresh token with JTI: ${jti} is already blacklisted. Skip re-adding.`
      );
    } else {
      await models.BlacklistedToken.create({
        jti: jti,
        user_id: userId,
        expires_at: expiresAt,
      });
      logger.info(
        `Refresh token with JTI: ${jti} of user ID: ${userId} has been added to blacklist.`
      );
    }

    return res.status(200).json("Đăng xuất thành công");
  } catch (error) {
    logger.error(
      "Error when processing blacklist refresh token during logout",
      error.message
    );

    return res.status(200).json("Đăng xuất thành công");
  }
};
