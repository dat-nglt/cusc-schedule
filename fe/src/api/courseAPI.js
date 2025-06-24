// import axiosInstance from './axiosConfig';

// export const getCourses = async () => {
//   try {
//     const response = await axiosInstance.get('/api/courses');
//     return response.data.map((course, index) => ({
//       stt: index + 1,
//       courseid: course.courseid,
//       coursename: course.coursename,
//       startdate: course.startdate,
//       enddate: course.enddate,
//       created_at: course.created_at,
//       updated_at: course.updated_at,
//     }));
//   } catch (error) {
//     console.error('Error fetching courses:', error);
//     throw new Error('Lỗi khi tải danh sách khóa học');
//   }
// };

// export const deleteCourse = async (courseid) => {
//   try {
//     const response = await axiosInstance.post('/api/courses/delete', { courseid });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting course:', error);
//     throw new Error('Lỗi khi xóa khóa học');
//   }
// };