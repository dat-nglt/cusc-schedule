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
import axios from 'axios';

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
      console.log('Gọi API tới:', 'http://localhost:3000/api/courses');
      const response = await axios.get('http://localhost:3000/api/courses', {
        timeout: 5000,
      });
      console.log('Phản hồi từ API (danh sách):', response.data);

      let coursesData = [];
      if (Array.isArray(response.data)) {
        coursesData = response.data.map((course, index) => ({
          stt: index + 1,
          courseid: course.courseid,
          coursename: course.coursename,
          startdate: course.startdate,
          enddate: course.enddate,
          created_at: formatTimestamp(course.created_at),
          updated_at: formatTimestamp(course.updated_at),
        }));
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        coursesData = response.data.data.map((course, index) => ({
          stt: index + 1,
          courseid: course.courseid,
          coursename: course.coursename,
          startdate: course.startdate,
          enddate: course.enddate,
          created_at: formatTimestamp(course.created_at),
          updated_at: formatTimestamp(course.updated_at),
        }));
      } else {
        throw new Error('Dữ liệu từ API không phải là mảng hợp lệ');
      }

      setCourses(coursesData);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi chi tiết (danh sách):', err.response?.status, err.response?.data || err.message);
      setError(`Lỗi khi tải danh sách khóa học: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Hàm lấy chi tiết khóa học theo ID
  const handleViewCourse = async (courseid) => {
    try {
      console.log('Gọi API chi tiết với courseid:', courseid);
      const response = await axios.get(`http://localhost:3000/api/courses/${courseid}`, {
        timeout: 5000,
      });
      console.log('Phản hồi từ API (chi tiết):', response.data);

      let courseData = {};
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          courseData = response.data.data[0] || {};
        } else if (response.data.data) {
          courseData = response.data.data;
        } else {
          courseData = response.data;
        }
      } else {
        throw new Error('Dữ liệu từ API không phải là object hợp lệ');
      }

      setSelectedCourse({
        courseid: courseData.courseid,
        coursename: courseData.coursename,
        startdate: courseData.startdate,
        enddate: courseData.enddate,
        created_at: formatTimestamp(courseData.created_at),
        updated_at: formatTimestamp(courseData.updated_at),
      });
      setOpenDetail(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết:', err.response?.status, err.response?.data || err.message);
      setError(`Lỗi khi lấy chi tiết khóa học: ${err.message}`);
      setOpenDetail(false);
    }
  };

  // Hàm thêm khóa học
  const handleAddCourse = async (courseData) => {
    try {
      console.log('Gửi dữ liệu thêm khóa học:', courseData);
      const response = await axios.post('http://localhost:3000/api/courses/add', courseData, {
        timeout: 5000,
      });
      console.log('Phản hồi từ API (thêm):', response.data);

      const newCourse = response.data.data || response.data;
      setCourses((prev) => [
        ...prev,
        {
          stt: prev.length + 1,
          courseid: newCourse.courseid,
          coursename: newCourse.coursename,
          startdate: newCourse.startdate,
          enddate: newCourse.enddate,
          created_at: formatTimestamp(newCourse.created_at),
          updated_at: formatTimestamp(newCourse.updated_at),
        },
      ]);
    } catch (err) {
      console.error('Lỗi khi thêm khóa học:', err.response?.status, err.response?.data || err.message);
      setError(`Lỗi khi thêm khóa học: ${err.message}`);
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
      console.log('Gửi dữ liệu chỉnh sửa khóa học:', courseData);
      const response = await axios.put(`http://localhost:3000/api/courses/edit/${courseData.courseid}`, {
        courseid: courseData.courseid,
        coursename: courseData.coursename,
        startdate: courseData.startdate,
        enddate: courseData.enddate,
        updated_at: new Date().toISOString(), // Cập nhật thời gian hiện tại
      }, {
        timeout: 5000,
      });
      console.log('Phản hồi từ API (chỉnh sửa):', response.data);

      await fetchCourses();
    } catch (err) {
      console.error('Lỗi khi chỉnh sửa khóa học:', err.response?.status, err.response?.data || err.message);
      setError(`Lỗi khi chỉnh sửa khóa học: ${err.message}`);
    }
  };

  // Hàm mở modal xóa và set course
  const handleOpenDeleteModal = (course) => {
    if (!course || !course.courseid) {
      console.error('Invalid course data in handleOpenDeleteModal:', course);
      setError('Dữ liệu khóa học không hợp lệ');
      return;
    }
    setSelectedCourse(course);
    setOpenDelete(true);
  };

  // Hàm xóa khóa học
  const handleDeleteCourse = async (courseId) => {
    try {
      if (!courseId) {
        console.error('Invalid courseId for deletion:', courseId);
        setError('Dữ liệu khóa học không hợp lệ');
        return;
      }
      const response = await axios.delete(`http://localhost:3000/api/courses/delete/${courseId}`, {
        timeout: 5000,
      });
      console.log('Response from API (delete):', response.data);

      await fetchCourses();
    } catch (err) {
      console.error('Lỗi khi xóa khóa học:', err.response?.status, err.response?.data || err.message);
      setError(`Lỗi khi xóa khóa học: ${err.message}`);
    }
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Lọc danh sách khóa học dựa trên từ khóa tìm kiếm và năm
  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm =
      course.courseid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.coursename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear
      ? course.startdate?.startsWith(selectedYear)
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