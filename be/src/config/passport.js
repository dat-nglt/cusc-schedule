// BE: config/passport.js
import passport from "passport";
import logger from "../utils/logger.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  findUserByEmail,
  findUserByGoogleId,
  findExistsUserByIdService,
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
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const clientIntendedRole = req.session.role || null; // <--- LẤY ROLE TỪ ĐÂY
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;
          const googleId = profile.id;

          if (!email) {
            logger.warn(
              "Google Profile không cung cấp email. Không thể xác định người dùng."
            );
            return done(new Error("email_not_available"), null);
          }

          // --- BƯỚC 1: Tìm người dùng bằng google_id trong bảng Accounts ---
          const foundByGoogleId = await findUserByGoogleId(googleId);

          if (foundByGoogleId) {
            if (foundByGoogleId.role == clientIntendedRole) {
              logger.info(
                `Đăng nhập Google thành công cho user: ${email} (ID: ${foundByGoogleId.id})`
              );
              // Bạn có thể xóa role khỏi session sau khi sử dụng thành công
              delete req.session.role;
              return done(null, {
                id: foundByGoogleId.id,
                role: foundByGoogleId.role,
              });
            } else {
              // *** TRẢ VỀ LỖI CỤ THỂ HƠN TẠI ĐÂY ***
              logger.warn(
                `Google ID ${googleId} tồn tại nhưng vai trò không khớp. User: ${email}, DB Role: ${foundByGoogleId.role}, Client Role: ${clientIntendedRole}`
              );
              delete req.session.role; // Xóa role khỏi session để tránh các lần thử không khớp sau này
              return done(new Error("invalid_role_access"), null);
            }
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
              return done(new Error("valid_linked_account"), null);
            }

            if (foundByEmail.role == clientIntendedRole) {
              console.log("___________________________________________");
              logger.info(
                `Đăng nhập Google thành công cho user hiện có: ${email} (ID: ${foundByEmail.id})`
              );
              console.log("___________________________________________");
              // Bạn có thể xóa role khỏi session sau khi sử dụng thành công
              delete req.session.role;
              return done(null, {
                id: foundByEmail.id,
                role: foundByEmail.role,
              });
            } else {
              // *** TRẢ VỀ LỖI CỤ THỂ HƠN TẠI ĐÂY ***
              logger.warn(
                `Email ${email} tồn tại nhưng vai trò không khớp. DB Role: ${foundByEmail.role}, Client Role: ${clientIntendedRole}`
              );
              delete req.session.role; // Xóa role khỏi session
              return done(new Error("invalid_role_access"), null);
            }
          }

          console.log("___________________________________________");
          logger.warn(
            `Email ${email} từ Google không tìm thấy trong hệ thống. Không được phép tạo mới.`
          );
          console.log("___________________________________________");
          delete req.session.role; // Xóa role khỏi session
          return done(new Error("account_not_found"), null);
        } catch (error) {
          console.log("___________________________________________");
          logger.error(
            `Lỗi trong quá trình Google OAuth: ${error.message}`,
            error
          );
          console.log("___________________________________________");

          return done("authentication_failed", null);
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
      const existsUser = await findExistsUserByIdService(sessionData.id); // Gọi hàm đã được cập nhật

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

  logger.info("✅ Cấu hình Passport đã được tải.");
};

export default configurePassport;
