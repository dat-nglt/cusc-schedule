
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Visibility, Edit, Delete, Search as SearchIcon } from '@mui/icons-material';
import CourseDetailModal from './CourseDetailModal';
import AddCourseModal from './AddCourseModal';
import EditCourseModal from './EditCourseModal'; // Import modal chỉnh sửa

const Course = () => {
  // Dữ liệu mẫu thực tế cho danh sách khóa học
  const [courses, setCourses] = useState([
    { id: 1, stt: 1, maKhoaHoc: 'IS2501', tenKhoaHoc: 'Hệ thống thông tin', thoiGianBatDau: '2022-06-10', thoiGianKetThuc: '2024-07-10', thoiGianTao: '2025-05-15 09:00', thoiGianCapNhat: '2025-05-20 14:30' },
    { id: 2, stt: 2, maKhoaHoc: 'FT2501', tenKhoaHoc: 'Công nghệ thực phẩm', thoiGianBatDau: '2025-06-12', thoiGianKetThuc: '2025-07-12', thoiGianTao: '2025-05-16 10:15', thoiGianCapNhat: '2025-05-21 15:00' },
    { id: 3, stt: 3, maKhoaHoc: 'ISE2501', tenKhoaHoc: 'Kỹ thuật hệ thống công nghiệp', thoiGianBatDau: '2025-06-14', thoiGianKetThuc: '2025-07-14', thoiGianTao: '2025-05-17 11:30', thoiGianCapNhat: '2025-05-22 09:45' },
    { id: 4, stt: 4, maKhoaHoc: 'EEET2501', tenKhoaHoc: 'Công nghệ kỹ thuật điện, điện tử', thoiGianBatDau: '2025-06-16', thoiGianKetThuc: '2025-07-16', thoiGianTao: '2025-05-18 14:00', thoiGianCapNhat: '2025-05-23 13:15' },
    { id: 5, stt: 5, maKhoaHoc: 'SE2501', tenKhoaHoc: 'Kỹ thuật phần mềm', thoiGianBatDau: '2025-06-18', thoiGianKetThuc: '2025-07-18', thoiGianTao: '2025-05-19 15:30', thoiGianCapNhat: '2025-05-24 10:20' },
    { id: 6, stt: 6, maKhoaHoc: 'IM2501', tenKhoaHoc: 'Quản lý công nghiệp', thoiGianBatDau: '2025-06-20', thoiGianKetThuc: '2025-07-20', thoiGianTao: '2025-05-20 09:45', thoiGianCapNhat: '2025-05-25 16:10' },
    { id: 7, stt: 7, maKhoaHoc: 'CAE2501', tenKhoaHoc: 'Công nghệ kỹ thuật điều khiển và tự động hóa', thoiGianBatDau: '2025-06-22', thoiGianKetThuc: '2025-07-22', thoiGianTao: '2025-05-21 11:00', thoiGianCapNhat: '2025-05-26 13:40' },
    { id: 8, stt: 8, maKhoaHoc: 'CM2501', tenKhoaHoc: 'Quản lý xây dựng', thoiGianBatDau: '2025-06-24', thoiGianKetThuc: '2025-07-24', thoiGianTao: '2025-05-22 14:20', thoiGianCapNhat: '2025-05-27 15:55' },
    { id: 9, stt: 9, maKhoaHoc: 'CS2501', tenKhoaHoc: 'Khoa học máy tính', thoiGianBatDau: '2025-06-26', thoiGianKetThuc: '2025-07-26', thoiGianTao: '2025-05-23 08:30', thoiGianCapNhat: '2025-05-28 12:10' },
    { id: 10, stt: 10, maKhoaHoc: 'MET2501', tenKhoaHoc: 'Công nghệ kỹ thuật cơ điện tử', thoiGianBatDau: '2025-06-28', thoiGianKetThuc: '2025-07-28', thoiGianTao: '2025-05-24 09:10', thoiGianCapNhat: '2025-05-29 14:50' },
    { id: 11, stt: 11, maKhoaHoc: 'CET2501', tenKhoaHoc: 'Công nghệ kỹ thuật công trình xây dựng', thoiGianBatDau: '2025-07-01', thoiGianKetThuc: '2025-08-01', thoiGianTao: '2025-05-25 10:40', thoiGianCapNhat: '2025-05-30 11:30' },
    { id: 12, stt: 12, maKhoaHoc: 'BT2501', tenKhoaHoc: 'Công nghệ sinh học', thoiGianBatDau: '2025-07-03', thoiGianKetThuc: '2025-08-03', thoiGianTao: '2025-05-26 13:25', thoiGianCapNhat: '2025-06-01 10:45' },
    { id: 13, stt: 13, maKhoaHoc: 'DS2501', tenKhoaHoc: 'Khoa học dữ liệu', thoiGianBatDau: '2025-07-05', thoiGianKetThuc: '2025-08-05', thoiGianTao: '2025-05-27 15:10', thoiGianCapNhat: '2025-06-02 09:35' },
    { id: 14, stt: 14, maKhoaHoc: 'LSCM2501', tenKhoaHoc: 'Logistics và quản lý chuỗi cung ứng', thoiGianBatDau: '2025-07-07', thoiGianKetThuc: '2025-08-07', thoiGianTao: '2025-05-28 16:45', thoiGianCapNhat: '2025-06-03 14:15' },
    { id: 15, stt: 15, maKhoaHoc: 'IT2501', tenKhoaHoc: 'Công nghệ thông tin', thoiGianBatDau: '2025-07-09', thoiGianKetThuc: '2025-08-09', thoiGianTao: '2025-05-29 09:30', thoiGianCapNhat: '2025-06-04 11:20' },
    { id: 16, stt: 16, maKhoaHoc: 'EET2501', tenKhoaHoc: 'Công nghệ kỹ thuật năng lượng', thoiGianBatDau: '2025-07-11', thoiGianKetThuc: '2025-08-11', thoiGianTao: '2025-05-30 10:50', thoiGianCapNhat: '2025-06-05 08:40' },
    { id: 17, stt: 17, maKhoaHoc: 'CET2502', tenKhoaHoc: 'Công nghệ kỹ thuật công trình xây dựng', thoiGianBatDau: '2025-07-13', thoiGianKetThuc: '2025-08-13', thoiGianTao: '2025-05-31 14:35', thoiGianCapNhat: '2025-06-06 13:25' },
    { id: 18, stt: 18, maKhoaHoc: 'SE2502', tenKhoaHoc: 'Kỹ thuật phần mềm', thoiGianBatDau: '2025-07-15', thoiGianKetThuc: '2025-08-15', thoiGianTao: '2025-06-01 11:00', thoiGianCapNhat: '2025-06-07 12:15' },
    { id: 19, stt: 19, maKhoaHoc: 'DS2502', tenKhoaHoc: 'Khoa học dữ liệu', thoiGianBatDau: '2025-07-17', thoiGianKetThuc: '2025-08-17', thoiGianTao: '2025-06-02 15:30', thoiGianCapNhat: '2025-06-08 16:40' },
    { id: 20, stt: 20, maKhoaHoc: 'IT2502', tenKhoaHoc: 'Công nghệ thông tin', thoiGianBatDau: '2025-07-19', thoiGianKetThuc: '2025-08-19', thoiGianTao: '2025-06-03 13:20', thoiGianCapNhat: '2025-06-09 14:10' },
  ]);

  // State cho phân trang, tìm kiếm, lọc theo năm và modal
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State cho modal chỉnh sửa
  const [editedCourse, setEditedCourse] = useState(null); // Khóa học đang được chỉnh sửa

  // Danh sách năm để lọc
  const years = ['2021', '2022', '2023', '2024', '2025'];

  // Hàm xử lý khi nhấn nút Thêm khóa học
  const handleAddCourse = () => {
    setOpenAddModal(true);
  };

  // Hàm đóng modal thêm khóa học
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Hàm thêm khóa học mới
  const handleAddNewCourse = (newCourse) => {
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses, { ...newCourse, stt: prevCourses.length + 1 }];
      return updatedCourses;
    });
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditCourse = (id) => {
    const courseToEdit = courses.find((c) => c.id === id);
    setEditedCourse(courseToEdit);
    setOpenEditModal(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedCourse(null);
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEditedCourse = (updatedCourse) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? { ...course, ...updatedCourse } : course
      )
    );
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem khóa học
  const handleViewCourse = (id) => {
    const course = courses.find((c) => c.id === id);
    setSelectedCourse(course);
    setOpenDetail(true);
  };

  // Hàm xử lý xóa khóa học
  const handleDeleteCourse = (id) => {
    console.log(`Xóa khóa học với ID: ${id}`);
    // Thêm logic xóa khóa học
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedCourse(null);
  };

  // Lọc danh sách khóa học dựa trên từ khóa tìm kiếm và năm
  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm =
      course.maKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = selectedYear
      ? course.thoiGianBatDau.startsWith(selectedYear)
      : true;

    return matchesSearchTerm && matchesYear;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedCourses = filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 3 }}>
        {/* Bảng danh sách khóa học */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography variant="h6">
                Danh sách khóa học
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddCourse}
                  sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                >
                  Thêm khóa học
                </Button>
                <FormControl sx={{ minWidth: 150 }} variant="outlined">
                  <InputLabel id="year-filter-label">Lọc theo năm</InputLabel>
                  <Select
                    labelId="year-filter-label"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Lọc theo năm"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ bgcolor: '#fff' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {filteredCourses.length === 0 ? (
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
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                        Thời gian cập nhật
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center' }}>
                        Thao tác
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
                        <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>{course.thoiGianCapNhat}</TableCell>
                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Visibility
                              color="primary"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleViewCourse(course.id)}
                            />
                            <Edit
                              color="primary"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleEditCourse(course.id)}
                            />
                            <Delete
                              color="error"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDeleteCourse(course.id)}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={filteredCourses.length}
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
      </Box>
      <CourseDetailModal 
        open={openDetail} 
        onClose={handleCloseDetail} 
        course={selectedCourse} 
      />
      <AddCourseModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddCourse={handleAddNewCourse}
      />
      <EditCourseModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        course={editedCourse}
        onSave={handleSaveEditedCourse}
      />
    </Box>
  );
};

export default Course;