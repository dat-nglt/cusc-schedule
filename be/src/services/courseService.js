import Course from "../models/Course.js";
import { Op } from 'sequelize'; // Đảm bảo import Op nếu chưa có

export const getAllCourses = async () => {
  try {
    const courses = await Course.findAll();
    return courses;
  } catch (error) {
    throw new Error('Error fetching courses: ' + error.message);
  }
};

// Get one course by ID
export const getCourseById = async (course_id) => {
  return await Course.findByPk(course_id);
};

// Create a new course
export const createCourse = async (data) => {
  return await Course.create(data);
};

// Update a course
export const updateCourse = async (course_id, data) => {
  const course = await Course.findByPk(course_id);
  if (!course) throw new Error("Course not found");
  return await course.update(data);
};

// Delete a course
export const deleteCourse = async (course_id) => {
  const course = await Course.findOne({ where: { course_id } });
  if (!course) throw new Error("Course not found");
  return await course.destroy();
};

/**
 * Lọc danh sách các khóa học theo mã, tên, và thời gian bắt đầu
 */
export const listCourses = async (filters) => {
  try {
    const whereClause = {};

    // Lọc theo course_id
    if (filters.course_id) {
      whereClause.course_id = {
        [Op.iLike]: `%${filters.course_id}%`
      };
    }

    // Lọc theo course_name
    if (filters.course_name) {
      whereClause.course_name = {
        [Op.iLike]: `%${filters.course_name}%`
      };
    }

    // Lọc theo start_date
    if (filters.start_date) {
      whereClause.start_date = filters.start_date; // YYYY-MM-DD
    }

    const courses = await Course.findAll({
      where: whereClause,
      attributes: ['course_id', 'course_name', 'start_date', 'end_date', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    return courses;
  } catch (error) {
    throw new Error('Error listing courses: ' + error.message);
  }
};