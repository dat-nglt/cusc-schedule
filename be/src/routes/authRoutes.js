import express from "express";
import passport from "passport";
import {
  logout,
  googleCallback,
  getCurrentUser,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
// import dotenv from "dotenv";

// dotenv.config(); // Tải biến môi trường từ .env

const router = express.Router();

/**
 * @route POST /api/auth/logout
 * @desc Đăng xuất người dùng. Yêu cầu người dùng phải xác thực trước khi thực hiện.
 * @access Private
 */
router.post("/logout", authMiddleware, logout);

router.get("/current-user", authMiddleware, getCurrentUser);

// --- Tuyến đường xác thực Google OAuth ---

/**
 * @route GET /api/auth/google
 * @desc Bắt đầu quá trình xác thực với Google.
 * Chuyển hướng người dùng đến trang đăng nhập của Google.
 * @access Public
 */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route GET /api/auth/google/callback
 * @desc Xử lý phản hồi từ Google sau khi xác thực.
 * Nếu xác thực thành công, sẽ gọi `googleCallback`. Nếu thất bại, chuyển hướng về trang /login.
 * @access Public
 */
// BE: routes/authRoute.js (phần callback)
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        let errorMessage = "authentication_failed"; // Mặc định
        if (err.message === "account_not_found") {
          // <--- Đảm bảo bạn đang kiểm tra chuỗi này
          errorMessage = "account_not_found";
        } else if (err.message === "server_error_oauth") {
          errorMessage = "server_error_oauth";
        } else if (err.message === "account_already_linked") {
          errorMessage = "account_already_linked";
        } else if (err.message === "Email không khả dụng từ Google Profile.") {
          // Trường hợp email trống
          errorMessage = "email_not_available";
        } else if (err.message === "user_not_found_deserialize") {
          // Từ deserializeUser
          errorMessage = "user_not_found_session";
        }
        // Các lỗi khác từ Passport như email không khả dụng, v.v.
        else {
          errorMessage = "google_auth_error";
        }
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(errorMessage)}`
        );
      }
      if (!user) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(
            "authentication_failed"
          )}`
        );
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);

export default router;
