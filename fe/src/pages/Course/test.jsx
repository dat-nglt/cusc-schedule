// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
// import axios from 'axios';
// import CourseTable from './CourseTable'; // Import CourseTable component

// const TestCourseListStandalone = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         console.log('Gọi API tới:', 'http://localhost:3000/api/courses'); // Log URL
//         const response = await axios.get('http://localhost:3000/api/courses', {
//           timeout: 5000, // Đặt timeout 5 giây
//         });
//         console.log('Phản hồi từ API:', response.data); // Log toàn bộ dữ liệu trả về

//         // Kiểm tra và xử lý dữ liệu
//         let coursesData = [];
//         if (Array.isArray(response.data)) {
//           coursesData = response.data.map((course, index) => ({
//             stt: index + 1,
//             courseid: course.courseid, // Sử dụng courseid theo model
//             coursename: course.coursename,
//             startdate: course.startdate,
//             enddate: course.enddate,
//           }));
//         } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
//           // Nếu BE trả về { data: [...] }
//           coursesData = response.data.data.map((course, index) => ({
//             stt: index + 1,
//             courseid: course.courseid,
//             coursename: course.coursename,
//             startdate: course.startdate,
//             enddate: course.enddate,
//           }));
//         } else {
//           throw new Error('Dữ liệu từ API không phải là mảng hợp lệ');
//         }

//         setCourses(coursesData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Lỗi chi tiết:', err.response?.status, err.response?.data || err.message); // Log lỗi chi tiết
//         setError(`Lỗi khi tải danh sách khóa học: ${err.message}`);
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading) return <Typography>Loading...</Typography>;
//   if (error) return <Typography color="error">{error}</Typography>;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Test Danh Sách Khóa Học (Standalone)
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>STT</TableCell>
//             <TableCell>Mã Khóa Học</TableCell>
//             <TableCell>Tên Khóa Học</TableCell>
//             <TableCell>Thời Gian Bắt Đầu</TableCell>
//             <TableCell>Thời Gian Kết Thúc</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {courses.map((course) => (
//             <TableRow key={course.courseid}>
//               <TableCell>{course.stt}</TableCell>
//               <TableCell>{course.courseid}</TableCell>
//               <TableCell>{course.coursename}</TableCell>
//               <TableCell>{course.startdate}</TableCell>
//               <TableCell>{course.enddate}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       {courses.length === 0 && <Typography>Không có khóa học nào để hiển thị.</Typography>}
//     </Box>
//   );
// };

// export default TestCourseListStandalone;