import {
    getAllSubjectsController,
    getSubjectByIdController,
    createSubjectController,
    updateSubjectController,
    deleteSubjectController,
    getSubjectsBySemesterController,
    importSubjectsFromJSONController,
    downloadTemplateController
} from "../controllers/subjectController";
import { authenticateAndAuthorize } from "../middleware/authMiddleware";
import express from "express";

const subjectRoutes = express.Router();

subjectRoutes.get("/getAll", authenticateAndAuthorize(["admin", "training_officer"]), getAllSubjectsController);
subjectRoutes.get("/:id", authenticateAndAuthorize(["admin", "training_officer"]), getSubjectByIdController);
subjectRoutes.post("/create", authenticateAndAuthorize(["admin", "training_officer"]), createSubjectController);
subjectRoutes.put("/update/:id", authenticateAndAuthorize(["admin", "training_officer"]), updateSubjectController);
subjectRoutes.delete("/delete/:id", authenticateAndAuthorize(["admin", "training_officer"]), deleteSubjectController);

//tìm kiếm học phần theo học kỳ
subjectRoutes.get("/semester/:semesterId", authenticateAndAuthorize(["admin", "training_officer"]), getSubjectsBySemesterController);

//import json từ fe (import file excel từ frontend hiển thị preview và chuyển thành json rồi gửi về backend dưới dạng json)
subjectRoutes.post("/importJson", authenticateAndAuthorize(["admin", "training_officer"]), importSubjectsFromJSONController);
//tải template mẫu
subjectRoutes.get("/template/download", downloadTemplateController);

export default subjectRoutes;
