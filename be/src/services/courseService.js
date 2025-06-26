import Course from "../models/Course.js";

export const getAllCourses = async () => {
  try {
    const courses = await Course.findAll();
    return courses;
  } catch (error) {
    throw new Error('Error fetching courses: ' + error.message);
  }
};

// Get one course by ID
export const getCourseById = async (id) => {
  return await Course.findByPk(id);
};

// Create a new course
export const createCourse = async (data) => {
  return await Course.create(data);
};

// Update a course
export const updateCourse = async (id, data) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error("Course not found");
  return await course.update(data);
};

// Delete a course
export const deleteCourse = async (courseid) => {
  const course = await Course.findOne({ where: { courseid } }); // Sử dụng courseid
  if (!course) throw new Error("Course not found");
  return await course.destroy();
};

/**
 * Lọc danh sách các khóa học theo mã, tên, và thời gian bắt đầu
 */
export const listCourses = async (filters) => {
  try {
    const whereClause = {};

    // Lọc theo courseid
    if (filters.courseid) {
      whereClause.courseid = {
        [Op.iLike]: `%${filters.courseid}%`
      };
    }

    // Lọc theo coursename
    if (filters.coursename) {
      whereClause.coursename = {
        [Op.iLike]: `%${filters.coursename}%`
      };
    }

    // Lọc theo startdate
    if (filters.startdate) {
      whereClause.startdate = filters.startdate; // YYYY-MM-DD
    }

    const courses = await Course.findAll({
      where: whereClause,
      attributes: ['courseid', 'coursename', 'startdate', 'enddate', 'status'],
      order: [['created_at', 'DESC']]
    });

    return courses;
  } catch (error) {
    throw new Error('Error listing courses: ' + error.message);
  }
};

