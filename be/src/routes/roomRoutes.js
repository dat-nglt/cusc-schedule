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

roomRoutes.get("/getAll", authenticateAndAuthorize, getAllRoomsController);
roomRoutes.get("/:id", authenticateAndAuthorize, getRoomByIdController);
roomRoutes.post("/create", authenticateAndAuthorize, createRoomController);
roomRoutes.put("/update/:id", authenticateAndAuthorize, updateRoomController);
roomRoutes.delete("/delete/:id", authenticateAndAuthorize, deleteRoomController);

// import JSON routes
roomRoutes.post("/importJson", authenticateAndAuthorize, importRoomsFromJSONController);
export default roomRoutes;