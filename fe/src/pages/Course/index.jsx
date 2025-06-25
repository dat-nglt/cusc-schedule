import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import CourseDetailModal from './CourseDetailModal';
import AddCourseModal from './AddCourseModal';
import EditCourseModal from './EditCourseModal';
import DeleteCourseModal from './DeleteCourseModal';
import useResponsive from '../../hooks/useResponsive';
import CourseTable from './CourseTable';
import { getCourses, getCourseById, addCourse, updateCourse, deleteCourse, listCourses } from '../../api/courseAPI';

// Hàm định dạng timestamp thành YYYY-MM-DD HH:MM:SS.sss+07
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+07`;
};

const Course = () => {
  const { isSmallScreen, isMediumScreen } = useResponsive();

  // State cho danh sách khóa học, phân trang, tìm kiếm, lọc, và modal
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Danh sách năm để lọc
  const years = ['2021', '2022', '2023', '2024', '2025'];

  // Load danh sách khóa học từ API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      console.log('Phản hồi từ API (danh sách):', response);

      let coursesData = [];
      if (Array.isArray(response)) {
        coursesData = response.map((course, index) => ({
          stt: index + 1,
          course_id: course.course_id, // Thay courseid bằng course_id
          course_name: course.course_name, // Thay coursename bằng course_name
          start_date: course.start_date, // Thay startdate bằng start_date
          end_date: course.end_date, // Thay enddate bằng end_date
          created_at: formatTimestamp(course.created_at),
          updated_at: formatTimestamp(course.updated_at),
        }));
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        coursesData = response.data.map((course, index) => ({
          stt: index + 1,
          course_id: course.course_id,
          course_name: course.course_name,
          start_date: course.start_date,
          end_date: course.end_date,
          created_at: formatTimestamp(course.created_at),
          updated_at: formatTimestamp(course.updated_at),
        }));
      } else {
        throw new Error('Dữ liệu từ API không phải là mảng hợp lệ');
      }

      setCourses(coursesData);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi chi tiết (danh sách):', err.message);
      setError(`Lỗi khi tải danh sách khóa học: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Hàm lấy chi tiết khóa học theo ID
  const handleViewCourse = async (course_id) => { // Thay courseid bằng course_id
    try {
      setLoading(true);
      const response = await getCourseById(course_id);
      console.log('Phản hồi từ API (chi tiết):', response);

      let courseData = {};
      if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          courseData = response.data[0] || {};
        } else if (response.data) {
          courseData = response.data;
        } else {
          courseData = response;
        }
      } else {
        throw new Error('Dữ liệu từ API không phải là object hợp lệ');
      }

      setSelectedCourse({
        course_id: courseData.course_id,
        course_name: courseData.course_name,
        start_date: courseData.start_date,
        end_date: courseData.end_date,
        status: courseData.status || 'Không có dữ liệu', // Thêm status
        created_at: formatTimestamp(courseData.created_at),
        updated_at: formatTimestamp(courseData.updated_at),
      });
      setOpenDetail(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết:', err.message);
      setError(`Lỗi khi lấy chi tiết khóa học: ${err.message}`);
      setOpenDetail(false);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm khóa học
  // src/pages/Course/index.jsx (đoạn handleAddCourse)
  const handleAddCourse = async (courseData) => {
    try {
      setLoading(true);
      console.log('Gửi dữ liệu thêm khóa học:', courseData); // Log dữ liệu gửi lên
      const response = await addCourse({
        course_id: courseData.course_id,
        course_name: courseData.course_name,
        start_date: courseData.start_date,
        end_date: courseData.end_date,
        status: courseData.status || 'inactive', // Đặt giá trị mặc định nếu không có
      });
      console.log('Phản hồi từ API (thêm):', response); // Log phản hồi từ API

      const newCourse = response.data || response;
      setCourses((prev) => [
        ...prev,
        {
          stt: prev.length + 1,
          course_id: newCourse.course_id,
          course_name: newCourse.course_name,
          start_date: newCourse.start_date,
          end_date: newCourse.end_date,
          created_at: formatTimestamp(newCourse.created_at),
          updated_at: formatTimestamp(newCourse.updated_at),
        },
      ]);
    } catch (err) {
      console.error('Lỗi khi thêm khóa học:', err.message, err.response?.data); // Log chi tiết lỗi
      setError(`Lỗi khi thêm khóa học: ${err.message} - ${err.response?.data?.message || 'Kiểm tra định dạng dữ liệu'}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở modal chỉnh sửa và set course
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  // Hàm cập nhật khóa học
  const handleSaveEditedCourse = async (courseData) => {
    try {
      setLoading(true);
      console.log('Gửi dữ liệu chỉnh sửa khóa học:', courseData);
      const response = await updateCourse(courseData.course_id, { // Thay courseid bằng course_id
        course_id: courseData.course_id,
        course_name: courseData.course_name,
        start_date: courseData.start_date,
        end_date: courseData.end_date,
        status: courseData.status,
        updated_at: new Date().toISOString(),
      });
      console.log('Phản hồi từ API (chỉnh sửa):', response);

      await fetchCourses();
    } catch (err) {
      console.error('Lỗi khi chỉnh sửa khóa học:', err.message);
      setError(`Lỗi khi chỉnh sửa khóa học: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở modal xóa và set course
  const handleOpenDeleteModal = (course) => {
    if (!course || !course.course_id) { // Thay courseid bằng course_id
      console.error('Invalid course data in handleOpenDeleteModal:', course);
      setError('Dữ liệu khóa học không hợp lệ');
      return;
    }
    setSelectedCourse(course);
    setOpenDelete(true);
  };

  // Hàm xóa khóa học
  const handleDeleteCourse = async (course_id) => { // Thay courseId bằng course_id
    try {
      setLoading(true);
      if (!course_id) {
        console.error('Invalid courseId for deletion:', course_id);
        setError('Dữ liệu khóa học không hợp lệ');
        return;
      }
      console.log('Attempting to delete course with course_id:', course_id);
      const response = await deleteCourse(course_id);
      console.log('Response from API (delete):', response);

      await fetchCourses();
    } catch (err) {
      console.error('Lỗi khi xóa khóa học:', err.message);
      setError(`Lỗi khi xóa khóa học: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Lọc danh sách khóa học dựa trên từ khóa tìm kiếm và năm
  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm =
      course.course_id.toLowerCase().includes(searchTerm.toLowerCase()) || // Thay courseid bằng course_id
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()); // Thay coursename bằng course_name
    const matchesYear = selectedYear
      ? course.start_date?.startsWith(selectedYear) // Thay startdate bằng start_date
      : true;
    return matchesSearchTerm && matchesYear;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedCourses = filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography variant="h6">
                Danh sách khóa học
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isSmallScreen ? (
                  <IconButton
                    color="primary"
                    onClick={() => setOpenAdd(true)}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    <AddIcon sx={{ color: '#fff' }} />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAdd(true)}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    Thêm khóa học
                  </Button>
                )}
                <FormControl sx={{ minWidth: isSmallScreen ? 100 : 150 }} variant="outlined">
                  <InputLabel id="year-filter-label">{isSmallScreen ? 'Lọc' : 'Lọc theo năm'}</InputLabel>
                  <Select
                    labelId="year-filter-label"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label={isSmallScreen ? 'Lọc' : 'Lọc theo năm'}
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
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {filteredCourses.length === 0 && !loading && !error && (
              <Typography>Không có khóa học nào để hiển thị.</Typography>
            )}
            {!loading && !error && filteredCourses.length > 0 && (
              <>
                <CourseTable
                  displayedCourses={displayedCourses}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  handleViewCourse={handleViewCourse}
                  handleEditCourse={handleEditCourse}
                  handleDeleteCourse={handleOpenDeleteModal}
                />
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
        onClose={() => {
          setOpenDetail(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
      />
      <AddCourseModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAddCourse={handleAddCourse}
      />
      <EditCourseModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onSave={handleSaveEditedCourse}
      />
      <DeleteCourseModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedCourse(null);
        }}
        onDelete={handleDeleteCourse}
        course={selectedCourse}
      />
    </Box>
  );
};

export default Course;