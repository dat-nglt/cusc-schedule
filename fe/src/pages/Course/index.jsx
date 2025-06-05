import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TablePagination,
} from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';
import { Add as AddIcon } from '@mui/icons-material';

const Course = () => {
  // Dữ liệu mẫu thực tế cho danh sách khóa học
  const courses = [
    {
      id: 1,
      stt: 1,
      maKhoaHoc: 'IT2025',
      tenKhoaHoc: 'Lập trình Web',
      thoiGianBatDau: '2025-06-10 08:00',
      thoiGianKetThuc: '2025-06-10 11:00',
      thoiGianTao: '2025-05-20 14:30',
      thoiGianCapNhat: '2025-05-25 09:15',
    },
    {
      id: 2,
      stt: 2,
      maKhoaHoc: 'EC2025',
      tenKhoaHoc: 'Kinh tế vi mô',
      thoiGianBatDau: '2025-06-15 13:00',
      thoiGianKetThuc: '2025-06-15 16:00',
      thoiGianTao: '2025-05-22 10:00',
      thoiGianCapNhat: '2025-05-28 14:20',
    },
    {
      id: 3,
      stt: 3,
      maKhoaHoc: 'MA2025',
      tenKhoaHoc: 'Toán cao cấp',
      thoiGianBatDau: '2025-07-01 09:00',
      thoiGianKetThuc: '2025-07-01 12:00',
      thoiGianTao: '2025-05-25 15:45',
      thoiGianCapNhat: '2025-06-01 11:30',
    },
    {
      id: 4,
      stt: 4,
      maKhoaHoc: 'PH2025',
      tenKhoaHoc: 'Vật lý đại cương',
      thoiGianBatDau: '2025-06-20 14:00',
      thoiGianKetThuc: '2025-06-20 17:00',
      thoiGianTao: '2025-05-21 09:00',
      thoiGianCapNhat: '2025-05-29 16:10',
    },
    {
      id: 5,
      stt: 5,
      maKhoaHoc: 'EN2025',
      tenKhoaHoc: 'Tiếng Anh học thuật',
      thoiGianBatDau: '2025-06-25 10:00',
      thoiGianKetThuc: '2025-06-25 12:00',
      thoiGianTao: '2025-05-23 13:30',
      thoiGianCapNhat: '2025-06-02 08:45',
    },
    {
      id: 6,
      stt: 6,
      maKhoaHoc: 'CS2025',
      tenKhoaHoc: 'Cấu trúc dữ liệu',
      thoiGianBatDau: '2025-06-18 08:30',
      thoiGianKetThuc: '2025-06-18 11:30',
      thoiGianTao: '2025-05-24 11:15',
      thoiGianCapNhat: '2025-05-30 14:00',
    },
    {
      id: 7,
      stt: 7,
      maKhoaHoc: 'PS2025',
      tenKhoaHoc: 'Tâm lý học đại cương',
      thoiGianBatDau: '2025-07-05 13:00',
      thoiGianKetThuc: '2025-07-05 16:00',
      thoiGianTao: '2025-05-26 16:20',
      thoiGianCapNhat: '2025-06-03 10:30',
    },
    {
      id: 8,
      stt: 8,
      maKhoaHoc: 'HI2025',
      tenKhoaHoc: 'Lịch sử văn minh thế giới',
      thoiGianBatDau: '2025-06-12 09:00',
      thoiGianKetThuc: '2025-06-12 12:00',
      thoiGianTao: '2025-05-19 14:00',
      thoiGianCapNhat: '2025-05-27 15:50',
    },
    {
      id: 9,
      stt: 9,
      maKhoaHoc: 'CH2025',
      tenKhoaHoc: 'Hóa học cơ bản',
      thoiGianBatDau: '2025-06-22 09:00',
      thoiGianKetThuc: '2025-06-22 12:00',
      thoiGianTao: '2025-05-18 10:00',
      thoiGianCapNhat: '2025-05-26 13:20',
    },
    {
      id: 10,
      stt: 10,
      maKhoaHoc: 'BI2025',
      tenKhoaHoc: 'Sinh học đại cương',
      thoiGianBatDau: '2025-06-28 14:00',
      thoiGianKetThuc: '2025-06-28 17:00',
      thoiGianTao: '2025-05-27 15:00',
      thoiGianCapNhat: '2025-06-04 09:30',
    },
    {
      id: 11,
      stt: 11,
      maKhoaHoc: 'GE2025',
      tenKhoaHoc: 'Địa lý kinh tế',
      thoiGianBatDau: '2025-07-02 08:00',
      thoiGianKetThuc: '2025-07-02 11:00',
      thoiGianTao: '2025-05-28 11:30',
      thoiGianCapNhat: '2025-06-05 10:00',
    },
    {
      id: 12,
      stt: 12,
      maKhoaHoc: 'LI2025',
      tenKhoaHoc: 'Văn học Việt Nam',
      thoiGianBatDau: '2025-06-17 13:00',
      thoiGianKetThuc: '2025-06-17 16:00',
      thoiGianTao: '2025-05-19 16:00',
      thoiGianCapNhat: '2025-05-28 12:45',
    },
  ];

  // Dữ liệu biểu đồ thực tế theo năm
  const yearlyData = {
    labels: ['2021', '2022', '2023', '2024', '2025'],
    values: [8, 10, 12, 15, 18], // Số lượng khóa học tăng dần qua các năm
  };

  const courseDistribution = [
    { id: 0, value: 4, label: 'Công nghệ thông tin' },
    { id: 1, value: 3, label: 'Kinh tế' },
    { id: 2, value: 3, label: 'Toán học' },
    { id: 3, value: 2, label: 'Văn học' },
  ];

  // State cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8); // Số khóa học mỗi trang

  // Hàm xử lý khi nhấn nút Thêm khóa học
  const handleAddCourse = () => {
    console.log('Mở form thêm khóa học');
    // Sau này có thể tích hợp với form hoặc API
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedCourses = courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, zIndex: 10 }}>
      {/* Main Content */}
      <Box sx={{ width: 'calc(100vw - 400px)', display: 'flex', flexDirection: 'row', gap: 2, mb: 3 }}>
        {/* Bảng danh sách khóa học */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Danh sách khóa học
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddCourse}
                sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
              >
                Thêm khóa học
              </Button>
            </Box>
            {courses.length === 0 ? (
              <Typography>Không có khóa học nào để hiển thị.</Typography>
            ) : (
              <>
                <Table sx={{ minWidth: 650, border: '1px solid #e0e0e0' }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                        STT
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                        Mã khóa học
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0' }}>
                        Tên khóa học
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                        Thời gian bắt đầu
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                        Thời gian kết thúc
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                        Thời gian tạo
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center' }}>
                        Thời gian cập nhật
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedCourses.map((course, index) => (
                      <TableRow
                        key={course.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                          '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                          borderBottom: '1px solid #e0e0e0',
                        }}
                      >
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                          {course.stt}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                          {course.maKhoaHoc}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                          {course.tenKhoaHoc}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                          {course.thoiGianBatDau}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                          {course.thoiGianKetThuc}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                          {course.thoiGianTao}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>{course.thoiGianCapNhat}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={courses.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Biểu đồ và thống kê */}
        <Box sx={{ width: 300 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Số lượng khóa học theo năm
              </Typography>
              <BarChart
                width={300}
                height={200}
                series={[{ data: yearlyData.values, label: 'Số khóa học' }]}
                xAxis={[{ scaleType: 'band', data: yearlyData.labels }]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Phân bố khóa học
              </Typography>
              <PieChart
                series={[
                  {
                    data: courseDistribution,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                  },
                ]}
                width={300}
                height={200}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Course;