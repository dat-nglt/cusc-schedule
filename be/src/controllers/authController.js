// BE: controllers/authController.js
import {
  generateAccessTokenService,
  generateRefreshTokenService,
  verifyTokenService,
} from "../services/authService.js";
import { findExistsUserByIdService } from "../services/userService.js";
import { APIResponse } from "../utils/APIResponse.js";
import logger from "../utils/logger.js";

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
    const existsUserID = verifyTokenService(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    logger.info(`existsUserID: ${existsUserID}`);

    // Truy vấn quyền người dùng từ cơ sở dữ liệu
    if (!existsUserID) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          "refresh_token_missing"
        )}`
      );
    }

    const existsUser = await findExistsUserByIdService(existsUserID);

    if (!existsUser) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          "refresh_token_missing"
        )}`
      );
    }

    logger.info(`existsUser: ${existsUser.id}`);

    const newAccessToken = generateAccessTokenService(
      existsUser.id,
      existsUser.role
    );
    const newRefreshToken = generateRefreshTokenService(existsUser.id);

    // 5. Cập nhật cookie với token mới
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, // 1 giờ
      path: "/",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: "/",
    });

    return res.status(200).json({ message: "Tokens refreshed successfully." });
  } catch (error) {
    console.error("Error refresh token:", error.message);
    // Nếu refreshToken không hợp lệ hoặc hết hạn
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
    // Lỗi khác
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
      console.error(
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
      maxAge: 60 * 60 * 1000, // Thời hạn của cookie là 1 giờ
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Thời hạn của cookie là 7 ngayfF
      path: "/",
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
    // '/auth-callback' là một route bạn sẽ định nghĩa trong React Router của mình
    return res.redirect(`${frontendUrl}/auth-callback`);
  } catch (error) {
    console.error(
      "Lỗi trong quá trình xử lý Google callback (internal server error):",
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

export const logoutController = (req, res) => {
  res.clearCookie("accessToken", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  return APIResponse(res, 200, "Người dùng đã đăng xuất thành công.");
};
