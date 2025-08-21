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
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import CourseDetailModal from './CourseDetailModal';
import AddCourseModal from './AddCourseModal'; // Đã chỉnh sửa để hỗ trợ preview
import EditCourseModal from './EditCourseModal';
import DeleteCourseModal from './DeleteCourseModal';
import useResponsive from '../../hooks/useResponsive';
import CourseTable from './CourseTable';
import { toast } from 'react-toastify';
import { getCoursesAPI, getCourseByIdAPI, addCourseAPI, updateCourseAPI, deleteCourseAPI } from '../../api/courseAPI';
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';

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
  const theme = useTheme();
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

  const years = ['2021', '2022', '2023', '2024', '2025'];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCoursesAPI();
      console.log('Phản hồi từ API (danh sách):', response);

      let coursesData = [];
      if (Array.isArray(response)) {
        coursesData = response.map((course, index) => ({
          stt: index + 1,
          course_id: course.course_id,
          course_name: course.course_name,
          start_date: course.start_date,
          end_date: course.end_date,
          created_at: formatTimestamp(course.created_at),
          updated_at: formatTimestamp(course.updated_at),
        }));
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        coursesData = response.data.map((course, index) => ({
          course_id: course.course_id,
          course_name: course.course_name,
          start_date: course.start_date,
          end_date: course.end_date,
          status: course.status || 'Không có dữ liệu',
          created_at: formatTimestamp(course.created_at),
          updated_at: formatTimestamp(course.updated_at),
        }));
      } else {
        throw new Error('Dữ liệu từ API không phải là mảng hợp lệ');
      }

      setCourses(coursesData);
    } catch (err) {
      console.error('Lỗi chi tiết (danh sách):', err.message);
      setError(`Lỗi khi tải danh sách khóa học: ${err.message}`);
      toast.error(`Lỗi khi tải danh sách khóa học!. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleViewCourse = async (course_id) => {
    try {
      setLoading(true);
      const response = await getCourseByIdAPI(course_id);
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
        status: courseData.status || 'Không có dữ liệu',
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

  const handleAddCourse = async (courseData) => {
    try {
      setLoading(true);
      console.log('Gửi dữ liệu thêm khóa học:', courseData);
      const response = await addCourseAPI({
        course_id: courseData.course_id,
        course_name: courseData.course_name,
        start_date: courseData.start_date,
        end_date: courseData.end_date,
        status: courseData.status || 'inactive',
      });
      console.log('Phản hồi từ API (thêm):', response);
      toast.success('Khóa học được thêm thành công!');

      const newCourse = response.data || response;
      setCourses((prev) => [
        ...prev,
        {
          course_id: newCourse.course_id,
          course_name: newCourse.course_name,
          start_date: newCourse.start_date,
          end_date: newCourse.end_date,
          status: newCourse.status,
          created_at: formatTimestamp(newCourse.created_at),
          updated_at: formatTimestamp(newCourse.updated_at),
        },
      ]);
    } catch (err) {
      console.error('Lỗi khi thêm khóa học:', err.message, err.response?.data);
      setError(`Lỗi khi thêm khóa học: ${err.message} - ${err.response?.data?.message || 'Kiểm tra định dạng dữ liệu'}`);
      toast.error(`Lỗi khi thêm khóa học!. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setOpenEdit(true);
  };

  const handleSaveEditedCourse = async (courseData) => {
    try {
      setLoading(true);
      console.log('Gửi dữ liệu chỉnh sửa khóa học:', courseData);
      const response = await updateCourseAPI(courseData.course_id, {
        course_id: courseData.course_id,
        course_name: courseData.course_name,
        start_date: courseData.start_date,
        end_date: courseData.end_date,
        status: courseData.status,
        updated_at: new Date().toISOString(),
      });
      console.log('Phản hồi từ API (chỉnh sửa):', response);
      toast.success('Khóa học được chỉnh sửa thành công!');

      await fetchCourses();
    } catch (err) {
      console.error('Lỗi khi chỉnh sửa khóa học:', err.message);
      setError(`Lỗi khi chỉnh sửa khóa học: ${err.message}`);
      toast.error(`Lỗi khi chỉnh sửa khóa học!. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (course) => {
    if (!course || !course.course_id) {
      console.error('Invalid course data in handleOpenDeleteModal:', course);
      setError('Dữ liệu khóa học không hợp lệ');
      toast.error('Dữ liệu khóa học không hợp lệ');
      return;
    }
    setSelectedCourse(course);
    setOpenDelete(true);
  };

  const handleDeleteCourse = async (course_id) => {
    try {
      setLoading(true);
      if (!course_id) {
        console.error('Invalid courseId for deletion:', course_id);
        setError('Dữ liệu khóa học không hợp lệ');
        return;
      }
      console.log('Attempting to delete course with course_id:', course_id);
      const response = await deleteCourseAPI(course_id);
      console.log('Response from API (delete):', response);
      toast.success('Khóa học đã được xóa thành công!');

      await fetchCourses();
    } catch (err) {
      console.error('Lỗi khi xóa khóa học:', err.message);
      setError(`Lỗi khi xóa khóa học: ${err.message}`);
      toast.error(`Lỗi khi xóa khóa học!. Vui lòng thử lại sau.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm =
      course.course_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear
      ? course.start_date?.startsWith(selectedYear)
      : true;
    return matchesSearchTerm && matchesYear;
  });

  const displayedCourses = filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
 console.log(" courses:", courses);
 
  return (
    <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isSmallScreen ? 'stretch' : 'center',
              mb: 3,
              gap: 2
            }}>
              <Typography variant="h5" fontWeight="600">
                Danh sách khóa học
              </Typography>

              <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: isSmallScreen ? 'column' : 'row',
                width: isSmallScreen ? '100%' : 'auto'
              }}>
                <TextField
                  size="small"
                  placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: 200,
                    backgroundColor: theme.palette.background.paper
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Năm</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    label="Năm"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAdd(true)}
                  sx={{ ml: isSmallScreen ? 0 : 'auto' }}
                >
                  Thêm khóa học
                </Button>
              </Box>
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
                <TablePaginationLayout
                  count={filteredCourses.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
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
        existingCourses={courses}
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