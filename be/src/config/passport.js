// BE: config/passport.js
import passport from "passport";
import logger from "../utils/logger.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  // Hàm này cần được cập nhật để chỉ xử lý bảng Account
  updateUserGoogleId,
} from "../services/userService.js";
import dotenv from "dotenv";

dotenv.config();

// Hàm getUserId giờ đây đơn giản hơn nhiều
// Vì userInfo.user.id chính là ID chung của user trong bảng Accounts
const getUserId = (userInfo) => {
  return userInfo.user.id;
};

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
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;
          const googleId = profile.id;

          if (!email) {
            logger.warn(
              "Google Profile không cung cấp email. Không thể xác định người dùng."
            );
            return done(
              new Error("Email không khả dụng từ Google Profile."),
              null
            );
          }

          // --- BƯỚC 1: Tìm người dùng bằng google_id trong bảng Accounts ---
          const foundByGoogleId = await findUserByGoogleId(googleId);

          if (foundByGoogleId) {
            logger.info(
              `Đăng nhập Google thành công cho user: ${email} (ID: ${foundByGoogleId.id})`
            );

            // Trả về thông tin người dùng đã tìm thấy (từ bảng Accounts)
            return done(null, {
              id: foundByGoogleId.id, // ID từ bảng Accounts
              role: foundByGoogleId.role, // Vai trò từ bảng Accounts
            });
          }

          // --- BƯỚC 2: Nếu không tìm thấy bằng google_id, tìm bằng email ---
          const foundByEmail = await findUserByEmail(email);

          if (foundByEmail) {
            // Người dùng tồn tại trong hệ thống bằng email, nhưng chưa có google_id
            // Cập nhật google_id để liên kết tài khoản Google với tài khoản hiện có.
            if (!foundByEmail.googleId) {
              // `updateUserGoogleId` cần nhận account ID và googleId mới
              await updateUserGoogleId(foundByEmail.id, googleId);
              foundByEmail.googleId = googleId; // Cập nhật tạm thời đối tượng để sử dụng ngay
              logger.info(
                `Đã liên kết Google ID mới (${googleId}) cho user: ${email}`
              );
            } else if (foundByEmail.googleId !== googleId) {
              // Email khớp nhưng Google ID khác
              logger.warn(
                `Email ${email} đã tồn tại với Google ID khác trong hệ thống. (Cũ: ${foundByEmail.googleId}, Mới: ${googleId})`
              );
              return done(
                new Error(
                  "Tài khoản của bạn đã được liên kết với một tài khoản Google khác. Vui lòng sử dụng tài khoản Google đã liên kết hoặc liên hệ quản trị viên."
                ),
                null
              );
            }

            logger.info(
              `Đăng nhập Google thành công cho user hiện có: ${email} (ID: ${foundByEmail.id})`
            );
            return done(null, {
              id: foundByEmail.id,
              role: foundByEmail.role,
            });
          }

          // --- BƯỚC 3: Nếu không tìm thấy bằng cả google_id và email ---
          // Đây là trường hợp người dùng không tồn tại trong hệ thống và không được phép tạo mới.
          logger.warn(
            `Email ${email} từ Google không tìm thấy trong hệ thống. Không được phép tạo mới.`
          );
          return done(
            new Error(
              "Tài khoản của bạn không tồn tại trong hệ thống. Vui lòng liên hệ quản trị viên."
            ),
            null
          );
        } catch (error) {
          logger.error(
            `Lỗi trong quá trình Google OAuth: ${error.message}`,
            error
          );
          return done(error, null);
        }
      }
    )
  );

  // --- Serialize và Deserialize User ---
  // Phần này của Passport chủ yếu dùng để lưu trữ và lấy thông tin người dùng từ session
  // (nếu bạn đang dùng session dựa trên cookie/session store).
  // Với HTTP-Only cookie cho JWT, serialize/deserialize này chỉ hoạt động trong scope của Passport
  // và không trực tiếp liên quan đến JWT cookie bạn gửi đi.
  passport.serializeUser((userObj, done) => {
    // userObj ở đây là đối tượng được trả về từ done() trong GoogleStrategy (ví dụ: { id: ..., role: ..., user: ... })
    done(null, { id: userObj.id, role: userObj.role }); // Chỉ cần lưu ID và role để deserialize
  });

  passport.deserializeUser(async (sessionData, done) => {
    try {
      // sessionData ở đây là { id: ..., role: ... } từ serializeUser
      const userInfo = await findUserById(sessionData.id); // Gọi hàm đã được cập nhật

      if (userInfo && userInfo.user) {
        // Kiểm tra userInfo và userInfo.user có tồn tại không
        done(null, {
          id: userInfo.user.id,
          role: userInfo.user.role,
        });
      } else {
        logger.warn(
          `Không tìm thấy user với ID: ${sessionData.id} trong quá trình deserialize.`
        );
        done(new Error("Không tìm thấy người dùng."), null);
      }
    } catch (error) {
      logger.error(
        `Lỗi trong quá trình deserialize user: ${error.message}`,
        error
      );
      done(error, null);
    }
  });

  logger.info("✅ Cấu hình Passport đã được tải.");
};

export default configurePassport;
