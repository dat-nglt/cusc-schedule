import express from "express";
import { authenticateAndAuthorize } from "../middleware/authMiddleware";
import {
    getAllRoomsController,
    getRoomByIdController,
    createRoomController,
    updateRoomController,
    deleteRoomController,
    importRoomsFromJSONController,
} from "../controllers/roomController";

const roomRoutes = express.Router();

roomRoutes.get("/getAll",   authenticateAndAuthorize(["admin", "training_officer"]), getAllRoomsController);
roomRoutes.get("/:id",  authenticateAndAuthorize(['admin', 'training_officer']), getRoomByIdController);
roomRoutes.post("/create",  authenticateAndAuthorize(['admin', 'training_officer']), createRoomController);
roomRoutes.put("/update/:id",  authenticateAndAuthorize(['admin', 'training_officer']), updateRoomController);
roomRoutes.delete("/delete/:id",  authenticateAndAuthorize(['admin', 'training_officer']), deleteRoomController);

// import JSON routes
roomRoutes.post("/importJson",  authenticateAndAuthorize(['admin', 'training_officer']), importRoomsFromJSONController);
export default roomRoutes;