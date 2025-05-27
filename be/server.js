import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupRoutes from "./routes/router.js";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



setupRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});