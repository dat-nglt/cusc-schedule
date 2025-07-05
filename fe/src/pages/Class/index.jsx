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
import ClassDetailModal from './ClassDetailModal';
import AddClassModal from './AddClassModal';
import EditClassModal from './EditClassModal';
import DeleteClassModal from './DeleteClassModal';
import useResponsive from '../../hooks/useResponsive';
import ClassTable from './ClassTable';
import { getClasses, getClassById, addClass, updateClass, deleteClass, listClasses } from '../../api/classAPI';

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

  const [classes, setClasses] = useState([]);
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

  const years = ['2021', '2022', '2023', '2024', '2025'];

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getClasses();
      console.log('Phản hồi từ API (danh sách):', response);

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

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleViewClass = async (class_id) => {
    try {
      setLoading(true);
      const response = await getClassById(class_id);
      console.log('Phản hồi từ API (chi tiết):', response);

      let classData = {};
      if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          classData = response.data[0] || {};
        } else if (response.data) {
          classData = response.data;
        } else {
          classData = response;
        }
      } else {
        throw new Error('Dữ liệu từ API không phải là object hợp lệ');
      }

      setSelectedClass({
        class_id: classData.class_id,
        class_name: classData.class_name,
        class_size: classData.class_size,
        status: classData.status || 'Không có dữ liệu',
        course_id: classData.course_id,
        created_at: formatTimestamp(classData.created_at),
        updated_at: formatTimestamp(classData.updated_at),
        course: classData.Course ? { course_name: classData.Course.course_name } : null,
      });
      setOpenDetail(true);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết:', err.message);
      setError(`Lỗi khi lấy chi tiết lớp học: ${err.message}`);
      setOpenDetail(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (classData) => {
    try {
      setLoading(true);
      console.log('Gửi dữ liệu thêm lớp học:', classData);
      const response = await addClass({
        class_id: classData.class_id,
        class_name: classData.class_name,
        class_size: classData.class_size,
        status: classData.status || 'Hoạt động',
        course_id: classData.course_id,
      });
      console.log('Phản hồi từ API (thêm):', response);

      const newClass = response.data || response;
      setClasses((prev) => [
        ...prev,
        {
          stt: prev.length + 1,
          class_id: newClass.class_id,
          class_name: newClass.class_name,
          class_size: newClass.class_size,
          status: newClass.status,
          course_id: newClass.course_id,
          created_at: formatTimestamp(newClass.created_at),
          updated_at: formatTimestamp(newClass.updated_at),
          course: newClass.Course ? { course_name: newClass.Course.course_name } : null,
        },
      ]);
    } catch (err) {
      console.error('Lỗi khi thêm lớp học:', err.message, err.response?.data);
      setError(`Lỗi khi thêm lớp học: ${err.message} - ${err.response?.data?.message || 'Kiểm tra định dạng dữ liệu'}`);
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
      console.log('Gửi dữ liệu chỉnh sửa lớp học:', classData);
      const response = await updateClass(classData.class_id, {
        class_id: classData.class_id,
        class_name: classData.class_name,
        class_size: classData.class_size,
        status: classData.status,
        course_id: classData.course_id,
        updated_at: new Date().toISOString(),
      });
      console.log('Phản hồi từ API (chỉnh sửa):', response);

      await fetchClasses();
    } catch (err) {
      console.error('Lỗi khi chỉnh sửa lớp học:', err.message);
      setError(`Lỗi khi chỉnh sửa lớp học: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (classItem) => {
    if (!classItem || !classItem.class_id) {
      console.error('Invalid class data in handleOpenDeleteModal:', classItem);
      setError('Dữ liệu lớp học không hợp lệ');
      return;
    }
    setSelectedClass(classItem);
    setOpenDelete(true);
  };

  const handleDeleteClass = async (class_id) => {
    try {
      setLoading(true);
      if (!class_id) {
        console.error('Invalid classId for deletion:', class_id);
        setError('Dữ liệu lớp học không hợp lệ');
        return;
      }
      console.log('Attempting to delete class with class_id:', class_id);
      const response = await deleteClass(class_id);
      console.log('Response from API (delete):', response);

      await fetchClasses();
    } catch (err) {
      console.error('Lỗi khi xóa lớp học:', err.message);
      setError(`Lỗi khi xóa lớp học: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
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
    <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography variant="h6">
                Danh sách lớp học
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
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' }, minWidth: isSmallScreen ? 100 : 150, height: '56px' }}
                  >
                    Thêm lớp học
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
                placeholder="Tìm kiếm theo mã hoặc tên lớp học..."
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
                <TablePagination
                  component="div"
                  count={filteredClasses.length}
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
        existingClasses={classes}
      />
      <EditClassModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelectedClass(null);
        }}
        classItem={selectedClass}
        onSave={handleSaveEditedClass}
      />
      <DeleteClassModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelectedClass(null);
        }}
        onDelete={handleDeleteClass}
        classItem={selectedClass}
      />
    </Box>
  );
};

export default Class;