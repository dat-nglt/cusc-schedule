import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const googleId = profile.id;

      // Tìm user đã tồn tại
      let user = await User.findOne({ where: { email } });

      if (user) {
        // User đã tồn tại, cập nhật google_id nếu chưa có
        if (!user.google_id) {
          await user.update({ google_id: googleId });
        }
        return done(null, user);
      } else {
        // Tạo user mới từ Google
        user = await User.create({
          name: name,
          email: email,
          google_id: googleId,
          role: 'student', // default role cho Google login
          status: 'active',
          password: null // Không cần password cho Google login
        });
        return done(null, user);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }
));

// Serialize user (save to session)
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
