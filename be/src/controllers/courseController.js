import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  listCourses
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

// GET /courses/:course_id
export const getCourseByIdController = async (req, res) => {
  try {
    const course = await getCourseById(req.params.course_id);
    if (!course) return errorResponse(res, "Course not found", 404);
    return successResponse(res, course, "Course fetched");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /courses/add
export const createCourseController = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    return successResponse(res, course, "Course created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// PUT /courses/edit/:course_id
export const updateCourseController = async (req, res) => {
  try {
    const course = await updateCourse(req.params.course_id, req.body);
    return successResponse(res, course, "Course updated");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// DELETE /courses/delete/:course_id
export const deleteCourseController = async (req, res) => {
  try {
    await deleteCourse(req.params.course_id);
    return successResponse(res, null, "Course deleted");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// LẤY DANH SÁCH CÁC KHÓA HỌC VỚI CÁC BỘ LỌC
export const listCoursesController = async (req, res) => {
  try {
    const { course_id, course_name, start_date } = req.query;

    const filters = { course_id, course_name, start_date };

    const courses = await listCourses(filters);

    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error listing courses" });
  }
};