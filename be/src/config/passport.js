// config/passport.js
import passport from "passport";
import logger from "../utils/logger.js"; // Import logger đã cấu hình để ghi nhật ký
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
    findUserByEmail,
    findUserByGoogleId,
    findUserById,
    updateUserGoogleId,
    getUserId,
} from "../services/userService.js"; // Import các hàm liên quan đến user service
import dotenv from "dotenv";

dotenv.config(); // Tải các biến môi trường từ file .env

/**
 * Hàm cấu hình Passport.
 * Đây là hàm chính để thiết lập các chiến lược xác thực và serialize/deserialize người dùng.
 */
const configurePassport = () => {
    // Sử dụng chiến lược Google OAuth 2.0
    passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID, // Client ID của ứng dụng Google từ biến môi trường
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret của ứng dụng Google từ biến môi trường
                callbackURL: process.env.GOOGLE_CALLBACK_URL, // URL callback sau khi xác thực Google
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                    const name = profile.displayName;
                    const googleId = profile.id;

                    if (!email) {
                        logger.warn("Không tìm thấy email trong hồ sơ Google Profile.");
                        return done(new Error("Không tìm thấy email trong hồ sơ Google Profile."), null);
                    }

                    // Bước 1: Tìm người dùng bằng google_id trước
                    let userInfo = await findUserByGoogleId(googleId);

                    if (userInfo) {
                        // Nếu người dùng đã tồn tại với google_id này
                        logger.info(`Đăng nhập thành công qua Google cho user: ${email} (Google ID: ${googleId})`);
                        return done(null, {
                            user: userInfo.user,
                            role: userInfo.role,
                            model: userInfo.model,
                            id: getUserId(userInfo), // Lấy ID thực của user từ userInfo
                        });
                    }

                    // Bước 2: Nếu không tìm thấy bằng google_id, tìm người dùng bằng email
                    userInfo = await findUserByEmail(email);

                    if (userInfo) {
                        // Nếu người dùng tồn tại trong hệ thống nhưng chưa có google_id, cập nhật google_id
                        await updateUserGoogleId(userInfo, googleId);
                        logger.info(`Đã cập nhật Google ID cho user: ${email}`);
                        return done(null, {
                            user: userInfo.user,
                            role: userInfo.role,
                            model: userInfo.model,
                            id: getUserId(userInfo),
                        });
                    } else {
                        // Nếu người dùng không tồn tại trong hệ thống với cả google_id lẫn email
                        // Chỉ cho phép đăng nhập nếu người dùng đã được tạo trước trong hệ thống
                        logger.warn(`Email ${email} từ Google không tìm thấy trong hệ thống.`);
                        return done(
                            new Error(
                                "Email của bạn không tồn tại trong hệ thống. Vui lòng liên hệ quản trị viên."
                            ),
                            null
                        );
                    }
                } catch (error) {
                    logger.error(`Lỗi trong quá trình Google OAuth: ${error.message}`, error);
                    return done(error, null); // Truyền lỗi cho Passport
                }
            }
        )
    );

    /**
     * Serialize user: Xác định dữ liệu nào của người dùng sẽ được lưu vào phiên (session).
     * Hàm này được gọi sau khi xác thực thành công.
     * @param {Object} userObj - Đối tượng người dùng trả về từ chiến lược xác thực.
     * @param {Function} done - Callback để hoàn tất quá trình serialize.
     */
    passport.serializeUser((userObj, done) => {
        // Lưu ID, vai trò và model của người dùng vào session
        done(null, {
            id: userObj.id,
            role: userObj.role,
            model: userObj.model,
        });
    });

    /**
     * Deserialize user: Lấy thông tin người dùng từ ID đã lưu trong phiên.
     * Hàm này được gọi trên mỗi request sau khi phiên được thiết lập.
     * @param {Object} sessionData - Dữ liệu đã lưu trong session (được trả về từ serializeUser).
     * @param {Function} done - Callback để hoàn tất quá trình deserialize.
     */
    passport.deserializeUser(async (sessionData, done) => {
        try {
            // Tìm người dùng bằng ID được lưu trong session
            const userInfo = await findUserById(sessionData.id);
            if (userInfo) {
                // Nếu tìm thấy người dùng, trả về đối tượng người dùng đầy đủ
                done(null, {
                    user: userInfo.user,
                    role: userInfo.role,
                    model: userInfo.model,
                    id: getUserId(userInfo), // Lấy ID thực của user
                });
            } else {
                // Nếu không tìm thấy người dùng, thông báo lỗi
                logger.warn(`Không tìm thấy user với ID: ${sessionData.id} trong quá trình deserialize.`);
                done(new Error("Không tìm thấy người dùng."), null);
            }
        } catch (error) {
            logger.error(`Lỗi trong quá trình deserialize user: ${error.message}`, error);
            done(error, null); // Truyền lỗi cho Passport
        }
    });

    // Log thông báo khi cấu hình Passport được tải thành công
    logger.info("✅ Cấu hình Passport đã được tải.");
};

export default configurePassport; // Export hàm cấu hình để có thể import và gọi từ file chính của ứng dụng