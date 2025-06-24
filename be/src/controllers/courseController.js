import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from "../services/courseService.js";
import { successResponse, errorResponse } from "../utils/APIResponse.js";

export const getAllCoursesController = async (req, res) => {
  try {
    const courses = await getAllCourses();
    return successResponse(res, courses, "Courses fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message || "Error fetching courses", 500);
  }
};

// GET /courses/:id
export const getCourseByIdController = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return errorResponse(res, "Course not found", 404);
    return successResponse(res, course, "Course fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /courses
export const createCourseController = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    return successResponse(res, course, "Course created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// PUT /courses/:id
export const updateCourseController = async (req, res) => {
  try {
    const course = await updateCourse(req.params.id, req.body);
    return successResponse(res, course, "Course updated");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// DELETE /courses/:id
export const deleteCourseController = async (req, res) => {
  try {
    await deleteCourse(req.params.courseid); // Sử dụng courseid
    return successResponse(res, null, "Course deleted");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const listCoursesController = async (req, res) => {
  try {
    const { courseid, coursename, startdate } = req.query;

    const filters = { courseid, coursename, startdate };

    const courses = await listCourses(filters);

    // ✅ Trả về mảng dữ liệu trực tiếp
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error listing courses" });
  }
};