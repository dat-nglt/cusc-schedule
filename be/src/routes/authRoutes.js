import express from "express";
import passport from "passport";
import {
  logoutController,
  googleCallbackController,
  getCurrentUserDataController,
  refreshTokenController,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /auth/logout
 * @desc Đăng xuất người dùng. Yêu cầu người dùng phải xác thực trước khi thực hiện.
 * @access Private
 */
router.post("/logout", authMiddleware, logoutController);

router.get("/current-user", authMiddleware, getCurrentUserDataController);

router.post("/refresh-token", refreshTokenController);

// --- Tuyến đường xác thực Google OAuth ---

/**
 * @route GET /auth/google
 * @desc Bắt đầu quá trình xác thực với Google.
 * Chuyển hướng người dùng đến trang đăng nhập của Google.
 * @access Public
 */

router.get(
  "/google",
  (req, res, next) => {
    const role = req.query.role || null;

    console.log("-------");
    console.log(role);
    console.log("-------");

    req.session.role = role; // Hoặc một tên biến khác tùy bạn

    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @route GET /auth/google/callback
 * @desc Xử lý phản hồi từ Google sau khi xác thực.
 * Nếu xác thực thành công, sẽ gọi `googleCallback`. Nếu thất bại, chuyển hướng về trang /login.
 * @access Public
 */
// BE: routes/authRoute.js (phần callback)
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, authenticatedUser, info) => {
      if (err) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(err.message)}`
        );
      }
      if (!authenticatedUser) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
        return res.redirect(
          `${frontendUrl}/login?error=${encodeURIComponent(
            "authentication_failed"
          )}`
        );
      }
      req.authenticatedUser = authenticatedUser;
      next();
    })(req, res, next);
  },
  googleCallbackController
);

export default router;
