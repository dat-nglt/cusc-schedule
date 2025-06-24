import React, { useState } from 'react';
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
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import ClassDetailModal from './ClassDetailModal';
import AddClassModal from './AddClassModal';
import EditClassModal from './EditClassModal';
import DeleteClassModal from './DeleteClassModal';
import useResponsive from '../../hooks/useResponsive';
import ClassTable from './ClassTable';

const Class = () => {
  const { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen } = useResponsive();

  // Dữ liệu mẫu cho danh sách lớp học
  const [classes, setClasses] = useState([
    { id: 1, stt: 1, maLopHoc: 'LH101', maHocVien: 'HV001', maKhoaHoc: 'KH001', siSoLop: 30, trangThai: 'Hoạt động', thoiGianTao: '2025-06-01 09:00', thoiGianCapNhat: '2025-06-05 14:30' },
    { id: 2, stt: 2, maLopHoc: 'LH102', maHocVien: 'HV002', maKhoaHoc: 'KH002', siSoLop: 25, trangThai: 'Hoạt động', thoiGianTao: '2025-06-02 10:15', thoiGianCapNhat: '2025-06-06 15:00' },
    { id: 3, stt: 3, maLopHoc: 'LH103', maHocVien: 'HV003', maKhoaHoc: 'KH003', siSoLop: 40, trangThai: 'Không hoạt động', thoiGianTao: '2025-06-03 11:30', thoiGianCapNhat: '2025-06-07 09:45' },
    { id: 4, stt: 4, maLopHoc: 'LH104', maHocVien: 'HV004', maKhoaHoc: 'KH004', siSoLop: 35, trangThai: 'Hoạt động', thoiGianTao: '2025-06-04 14:00', thoiGianCapNhat: '2025-06-08 13:15' },
  ]);

  // State cho phân trang, tìm kiếm, lọc theo trạng thái và modal
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editedClass, setEditedClass] = useState(null);
  const [classToDelete, setClassToDelete] = useState(null);

  // Danh sách trạng thái để lọc
  const trangThaiOptions = ['Hoạt động', 'Không hoạt động'];

  // Hàm xử lý khi nhấn nút Thêm lớp học
  const handleAddClass = () => {
    setOpenAddModal(true);
  };

  // Hàm đóng modal thêm lớp học
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Hàm thêm lớp học mới
  const handleAddNewClass = (newClass) => {
    setClasses((prevClasses) => {
      const updatedClasses = [...prevClasses, { ...newClass, stt: prevClasses.length + 1 }];
      return updatedClasses;
    });
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditClass = (id) => {
    const classToEdit = classes.find((c) => c.id === id);
    setEditedClass(classToEdit);
    setOpenEditModal(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedClass(null);
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEditedClass = (updatedClass) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === updatedClass.id ? { ...cls, ...updatedClass } : cls
      )
    );
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem lớp học
  const handleViewClass = (id) => {
    const cls = classes.find((c) => c.id === id);
    setSelectedClass(cls);
    setOpenDetail(true);
  };

  // Hàm xử lý xóa lớp học
  const handleDeleteClass = (id) => {
    const cls = classes.find((c) => c.id === id);
    setClassToDelete(cls);
    setOpenDeleteModal(true);
  };

  // Hàm xác nhận xóa lớp học
  const confirmDeleteClass = (id) => {
    setClasses((prevClasses) => {
      const updatedClasses = prevClasses.filter((cls) => cls.id !== id)
        .map((cls, index) => ({ ...cls, stt: index + 1 }));
      return updatedClasses;
    });
    setOpenDeleteModal(false);
    setClassToDelete(null);
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedClass(null);
  };

  // Hàm đóng modal xóa
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setClassToDelete(null);
  };

  // Lọc danh sách lớp học dựa trên từ khóa tìm kiếm và trạng thái
  const filteredClasses = classes.filter((cls) => {
    const matchesSearchTerm =
      cls.maLopHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.maHocVien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.maKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrangThai = selectedTrangThai
      ? cls.trangThai === selectedTrangThai
      : true;

    return matchesSearchTerm && matchesTrangThai;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedClasses = filteredClasses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 64px)', overflowY: 'auto', width: '100%' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 2 }}>
        {/* Bảng danh sách lớp học */}
        <Card sx={{ width: '100%', boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 2 }}>
              <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
                Danh sách lớp học
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                {isSmallScreen ? (
                  <IconButton
                    color="primary"
                    onClick={handleAddClass}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    <AddIcon sx={{ color: '#fff' }} />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClass}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    Thêm lớp học
                  </Button>
                )}
                <FormControl sx={{ minWidth: isSmallScreen ? 100 : 200, flexGrow: 1, maxWidth: { xs: '100%', sm: 200 } }} variant="outlined">
                  <InputLabel id="trang-thai-filter-label">{isSmallScreen ? 'Trạng thái' : 'Lọc theo trạng thái'}</InputLabel>
                  <Select
                    labelId="trang-thai-filter-label"
                    value={selectedTrangThai}
                    onChange={(e) => setSelectedTrangThai(e.target.value)}
                    label={isSmallScreen ? 'Trạng thái' : 'Lọc theo trạng thái'}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {trangThaiOptions.map((trangThai) => (
                      <MenuItem key={trangThai} value={trangThai}>
                        {trangThai}
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
                placeholder="Tìm kiếm theo mã lớp, mã học viên, mã khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ bgcolor: '#fff', width: '100%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {filteredClasses.length === 0 ? (
              <Typography>Không có lớp học nào để hiển thị.</Typography>
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <ClassTable
                  displayedClasses={displayedClasses}
                  isExtraSmallScreen={isExtraSmallScreen}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  isLargeScreen={isLargeScreen}
                  handleViewClass={handleViewClass}
                  handleEditClass={handleEditClass}
                  handleDeleteClass={handleDeleteClass}
                />
                <TablePagination
                  component="div"
                  count={filteredClasses.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                  sx={{ width: '100%', px: 0 }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      <ClassDetailModal
        open={openDetail}
        onClose={handleCloseDetail}
        cls={selectedClass}
      />
      <AddClassModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddClass={handleAddNewClass}
        existingClasses={classes}
      />
      <EditClassModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        cls={editedClass}
        onSave={handleSaveEditedClass}
      />
      <DeleteClassModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={confirmDeleteClass}
        cls={classToDelete}
      />
    </Box>
  );
};

export default Class;