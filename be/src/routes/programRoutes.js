import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware";
import {
    getAllProgramsController,
    getProgramByIdController,
    createProgramController,
    updateProgramController,
    deleteProgramController,
    importProgramsFromJSONController,
    downloadTemplateController
} from "../controllers/programController";

const programRoutes = express.Router();

programRoutes.get("/getAll", authenticateAndAuthorize(["admin", "training_officer"]), getAllProgramsController);
programRoutes.get("/:id", authenticateAndAuthorize(["admin", "training_officer"]), getProgramByIdController);
programRoutes.post("/create", authenticateAndAuthorize(["admin", "training_officer"]), createProgramController);
programRoutes.put("/update/:id", authenticateAndAuthorize(["admin", "training_officer"]), updateProgramController);
programRoutes.delete("/delete/:id", authenticateAndAuthorize(["admin", "training_officer"]), deleteProgramController);

// Import JSON route
programRoutes.post("/importJson", authenticateAndAuthorize(["admin", "training_officer"]), importProgramsFromJSONController);
programRoutes.get("/template/download", downloadTemplateController);
export default programRoutes;