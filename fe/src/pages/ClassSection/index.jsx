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
import ClassSectionDetailModal from './ClassSectionDetailModal';
import AddClassSectionModal from './AddClassSectionModal';
import EditClassSectionModal from './EditClassSectionModal';
import DeleteClassSectionModal from './DeleteClassSectionModal';
import useResponsive from '../../hooks/useResponsive';
import ClassSectionTable from './ClassSectionTable';

const ClassSection = () => {
  const { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen } = useResponsive();

  // Dữ liệu mẫu cho danh sách lớp học phần
  const [ClassSectiones, setClassSectiones] = useState([
    { id: 1, stt: 1, maLopHocPhan: 'LHP101', maLopHoc: 'LH101', maHocPhan: 'HP001', tenLopHocPhan: 'Toán Cao Cấp A1', siSoToiDa: 40, trangThai: 'Hoạt động', thoiGianTao: '2025-06-01 09:00', thoiGianCapNhat: '2025-06-05 14:30' },
    { id: 2, stt: 2, maLopHocPhan: 'LHP102', maLopHoc: 'LH102', maHocPhan: 'HP002', tenLopHocPhan: 'Vật Lý Đại Cương', siSoToiDa: 35, trangThai: 'Hoạt động', thoiGianTao: '2025-06-02 10:15', thoiGianCapNhat: '2025-06-06 15:00' },
    { id: 3, stt: 3, maLopHocPhan: 'LHP103', maLopHoc: 'LH103', maHocPhan: 'HP003', tenLopHocPhan: 'Lập Trình C++', siSoToiDa: 30, trangThai: 'Không hoạt động', thoiGianTao: '2025-06-03 11:30', thoiGianCapNhat: '2025-06-07 09:45' },
    { id: 4, stt: 4, maLopHocPhan: 'LHP104', maLopHoc: 'LH104', maHocPhan: 'HP004', tenLopHocPhan: 'Cơ Sở Dữ Liệu', siSoToiDa: 45, trangThai: 'Hoạt động', thoiGianTao: '2025-06-04 14:00', thoiGianCapNhat: '2025-06-08 13:15' },
    { id: 5, stt: 5, maLopHocPhan: 'LHP105', maLopHoc: 'LH105', maHocPhan: 'HP005', tenLopHocPhan: 'Mạng Máy Tính', siSoToiDa: 50, trangThai: 'Hoạt động', thoiGianTao: '2025-06-05 08:00', thoiGianCapNhat: '2025-06-09 10:20' },
    { id: 6, stt: 6, maLopHocPhan: 'LHP106', maLopHoc: 'LH106', maHocPhan: 'HP006', tenLopHocPhan: 'Kỹ Thuật Số', siSoToiDa: 38, trangThai: 'Hoạt động', thoiGianTao: '2025-06-06 10:00', thoiGianCapNhat: '2025-06-10 11:00' },
    { id: 7, stt: 7, maLopHocPhan: 'LHP107', maLopHoc: 'LH107', maHocPhan: 'HP007', tenLopHocPhan: 'Java Cơ Bản', siSoToiDa: 42, trangThai: 'Không hoạt động', thoiGianTao: '2025-06-07 09:30', thoiGianCapNhat: '2025-06-11 10:30' },
    { id: 8, stt: 8, maLopHocPhan: 'LHP108', maLopHoc: 'LH108', maHocPhan: 'HP008', tenLopHocPhan: 'Python Cơ Bản', siSoToiDa: 33, trangThai: 'Hoạt động', thoiGianTao: '2025-06-08 13:00', thoiGianCapNhat: '2025-06-12 15:45' },
    { id: 9, stt: 9, maLopHocPhan: 'LHP109', maLopHoc: 'LH109', maHocPhan: 'HP009', tenLopHocPhan: 'Xác Suất Thống Kê', siSoToiDa: 40, trangThai: 'Hoạt động', thoiGianTao: '2025-06-09 15:20', thoiGianCapNhat: '2025-06-13 09:15' },
    { id: 10, stt: 10, maLopHocPhan: 'LHP110', maLopHoc: 'LH110', maHocPhan: 'HP010', tenLopHocPhan: 'Toán Rời Rạc', siSoToiDa: 36, trangThai: 'Không hoạt động', thoiGianTao: '2025-06-10 14:10', thoiGianCapNhat: '2025-06-14 10:50' },
    { id: 11, stt: 11, maLopHocPhan: 'LHP111', maLopHoc: 'LH111', maHocPhan: 'HP011', tenLopHocPhan: 'Triết Học Mác', siSoToiDa: 55, trangThai: 'Hoạt động', thoiGianTao: '2025-06-11 10:05', thoiGianCapNhat: '2025-06-15 11:30' },
    { id: 12, stt: 12, maLopHocPhan: 'LHP112', maLopHoc: 'LH112', maHocPhan: 'HP012', tenLopHocPhan: 'Cấu Trúc Dữ Liệu', siSoToiDa: 48, trangThai: 'Hoạt động', thoiGianTao: '2025-06-12 13:40', thoiGianCapNhat: '2025-06-16 09:10' },
    { id: 13, stt: 13, maLopHocPhan: 'LHP113', maLopHoc: 'LH113', maHocPhan: 'HP013', tenLopHocPhan: 'Pháp Luật Đại Cương', siSoToiDa: 60, trangThai: 'Hoạt động', thoiGianTao: '2025-06-13 08:20', thoiGianCapNhat: '2025-06-17 14:00' },
    { id: 14, stt: 14, maLopHocPhan: 'LHP114', maLopHoc: 'LH114', maHocPhan: 'HP014', tenLopHocPhan: 'Hệ Điều Hành', siSoToiDa: 34, trangThai: 'Hoạt động', thoiGianTao: '2025-06-14 10:30', thoiGianCapNhat: '2025-06-18 11:30' },
    { id: 15, stt: 15, maLopHocPhan: 'LHP115', maLopHoc: 'LH115', maHocPhan: 'HP015', tenLopHocPhan: 'Quản Trị CSDL', siSoToiDa: 40, trangThai: 'Không hoạt động', thoiGianTao: '2025-06-15 09:15', thoiGianCapNhat: '2025-06-19 12:45' },
    { id: 16, stt: 16, maLopHocPhan: 'LHP116', maLopHoc: 'LH116', maHocPhan: 'HP016', tenLopHocPhan: 'Hệ Thống Nhúng', siSoToiDa: 32, trangThai: 'Hoạt động', thoiGianTao: '2025-06-16 11:25', thoiGianCapNhat: '2025-06-20 13:55' },
    { id: 17, stt: 17, maLopHocPhan: 'LHP117', maLopHoc: 'LH117', maHocPhan: 'HP017', tenLopHocPhan: 'Phân Tích TKHTTT', siSoToiDa: 37, trangThai: 'Hoạt động', thoiGianTao: '2025-06-17 08:45', thoiGianCapNhat: '2025-06-21 10:10' },
    { id: 18, stt: 18, maLopHocPhan: 'LHP118', maLopHoc: 'LH118', maHocPhan: 'HP018', tenLopHocPhan: 'Thiết Kế Web', siSoToiDa: 44, trangThai: 'Hoạt động', thoiGianTao: '2025-06-18 13:30', thoiGianCapNhat: '2025-06-22 14:20' },
    { id: 19, stt: 19, maLopHocPhan: 'LHP119', maLopHoc: 'LH119', maHocPhan: 'HP019', tenLopHocPhan: 'Lập Trình Di Động', siSoToiDa: 41, trangThai: 'Hoạt động', thoiGianTao: '2025-06-19 15:00', thoiGianCapNhat: '2025-06-23 16:00' },
    { id: 20, stt: 20, maLopHocPhan: 'LHP120', maLopHoc: 'LH120', maHocPhan: 'HP020', tenLopHocPhan: 'AI Cơ Bản', siSoToiDa: 39, trangThai: 'Hoạt động', thoiGianTao: '2025-06-20 10:00', thoiGianCapNhat: '2025-06-24 11:30' },
    { id: 21, stt: 21, maLopHocPhan: 'LHP121', maLopHoc: 'LH121', maHocPhan: 'HP021', tenLopHocPhan: 'Blockchain Cơ Bản', siSoToiDa: 28, trangThai: 'Không hoạt động', thoiGianTao: '2025-06-21 14:15', thoiGianCapNhat: '2025-06-25 15:00' },
    { id: 22, stt: 22, maLopHocPhan: 'LHP122', maLopHoc: 'LH122', maHocPhan: 'HP022', tenLopHocPhan: 'Thực Tập Cơ Sở', siSoToiDa: 60, trangThai: 'Hoạt động', thoiGianTao: '2025-06-22 09:45', thoiGianCapNhat: '2025-06-26 10:10' },
    { id: 23, stt: 23, maLopHocPhan: 'LHP123', maLopHoc: 'LH123', maHocPhan: 'HP023', tenLopHocPhan: 'Big Data Cơ Bản', siSoToiDa: 48, trangThai: 'Hoạt động', thoiGianTao: '2025-06-23 11:00', thoiGianCapNhat: '2025-06-27 13:15' },
    { id: 24, stt: 24, maLopHocPhan: 'LHP124', maLopHoc: 'LH124', maHocPhan: 'HP024', tenLopHocPhan: 'Lập Trình NodeJS', siSoToiDa: 40, trangThai: 'Hoạt động', thoiGianTao: '2025-06-24 10:45', thoiGianCapNhat: '2025-06-28 14:25' }
  ]);

  // State cho phân trang, tìm kiếm, lọc theo trạng thái và modal
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState('');
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedClassSection, setSelectedClassSection] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedClassSection, setEditedClassSection] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [classSectionToDelete, setClassSectionToDelete] = useState(null);

  // Danh sách trạng thái để lọc
  const trangThaiOptions = ['Hoạt động', 'Không hoạt động'];

  // Hàm xử lý khi nhấn nút Thêm lớp học phần
  const handleAddClassSection = () => {
    setOpenAddModal(true);
  };

  // Hàm đóng modal thêm lớp học phần
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Hàm thêm lớp học phần mới
  const handleAddNewClassSection = (newClassSection) => {
    setClassSectiones((prevClassSectiones) => {
      const updatedClassSectiones = [...prevClassSectiones, { ...newClassSection, stt: prevClassSectiones.length + 1 }];
      return updatedClassSectiones;
    });
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditClassSection = (id) => {
    const ClassSectionToEdit = ClassSectiones.find((c) => c.id === id);
    setEditedClassSection(ClassSectionToEdit);
    setOpenEditModal(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedClassSection(null);
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEditedClassSection = (updatedClassSection) => {
    setClassSectiones((prevClassSectiones) =>
      prevClassSectiones.map((cls) =>
        cls.id === updatedClassSection.id ? { ...cls, ...updatedClassSection } : cls
      )
    );
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem lớp học phần
  const handleViewClassSection = (id) => {
    const cls = ClassSectiones.find((c) => c.id === id);
    setSelectedClassSection(cls);
    setOpenDetailModal(true);
  };

  // Hàm xử lý xóa lớp học phần
  const handleDeleteClassSection = (id) => {
    const cls = ClassSectiones.find((c) => c.id === id);
    setClassSectionToDelete(cls);
    setOpenDeleteModal(true);
  };

  // Hàm xử lý xác nhận xóa lớp học phần
  const handleConfirmDelete = (id) => {
    setClassSectiones((prevClassSectiones) =>
      prevClassSectiones.filter((cls) => cls.id !== id).map((cls, index) => ({
        ...cls,
        stt: index + 1,
      }))
    );
    setOpenDeleteModal(false);
    setClassSectionToDelete(null);
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedClassSection(null);
  };

  // Hàm đóng modal xóa
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setClassSectionToDelete(null);
  };

  // Lọc danh sách lớp học phần dựa trên từ khóa tìm kiếm và trạng thái
  const filteredClassSectiones = ClassSectiones.filter((cls) => {
    const matchesSearchTerm =
      cls.maLopHocPhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.maLopHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.maHocPhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.tenLopHocPhan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrangThai = selectedTrangThai
      ? cls.trangThai === selectedTrangThai
      : true;

    return matchesSearchTerm && matchesTrangThai;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedClassSectiones = filteredClassSectiones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 64px)', overflowY: 'auto', width: '100%' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 2 }}>
        {/* Bảng danh sách lớp học phần */}
        <Card sx={{ width: '100%', boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 2 }}>
              <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
                Danh sách lớp học phần
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                {isSmallScreen ? (
                  <IconButton
                    color="primary"
                    onClick={handleAddClassSection}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    <AddIcon sx={{ color: '#fff' }} />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClassSection}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    Thêm lớp học phần
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
                placeholder="Tìm kiếm theo mã lớp học phần, mã lớp học, mã học phần, tên lớp học phần..."
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
            {filteredClassSectiones.length === 0 ? (
              <Typography>Không có lớp học phần nào để hiển thị.</Typography>
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <ClassSectionTable
                  displayedClassSectiones={displayedClassSectiones}
                  isExtraSmallScreen={isExtraSmallScreen}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  isLargeScreen={isLargeScreen}
                  handleViewClassSection={handleViewClassSection}
                  handleEditClassSection={handleEditClassSection}
                  handleDeleteClassSection={handleDeleteClassSection}
                />
                <TablePagination
                  component="div"
                  count={filteredClassSectiones.length}
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
      <ClassSectionDetailModal
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        cls={selectedClassSection}
      />
      <AddClassSectionModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddClassSection={handleAddNewClassSection}
        existingClassSections={ClassSectiones}
      />
      <EditClassSectionModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        cls={editedClassSection}
        onSave={handleSaveEditedClassSection}
      />
      <DeleteClassSectionModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
        cls={classSectionToDelete}
      />
    </Box>
  );
};

export default ClassSection;