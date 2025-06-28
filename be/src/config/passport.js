// config/passport.js
import passport from "passport";
import logger from "../utils/logger.js"; // Import logger đã cấu hình
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  updateUserGoogleId,
  getUserId,
} from "../services/userService.js";
import dotenv from "dotenv";

dotenv.config();

// Export một hàm để cấu hình Passport
const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const name = profile.displayName;
          const googleId = profile.id;

          // Tìm user bằng google_id trước
          let userInfo = await findUserByGoogleId(googleId);

          if (userInfo) {
            // User đã tồn tại với google_id này
            return done(null, {
              user: userInfo.user,
              role: userInfo.role,
              model: userInfo.model,
              id: getUserId(userInfo),
            });
          }

          // Tìm user bằng email
          userInfo = await findUserByEmail(email);

          if (userInfo) {
            // User tồn tại nhưng chưa có google_id, cập nhật google_id
            await updateUserGoogleId(userInfo, googleId);
            return done(null, {
              user: userInfo.user,
              role: userInfo.role,
              model: userInfo.model,
              id: getUserId(userInfo),
            });
          } else {
            // User không tồn tại trong hệ thống
            // Chỉ cho phép đăng nhập nếu user đã được tạo trước trong hệ thống
            return done(
              new Error(
                "Email not found in system. Please contact administrator."
              ),
              null
            );
          }
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );

  // Serialize user (save to session)
  passport.serializeUser((userObj, done) => {
    done(null, {
      id: userObj.id,
      role: userObj.role,
      model: userObj.model,
    });
  });

  // Deserialize user
  passport.deserializeUser(async (sessionData, done) => {
    try {
      const userInfo = await findUserById(sessionData.id);
      if (userInfo) {
        done(null, {
          user: userInfo.user,
          role: userInfo.role,
          model: userInfo.model,
          id: getUserId(userInfo),
        });
      } else {
        done(new Error("User not found"), null);
      }
    } catch (error) {
      done(error, null);
    }
  });

  logger.info("✅ Passport configuration function loaded."); // Changed from console.log
};

export default configurePassport; // Export hàm cấu hình
