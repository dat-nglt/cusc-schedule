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
import RoomDetailModal from './RoomDetailModal';
import AddRoomModal from './AddRoomModal';
import EditRoomModal from './EditRoomModal';
import DeleteRoomModal from './DeleteRoomModal';
import useResponsive from '../../hooks/useResponsive';
import RoomTable from './RoomTable';

const Room = () => {
  const { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen } = useResponsive();

  // Dữ liệu mẫu cho danh sách phòng học
  const [rooms, setRooms] = useState([
    { id: 1, stt: 1, maPhongHoc: 'P101', tenPhongHoc: 'Phòng 101', toaNha: 'A', tang: 1, sucChua: 50, loaiPhongHoc: 'Phòng lý thuyết', trangThai: 'Hoạt động', thoiGianTao: '2025-05-15 09:00', thoiGianCapNhat: '2025-05-20 14:30' },
    { id: 2, stt: 2, maPhongHoc: 'P102', tenPhongHoc: 'Phòng 102', toaNha: 'A', tang: 1, sucChua: 40, loaiPhongHoc: 'Phòng thực hành', trangThai: 'Hoạt động', thoiGianTao: '2025-05-16 10:15', thoiGianCapNhat: '2025-05-21 15:00' },
    { id: 3, stt: 3, maPhongHoc: 'P201', tenPhongHoc: 'Phòng 201', toaNha: 'A', tang: 2, sucChua: 60, loaiPhongHoc: 'Phòng lý thuyết', trangThai: 'Hoạt động', thoiGianTao: '2025-05-17 11:30', thoiGianCapNhat: '2025-05-22 09:45' },
    { id: 4, stt: 4, maPhongHoc: 'P202', tenPhongHoc: 'Phòng 202', toaNha: 'A', tang: 2, sucChua: 30, loaiPhongHoc: 'Phòng thực hành', trangThai: 'Không hoạt động', thoiGianTao: '2025-05-18 14:00', thoiGianCapNhat: '2025-05-23 13:15' },
    { id: 5, stt: 5, maPhongHoc: 'P301', tenPhongHoc: 'Phòng 301', toaNha: 'B', tang: 3, sucChua: 80, loaiPhongHoc: 'Phòng hội thảo', trangThai: 'Hoạt động', thoiGianTao: '2025-05-19 15:30', thoiGianCapNhat: '2025-05-24 10:20' },
    { id: 6, stt: 6, maPhongHoc: 'P302', tenPhongHoc: 'Phòng 302', toaNha: 'B', tang: 3, sucChua: 50, loaiPhongHoc: 'Phòng lý thuyết', trangThai: 'Hoạt động', thoiGianTao: '2025-05-20 09:45', thoiGianCapNhat: '2025-05-25 16:10' },
    { id: 7, stt: 7, maPhongHoc: 'P401', tenPhongHoc: 'Phòng 401', toaNha: 'B', tang: 4, sucChua: 40, loaiPhongHoc: 'Phòng thực hành', trangThai: 'Hoạt động', thoiGianTao: '2025-05-21 11:00', thoiGianCapNhat: '2025-05-26 13:40' },
    { id: 8, stt: 8, maPhongHoc: 'P402', tenPhongHoc: 'Phòng 402', toaNha: 'B', tang: 4, sucChua: 70, loaiPhongHoc: 'Phòng hội thảo', trangThai: 'Không hoạt động', thoiGianTao: '2025-05-22 14:20', thoiGianCapNhat: '2025-05-27 15:55' },
  ]);

  // State cho phân trang, tìm kiếm, lọc theo loại phòng học và modal
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoaiPhongHoc, setSelectedLoaiPhongHoc] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedRoom, setEditedRoom] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  // Danh sách loại phòng học để lọc
  const loaiPhongHocOptions = ['Phòng lý thuyết', 'Phòng thực hành', 'Phòng hội thảo'];

  // Hàm xử lý khi nhấn nút Thêm phòng học
  const handleAddRoom = () => {
    setOpenAddModal(true);
  };

  // Hàm đóng modal thêm phòng học
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Hàm thêm phòng học mới
  const handleAddNewRoom = (newRoom) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms, { ...newRoom, stt: prevRooms.length + 1 }];
      return updatedRooms;
    });
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditRoom = (id) => {
    const roomToEdit = rooms.find((r) => r.id === id);
    setEditedRoom(roomToEdit);
    setOpenEditModal(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedRoom(null);
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEditedRoom = (updatedRoom) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
      )
    );
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem phòng học
  const handleViewRoom = (id) => {
    const room = rooms.find((r) => r.id === id);
    setSelectedRoom(room);
    setOpenDetail(true);
  };

  // Hàm mở modal xác nhận xóa
  const handleOpenDeleteModal = (room) => {
    setRoomToDelete(room);
    setOpenDeleteModal(true);
  };

  // Hàm đóng modal xóa
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setRoomToDelete(null);
  };

  // Hàm xử lý xóa phòng học
  const handleDeleteRoom = (id) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
  };

  // Hàm đóng modal chi tiết (định nghĩa mới)
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedRoom(null);
  };

  // Lọc danh sách phòng học dựa trên từ khóa tìm kiếm và loại phòng học
  const filteredRooms = rooms.filter((room) => {
    const matchesSearchTerm =
      room.maPhongHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.tenPhongHoc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLoaiPhongHoc = selectedLoaiPhongHoc
      ? room.loaiPhongHoc === selectedLoaiPhongHoc
      : true;

    return matchesSearchTerm && matchesLoaiPhongHoc;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedRooms = filteredRooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 64px)', overflowY: 'auto', width: '100%' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 2 }}>
        {/* Bảng danh sách phòng học */}
        <Card sx={{ width: '100%', boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 2 }}>
              <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
                Danh sách phòng học
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                {isSmallScreen ? (
                  <IconButton
                    color="primary"
                    onClick={handleAddRoom}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    <AddIcon sx={{ color: '#fff' }} />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddRoom}
                    sx={{
                      bgcolor: '#1976d2',
                      '&:hover': { bgcolor: '#115293' },
                      minWidth: isSmallScreen ? 100 : 150,
                      height: '56px'
                    }}
                  >
                    Thêm phòng
                  </Button>
                )}
                <FormControl sx={{ minWidth: isSmallScreen ? 100 : 200, flexGrow: 1, maxWidth: { xs: '100%', sm: 200 } }} variant="outlined">
                  <InputLabel id="loai-phong-hoc-filter-label">{isSmallScreen ? 'Loại' : 'Lọc theo loại phòng'}</InputLabel>
                  <Select
                    labelId="loai-phong-hoc-filter-label"
                    value={selectedLoaiPhongHoc}
                    onChange={(e) => setSelectedLoaiPhongHoc(e.target.value)}
                    label={isSmallScreen ? 'Loại' : 'Lọc theo loại phòng'}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {loaiPhongHocOptions.map((loai) => (
                      <MenuItem key={loai} value={loai}>
                        {loai}
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
                placeholder="Tìm kiếm theo mã hoặc tên phòng học..."
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
            {filteredRooms.length === 0 ? (
              <Typography>Không có phòng học nào để hiển thị.</Typography>
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <RoomTable
                  displayedRooms={displayedRooms}
                  isExtraSmallScreen={isExtraSmallScreen}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  isLargeScreen={isLargeScreen}
                  handleViewRoom={handleViewRoom}
                  handleEditRoom={handleEditRoom}
                  handleDeleteRoom={handleOpenDeleteModal}
                />
                <TablePagination
                  component="div"
                  count={filteredRooms.length}
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
      <RoomDetailModal
        open={openDetail}
        onClose={handleCloseDetail}
        room={selectedRoom}
      />
      <AddRoomModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddRoom={handleAddNewRoom}
        existingRooms={rooms}
      />
      <EditRoomModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        room={editedRoom}
        onSave={handleSaveEditedRoom}
      />
      <DeleteRoomModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteRoom}
        room={roomToDelete}
      />
    </Box>
  );
};

export default Room;