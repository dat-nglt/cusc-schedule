// BE: controllers/authController.js
import { generateToken } from "../services/authService.js";
import { APIResponse } from "../utils/APIResponse.js";

export const logout = (req, res) => {
  res.clearCookie("jwt", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  return APIResponse(res, 200, "Người dùng đã đăng xuất thành công.");
};

export const googleCallback = async (req, res) => {
  try {
    const userObj = req.user; // Từ Passport.js

    if (!userObj || !userObj.id || !userObj.role) {
      console.error("Passport.js callback: userObj is null or missing id/role");
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(
          "user_data_missing_after_auth"
        )}`
      );
    }

    const token = generateToken(userObj.id, userObj.role);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Vẫn REDIRECT đến một trang cụ thể của Frontend mà React Router sẽ xử lý
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
export const getCurrentUser = async (req, res) => {
  // req.user được gắn bởi middleware xác thực JWT từ cookie
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
