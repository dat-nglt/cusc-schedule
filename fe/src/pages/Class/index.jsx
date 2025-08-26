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
import ClassDetailModal from './ClassDetailModal';
import AddClassModal from './AddClassModal';
import EditClassModal from './EditClassModal';
import DeleteClassModal from './DeleteClassModal';
import useResponsive from '../../hooks/useResponsive';
import ClassTable from './ClassTable';
import { getClassesAPI, addClassAPI, updateClassAPI, deleteClassAPI } from '../../api/classAPI';
import { getCoursesAPI } from '../../api/courseAPI';
import { getAllProgramsAPI } from '../../api/programAPI';
import TablePaginationLayout from '../../components/layout/TablePaginationLayout';
import { toast } from 'react-toastify';
import { formatDateTime } from '../../utils/formatDateTime';

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

const Class = () => {
  const { isSmallScreen, isMediumScreen } = useResponsive();
  const theme = useTheme();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
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
  const [selectedClass, setSelectedClass] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);

  const years = ['2021', '2022', '2023', '2024', '2025'];

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getClassesAPI();

      let classesData = [];
      if (Array.isArray(response)) {
        classesData = response.map((classItem, index) => ({
          stt: index + 1,
          class_id: classItem.class_id,
          class_name: classItem.class_name,
          class_size: classItem.class_size,
          status: classItem.status,
          course_id: classItem.course_id,
          created_at: formatTimestamp(classItem.created_at),
          updated_at: formatTimestamp(classItem.updated_at),
          program_id: classItem.program_id,
          course: classItem.Course ? { course_name: classItem.Course.course_name } : null,
        }));
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        classesData = response.data.map((classItem, index) => ({
          stt: index + 1,
          class_id: classItem.class_id,
          class_name: classItem.class_name,
          class_size: classItem.class_size,
          status: classItem.status,
          course_id: classItem.course_id,
          created_at: formatTimestamp(classItem.created_at),
          updated_at: formatTimestamp(classItem.updated_at),
          program_id: classItem.program_id,
          course: classItem.Course ? { course_name: classItem.Course.course_name } : null,
        }));
      } else {
        throw new Error('Dữ liệu từ API không phải là mảng hợp lệ');
      }

      setClasses(classesData);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi chi tiết (danh sách):', err.message);
      setError(`Lỗi khi tải danh sách lớp học: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCoursesAPI();
      let coursesData = [];
      if (Array.isArray(response)) {
        coursesData = response.map((course) => ({
          course_id: course.course_id,
          course_name: course.course_name,
        }));
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        coursesData = response.data.map((course) => ({
          course_id: course.course_id,
          course_name: course.course_name,
        }));
      } else {
        throw new Error('Dữ liệu từ API không phải là mảng hợp lệ');
      }
      setCourses(coursesData);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi tải danh sách khóa học:', err.message);
      setError(`Lỗi khi tải danh sách khóa học: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await getAllProgramsAPI();
      if (!response) {
        throw new Error('Không có dữ liệu chương trình đào tạo');
      }
      setPrograms(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách chương trình đào tạo:', err.message);
      setError(`Lỗi khi tải danh sách chương trình đào tạo: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchCourses();
    fetchPrograms();
  }, []);

  const handleViewClass = (class_id) => {
    setLoading(true);
    setError(null);

    try {
      const classToView = classes.find(cls => cls.class_id === class_id);

      if (classToView) {
        setSelectedClass({
          class_id: classToView.class_id,
          class_name: classToView.class_name,
          class_size: classToView.class_size,
          status: classToView.status || 'Không có dữ liệu',
          course_id: classToView.course_id,
          created_at: formatDateTime(classToView.created_at),
          updated_at: formatDateTime(classToView.updated_at),
          program_id: classToView.program_id,
          course: classToView.Course ? { course_name: classToView.Course.course_name } : null,
        });

        setOpenDetail(true);
        console.log(classToView);
      } else {
        const errorMessage = `Không tìm thấy lớp học với ID: ${class_id}`;
        setError(errorMessage);
        toast.error(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error.message || 'Đã xảy ra lỗi không xác định.';
      setError(errorMessage);
      toast.error(`Lỗi: ${errorMessage}`);
      console.error('Lỗi khi lấy thông tin lớp học:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (classData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await addClassAPI({
        class_id: classData.class_id,
        class_name: classData.class_name,
        class_size: classData.class_size,
        status: classData.status || "Hoạt động",
        course_id: classData.course_id,
        program_id: classData.program_id,
      });

      if (!data) {
        throw new Error("Không thể thêm lớp học. Vui lòng thử lại.");
      }

      toast.success("Thêm lớp học thành công!");
      await fetchClasses(); // đồng bộ lại danh sách lớp học
      // Reset + đóng modal khi thêm thành công
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể thêm lớp học. Vui lòng thử lại.";

      console.error("Lỗi khi thêm lớp học:", errorMessage);

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setOpenEdit(true);
  };

  const handleSaveEditedClass = async (classData) => {
    try {
      setLoading(true);
      const response = await updateClassAPI(classData.class_id, {
        class_id: classData.class_id,
        class_name: classData.class_name,
        class_size: classData.class_size,
        status: classData.status,
        course_id: classData.course_id,
        program_id: classData.program_id,
        updated_at: new Date().toISOString(),
      });

      if (response.success) {
        await fetchClasses();
        toast.success("Cập nhật lớp học thành công")
      }else {
        toast.error("Cập nhật lớp học không thành côngPhản hồi từ API")
      }

    } catch (err) {
      console.error('Lỗi khi chỉnh sửa lớp học:', err.message);
      setError(`Lỗi khi chỉnh sửa lớp học: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở modal xác nhận xóa lớp
  const handleOpenDeleteModal = (selectedClass) => {
    console.log('Chuẩn bị xóa lớp:', selectedClass);

    const classItem = classes.find((c) => c.class_id === (selectedClass.class_id));
    // if (!classItem) {
    //   console.error("Không tìm thấy lớp với id:", selectedClass.class_id);
    //   setError("Dữ liệu lớp học không hợddp lệ");
    //   return;
    // }

    setClassToDelete(classItem);
    setOpenDelete(true);
  };


  const handleDeleteClass = async (class_id) => {
    console.log('Xóa lớp với id:', class_id);

    try {
      setLoading(true);
      if (!class_id) {
        toast.error("Dữ liệu lớp học không hợp lệ rồi!");
        return;
      }

      const response = await deleteClassAPI(class_id);

      if (response) {
        toast.success("Xóa lớp học thành công!");
        fetchClasses(); // Load lại danh sách lớp học sau khi xóa
      }
    } catch (error) {
      console.error("Lỗi khi xóa lớp học:", error);
      toast.error("Xóa lớp học thất bại! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearchTerm =
      classItem.class_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.class_name && classItem.class_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesYear = selectedYear
      ? classItem.created_at?.startsWith(selectedYear)
      : true;
    return matchesSearchTerm && matchesYear;
  });

  const displayedClasses = filteredClasses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                Danh sách lớp học
              </Typography>

              <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: isSmallScreen ? 'column' : 'row',
                width: isSmallScreen ? '100%' : 'auto'
              }}>
                <TextField
                  size="small"
                  placeholder="Tìm kiếm theo mã hoặc tên lớp học..."
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
                  Thêm lớp học
                </Button>
              </Box>
            </Box>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {filteredClasses.length === 0 && !loading && !error && (
              <Typography>Không có lớp học nào để hiển thị.</Typography>
            )}
            {!loading && !error && filteredClasses.length > 0 && (
              <>
                <ClassTable
                  displayedClasses={displayedClasses}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  handleViewClass={handleViewClass}
                  handleEditClass={handleEditClass}
                  handleDeleteClass={handleOpenDeleteModal}
                />
                <TablePaginationLayout
                  count={filteredClasses.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      <ClassDetailModal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedClass(null);
        }}
        classItem={selectedClass}
      />
      <AddClassModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAddClass={handleAddClass}
        onImportSuccess={fetchClasses}
        existingClasses={classes}
        existingCourses={courses}
        existingPrograms={programs}
      />
      <EditClassModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedClass(null);
        }}
        onEditClass={handleSaveEditedClass}
        classItem={selectedClass}
        existingClasses={classes}
        existingCourses={courses}
        existingPrograms={programs}
      />
      <DeleteClassModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedClass(null);
        }}
        onDelete={handleDeleteClass}
        classItem={classToDelete}
      />
    </Box>
  );
};

export default Class;