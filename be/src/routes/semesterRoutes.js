import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware";
import {
    getAllSemestersController,
    getSemesterByIdController,
    createSemesterController,
    updateSemesterController,
    deleteSemesterController,
    importSemestersFromJSONController,
    downloadTemplateController
} from "../controllers/semesterController";

const semesterRoutes = express.Router();

semesterRoutes.get("/getAll", authenticateAndAuthorize(["admin", "training_officer"]), getAllSemestersController);
semesterRoutes.get("/:id", authenticateAndAuthorize(["admin", "training_officer"]), getSemesterByIdController);
semesterRoutes.post("/create", authenticateAndAuthorize(["admin", "training_officer"]), createSemesterController);
semesterRoutes.put("/update/:id", authenticateAndAuthorize(["admin", "training_officer"]), updateSemesterController);
semesterRoutes.delete("/delete/:id", authenticateAndAuthorize(["admin", "training_officer"]), deleteSemesterController);

//import JSON route
semesterRoutes.post("/importJson", authenticateAndAuthorize(["admin", "training_officer"]), importSemestersFromJSONController);
semesterRoutes.get('/template/download', downloadTemplateController);

export default semesterRoutes;