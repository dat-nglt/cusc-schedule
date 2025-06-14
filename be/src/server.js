import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import setupRoutes from "./routes/router.js";
import bodyParser from "body-parser";
import connectDB from "./config/database.js";
import multer from "multer";
import passport from "passport";
import "./config/passport.js"; // Ensure passport is configured
import session from "express-session";
// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());

//connect database
connectDB();

//body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//router
setupRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});