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
import { 
  Add as AddIcon, 
  Search as SearchIcon,
} from '@mui/icons-material';
import RoomDetailModal from './RoomDetailModal';
import AddRoomModal from './AddRoomModal';
import EditRoomModal from './EditRoomModal';
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
    { id: 9, stt: 9, maPhongHoc: 'P501', tenPhongHoc: 'Phòng 501', toaNha: 'C', tang: 5, sucChua: 60, loaiPhongHoc: 'Phòng lý thuyết', trangThai: 'Hoạt động', thoiGianTao: '2025-05-23 08:30', thoiGianCapNhat: '2025-05-28 12:10' },
    { id: 10, stt: 10, maPhongHoc: 'P502', tenPhongHoc: 'Phòng 502', toaNha: 'C', tang: 5, sucChua: 50, loaiPhongHoc: 'Phòng thực hành', trangThai: 'Hoạt động', thoiGianTao: '2025-05-24 09:10', thoiGianCapNhat: '2025-05-29 14:50' },
    { id: 11, stt: 11, maPhongHoc: 'P601', tenPhongHoc: 'Phòng 601', toaNha: 'C', tang: 6, sucChua: 100, loaiPhongHoc: 'Phòng hội thảo', trangThai: 'Hoạt động', thoiGianTao: '2025-05-25 10:40', thoiGianCapNhat: '2025-05-30 11:30' },
    { id: 12, stt: 12, maPhongHoc: 'P602', tenPhongHoc: 'Phòng 602', toaNha: 'C', tang: 6, sucChua: 40, loaiPhongHoc: 'Phòng lý thuyết', trangThai: 'Hoạt động', thoiGianTao: '2025-05-26 13:25', thoiGianCapNhat: '2025-06-01 10:45' },
    { id: 13, stt: 13, maPhongHoc: 'P701', tenPhongHoc: 'Phòng 701', toaNha: 'D', tang: 7, sucChua: 50, loaiPhongHoc: 'Phòng thực hành', trangThai: 'Không hoạt động', thoiGianTao: '2025-05-27 15:10', thoiGianCapNhat: '2025-06-02 09:35' },
    { id: 14, stt: 14, maPhongHoc: 'P702', tenPhongHoc: 'Phòng 702', toaNha: 'D', tang: 7, sucChua: 60, loaiPhongHoc: 'Phòng lý thuyết', trangThai: 'Hoạt động', thoiGianTao: '2025-05-28 16:45', thoiGianCapNhat: '2025-06-03 14:15' },
    { id: 15, stt: 15, maPhongHoc: 'P801', tenPhongHoc: 'Phòng 801', toaNha: 'D', tang: 8, sucChua: 80, loaiPhongHoc: 'Phòng hội thảo', trangThai: 'Hoạt động', thoiGianTao: '2025-05-29 09:30', thoiGianCapNhat: '2025-06-04 11:20' },
    { id: 16, stt: 16, maPhongHoc: 'P802', tenPhongHoc: 'Phòng 802', toaNha: 'D', tang: 8, sucChua: 50, loaiPhongHoc: 'Phòng thực hành', trangThai: 'Hoạt động', thoiGianTao: '2025-05-30 10:50', thoiGianCapNhat: '2025-06-05 08:40' },
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

  // Hàm xử lý xóa phòng học
  const handleDeleteRoom = (id) => {
    console.log(`Xóa phòng học với ID: ${id}`);
    // Thêm logic xóa phòng học
  };

  // Hàm đóng modal chi tiết
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
    <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 3 }}>
        {/* Bảng danh sách phòng học */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography variant="h6">
                Danh sách phòng học
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    Thêm phòng học
                  </Button>
                )}
                <FormControl sx={{ minWidth: isSmallScreen ? 100 : 200 }} variant="outlined">
                  <InputLabel id="loai-phong-hoc-filter-label">{isSmallScreen ? 'Loại' : 'Lọc theo loại phòng'}</InputLabel>
                  <Select
                    labelId="loai-phong-hoc-filter-label"
                    value={selectedLoaiPhongHoc}
                    onChange={(e) => setSelectedLoaiPhongHoc(e.target.value)}
                    label={isSmallScreen ? 'Loại' : 'Lọc theo loại phòng'}
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
            {filteredRooms.length === 0 ? (
              <Typography>Không có phòng học nào để hiển thị.</Typography>
            ) : (
              <>
                <RoomTable
                  displayedRooms={displayedRooms}
                  isExtraSmallScreen={isExtraSmallScreen}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  isLargeScreen={isLargeScreen}
                  handleViewRoom={handleViewRoom}
                  handleEditRoom={handleEditRoom}
                  handleDeleteRoom={handleDeleteRoom}
                />
                <TablePagination
                  component="div"
                  count={filteredRooms.length}
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
      <RoomDetailModal 
        open={openDetail} 
        onClose={handleCloseDetail} 
        room={selectedRoom} 
      />
      <AddRoomModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddRoom={handleAddNewRoom}
      />
      <EditRoomModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        room={editedRoom}
        onSave={handleSaveEditedRoom}
      />
    </Box>
  );
};

export default Room;