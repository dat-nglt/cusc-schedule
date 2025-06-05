import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  Warning as WarningIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { BarChart, PieChart } from '@mui/x-charts';

const Course = () => {
  // Dữ liệu mẫu thực tế cho danh sách khóa học
  const courses = [
    {
      id: 1,
      code: 'IT2025',
      name: 'Lập trình Web',
      startDate: '2025-06-10',
      capacity: 40,
      status: 'Đang hoạt động',
    },
    {
      id: 2,
      code: 'EC2025',
      name: 'Kinh tế vi mô',
      startDate: '2025-06-15',
      capacity: 35,
      status: 'Đang hoạt động',
    },
    {
      id: 3,
      code: 'MA2025',
      name: 'Toán cao cấp',
      startDate: '2025-07-01',
      capacity: 50,
      status: 'Sắp khai giảng',
    },
    {
    id: 4,
    code: 'PH2025',
    name: 'Vật lý đại cương',
    startDate: '2025-06-20',
    capacity: 45,
    status: 'Đang hoạt động',
  },
  {
    id: 5,
    code: 'EN2025',
    name: 'Tiếng Anh học thuật',
    startDate: '2025-06-25',
    capacity: 30,
    status: 'Sắp khai giảng',
  },
  {
    id: 6,
    code: 'CS2025',
    name: 'Cấu trúc dữ liệu',
    startDate: '2025-06-18',
    capacity: 40,
    status: 'Đang hoạt động',
  },
  {
    id: 7,
    code: 'PS2025',
    name: 'Tâm lý học đại cương',
    startDate: '2025-07-05',
    capacity: 28,
    status: 'Sắp khai giảng',
  },
  {
    id: 8,
    code: 'HI2025',
    name: 'Lịch sử văn minh thế giới',
    startDate: '2025-06-12',
    capacity: 32,
    status: 'Đang hoạt động',
  },
  ];

  // Dữ liệu thống kê nhanh thực tế
  const stats = {
    classes: 45, // Tổng số lớp học trong kỳ
    courses: 12, // Tổng số khóa học hiện tại
    rooms: 20,  // Tổng số phòng học khả dụng
    conflicts: 2, // Số xung đột lịch (giảm xuống mức thực tế)
  };

  // Dữ liệu biểu đồ thực tế
  const weeklyData = {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    values: [15, 12, 14, 10, 13, 5], // Số lượng khóa học diễn ra trong tuần
  };

  const courseDistribution = [
    { id: 0, value: 4, label: 'Công nghệ thông tin' },
    { id: 1, value: 3, label: 'Kinh tế' },
    { id: 2, value: 3, label: 'Toán học' },
    { id: 3, value: 2, label: 'Văn học' },
  ];

  return (
    <Box sx={{ p: 3, zIndex: 10 }}>
      {/* Quick Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <SchoolIcon color="primary" />
              <Typography variant="h6" mt={1}>
                Số lớp học
              </Typography>
              <Typography variant="h4">{stats.classes}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fff3e0' }}>
            <CardContent>
              <PeopleIcon color="warning" />
              <Typography variant="h6" mt={1}>
                Số khóa học
              </Typography>
              <Typography variant="h4">{stats.courses}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e8f5e9' }}>
            <CardContent>
              <RoomIcon color="success" />
              <Typography variant="h6" mt={1}>
                Số phòng học
              </Typography>
              <Typography variant="h4">{stats.rooms}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#ffebee' }}>
            <CardContent>
              <WarningIcon color="error" />
              <Typography variant="h6" mt={1}>
                Xung đột
              </Typography>
              <Typography variant="h4">{stats.conflicts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Box sx={{ width: 'calc(100vw - 400px)', display: 'flex', flexDirection: 'row', gap: 2, mb: 3 }}>
        {/* Bảng danh sách khóa học */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Danh sách khóa học
            </Typography>
            {courses.length === 0 ? (
              <Typography>Không có khóa học nào để hiển thị.</Typography>
            ) : (
              <Table sx={{ minWidth: 650, border: '1px solid #e0e0e0' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
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
                      Sĩ số
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center' }}>
                      Trạng thái
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course, index) => (
                    <TableRow
                      key={course.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                        '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                        {course.code}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                        {course.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                        {course.startDate}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                        {course.capacity}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 1.5 }}>{course.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Biểu đồ và thống kê */}
        <Box sx={{ width: 300 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Số lượng khóa học theo tuần
              </Typography>
              <BarChart
                width={300}
                height={200}
                series={[{ data: weeklyData.values, label: 'Số khóa học' }]}
                xAxis={[{ scaleType: 'band', data: weeklyData.labels }]}
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