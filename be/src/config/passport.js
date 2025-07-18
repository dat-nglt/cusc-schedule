// BE: config/passport.js
import passport from "passport";
import logger from "../utils/logger.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  findUserByEmail,
  findUserByGoogleId,
  findExistsUserByID,
  updateUserGoogleId,
} from "../services/userService.js";
import dotenv from "dotenv";

dotenv.config();

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;
          const googleId = profile.id;
          // const clientIntendedRole = req.roleFromGoogleAuth;

          // logger.warn(clientIntendedRole);

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

            return done(null, {
              id: foundByGoogleId.id, // ID từ bảng Accounts
              role: foundByGoogleId.role, // Vai trò từ bảng Accounts
            });
          }

          const foundByEmail = await findUserByEmail(email);

          if (foundByEmail) {
            if (!foundByEmail.googleId) {
              await updateUserGoogleId(foundByEmail.id, googleId);
              foundByEmail.googleId = googleId; // Cập nhật tạm thời đối tượng để sử dụng ngay
              logger.info(
                `Đã liên kết Google ID mới (${googleId}) cho user: ${email}`
              );
            } else if (foundByEmail.googleId !== googleId) {
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
            console.log("___________________________________________");

            logger.info(
              `Đăng nhập Google thành công cho user hiện có: ${email} (ID: ${foundByEmail.id})`
            );

            console.log("___________________________________________");

            return done(null, {
              id: foundByEmail.id,
              role: foundByEmail.role,
            });
          }

          console.log("___________________________________________");
          logger.warn(
            `Email ${email} từ Google không tìm thấy trong hệ thống. Không được phép tạo mới.`
          );
          console.log("___________________________________________");

          return done(
            new Error(
              "Tài khoản của bạn không tồn tại trong hệ thống. Vui lòng liên hệ quản trị viên."
            ),
            null
          );
        } catch (error) {
          console.log("___________________________________________");
          logger.error(
            `Lỗi trong quá trình Google OAuth: ${error.message}`,
            error
          );
          console.log("___________________________________________");

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
      const existsUser = await findExistsUserByID(sessionData.id); // Gọi hàm đã được cập nhật

      if (existsUser) {
        // Kiểm tra existsUser và existsUser.user có tồn tại không
        done(null, {
          id: existsUser.id,
          role: existsUser.role,
        });
      } else {
        console.log("___________________________________________");
        logger.warn(
          `Không tìm thấy user với ID: ${sessionData.id} trong quá trình deserialize.`
        );
        console.log("___________________________________________");
        done(new Error("Không tìm thấy người dùng."), null);
      }
    } catch (error) {
      console.log("___________________________________________");
      logger.error(
        `Lỗi trong quá trình deserialize user: ${error.message}`,
        error
      );
      console.log("___________________________________________");
      done(error, null);
    }
  });

  console.log("___________________________________________");
  logger.info("✅ Cấu hình Passport đã được tải.");
  console.log("___________________________________________");
};

export default configurePassport;
