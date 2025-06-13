
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
import SlotTimeDetailModal from './SlotTimeDetailModal';
import AddSlotTimeModal from './AddSlotTimeModal';
import EditSlotTimeModal from './EditSlotTimeModal';
import useResponsive from '../../hooks/useResponsive';
import SlotTimeTable from './SlotTimeTable.jsx';

const SlotTime = () => {
  const { isExtraSmallScreen, isSmallScreen, isMediumScreen } = useResponsive();

  // Dữ liệu mẫu cho danh sách khung giờ
  const [slotTimes, setSlotTimes] = useState([
    { id: 1, stt: 1, maKhungGio: 'ST001', tenKhungGio: 'Ca sáng 1', buoiHoc: 'Sáng', thoiGianBatDau: '07:00', thoiGianKetThuc: '09:00', thoiGianTao: '2025-05-15 09:00', thoiGianCapNhat: '2025-05-20 14:30' },
    { id: 2, stt: 2, maKhungGio: 'ST002', tenKhungGio: 'Ca sáng 2', buoiHoc: 'Sáng', thoiGianBatDau: '09:15', thoiGianKetThuc: '11:15', thoiGianTao: '2025-05-16 10:15', thoiGianCapNhat: '2025-05-21 15:00' },
    { id: 3, stt: 3, maKhungGio: 'ST003', tenKhungGio: 'Ca chiều 1', buoiHoc: 'Chiều', thoiGianBatDau: '13:00', thoiGianKetThuc: '15:00', thoiGianTao: '2025-05-17 11:30', thoiGianCapNhat: '2025-05-22 09:45' },
    { id: 4, stt: 4, maKhungGio: 'ST004', tenKhungGio: 'Ca chiều 2', buoiHoc: 'Chiều', thoiGianBatDau: '15:15', thoiGianKetThuc: '17:15', thoiGianTao: '2025-05-18 14:00', thoiGianCapNhat: '2025-05-23 13:15' },
    { id: 5, stt: 5, maKhungGio: 'ST005', tenKhungGio: 'Ca tối 1', buoiHoc: 'Tối', thoiGianBatDau: '18:00', thoiGianKetThuc: '20:00', thoiGianTao: '2025-05-19 15:30', thoiGianCapNhat: '2025-05-24 10:20' },
    { id: 6, stt: 6, maKhungGio: 'ST006', tenKhungGio: 'Ca tối 2', buoiHoc: 'Tối', thoiGianBatDau: '20:15', thoiGianKetThuc: '22:15', thoiGianTao: '2025-05-20 09:45', thoiGianCapNhat: '2025-05-25 16:10' },
    { id: 7, stt: 7, maKhungGio: 'ST007', tenKhungGio: 'Ca sáng 3', buoiHoc: 'Sáng', thoiGianBatDau: '07:30', thoiGianKetThuc: '09:30', thoiGianTao: '2025-05-21 11:00', thoiGianCapNhat: '2025-05-26 13:40' },
    { id: 8, stt: 8, maKhungGio: 'ST008', tenKhungGio: 'Ca chiều 3', buoiHoc: 'Chiều', thoiGianBatDau: '14:00', thoiGianKetThuc: '16:00', thoiGianTao: '2025-05-22 14:20', thoiGianCapNhat: '2025-05-27 15:55' },
    { id: 9, stt: 9, maKhungGio: 'ST009', tenKhungGio: 'Ca sáng 4', buoiHoc: 'Sáng', thoiGianBatDau: '08:00', thoiGianKetThuc: '10:00', thoiGianTao: '2025-05-23 08:30', thoiGianCapNhat: '2025-05-28 10:15' },
    { id: 10, stt: 10, maKhungGio: 'ST010', tenKhungGio: 'Ca sáng 5', buoiHoc: 'Sáng', thoiGianBatDau: '10:15', thoiGianKetThuc: '12:15', thoiGianTao: '2025-05-24 09:00', thoiGianCapNhat: '2025-05-29 11:30' },
    { id: 11, stt: 11, maKhungGio: 'ST011', tenKhungGio: 'Ca chiều 4', buoiHoc: 'Chiều', thoiGianBatDau: '13:30', thoiGianKetThuc: '15:30', thoiGianTao: '2025-05-25 10:45', thoiGianCapNhat: '2025-05-30 12:00' },
    { id: 12, stt: 12, maKhungGio: 'ST012', tenKhungGio: 'Ca chiều 5', buoiHoc: 'Chiều', thoiGianBatDau: '16:00', thoiGianKetThuc: '18:00', thoiGianTao: '2025-05-26 13:15', thoiGianCapNhat: '2025-05-31 14:20' },
    { id: 13, stt: 13, maKhungGio: 'ST013', tenKhungGio: 'Ca tối 3', buoiHoc: 'Tối', thoiGianBatDau: '18:30', thoiGianKetThuc: '20:30', thoiGianTao: '2025-05-27 15:00', thoiGianCapNhat: '2025-06-01 16:10' },
    { id: 14, stt: 14, maKhungGio: 'ST014', tenKhungGio: 'Ca tối 4', buoiHoc: 'Tối', thoiGianBatDau: '20:45', thoiGianKetThuc: '22:45', thoiGianTao: '2025-05-28 16:30', thoiGianCapNhat: '2025-06-02 17:25' },
    { id: 15, stt: 15, maKhungGio: 'ST015', tenKhungGio: 'Ca sáng 6', buoiHoc: 'Sáng', thoiGianBatDau: '06:30', thoiGianKetThuc: '08:30', thoiGianTao: '2025-05-29 07:45', thoiGianCapNhat: '2025-06-03 09:50' },
    { id: 16, stt: 16, maKhungGio: 'ST016', tenKhungGio: 'Ca chiều 6', buoiHoc: 'Chiều', thoiGianBatDau: '14:30', thoiGianKetThuc: '16:30', thoiGianTao: '2025-05-30 11:20', thoiGianCapNhat: '2025-06-04 13:40' },
  ]);

  // State cho phân trang, tìm kiếm, lọc theo buổi và modal
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuoiHoc, setSelectedBuoiHoc] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedSlotTime, setEditedSlotTime] = useState(null);

  // Danh sách buổi học để lọc
  const buoiHocOptions = ['Sáng', 'Chiều', 'Tối'];

  // Hàm xử lý khi nhấn nút Thêm khung giờ
  const handleAddSlotTime = () => {
    setOpenAddModal(true);
  };

  // Hàm đóng modal thêm khung giờ
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Hàm thêm khung giờ mới
  const handleAddNewSlotTime = (newSlotTime) => {
    setSlotTimes((prevSlotTimes) => {
      const updatedSlotTimes = [...prevSlotTimes, { ...newSlotTime, stt: prevSlotTimes.length + 1 }];
      return updatedSlotTimes;
    });
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditSlotTime = (id) => {
    const slotTimeToEdit = slotTimes.find((s) => s.id === id);
    setEditedSlotTime(slotTimeToEdit);
    setOpenEditModal(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedSlotTime(null);
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEditedSlotTime = (updatedSlotTime) => {
    setSlotTimes((prevSlotTimes) =>
      prevSlotTimes.map((slotTime) =>
        slotTime.id === updatedSlotTime.id ? { ...slotTime, ...updatedSlotTime } : slotTime
      )
    );
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem khung giờ
  const handleViewSlotTime = (id) => {
    const slotTime = slotTimes.find((s) => s.id === id);
    setSelectedSlotTime(slotTime);
    setOpenDetail(true);
  };

  // Hàm xử lý xóa khung giờ
  const handleDeleteSlotTime = (id) => {
    console.log(`Xóa khung giờ với ID: ${id}`);
    // Thêm logic xóa khung giờ
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedSlotTime(null);
  };

  // Lọc danh sách khung giờ dựa trên từ khóa tìm kiếm và buổi học
  const filteredSlotTimes = slotTimes.filter((slotTime) => {
    const matchesSearchTerm =
      slotTime.maKhungGio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slotTime.tenKhungGio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBuoiHoc = selectedBuoiHoc
      ? slotTime.buoiHoc === selectedBuoiHoc
      : true;

    return matchesSearchTerm && matchesBuoiHoc;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedSlotTimes = filteredSlotTimes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 3 }}>
        {/* Bảng danh sách khung giờ */}
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography variant="h6">
                Danh sách khung giờ
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isSmallScreen ? (
                  <IconButton
                    color="primary"
                    onClick={handleAddSlotTime}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    <AddIcon sx={{ color: '#fff' }} />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddSlotTime}
                    sx={{
                      bgcolor: '#1976d2',
                      '&:hover': { bgcolor: '#115293' },
                      minWidth: isSmallScreen ? 100 : 150,
                      height: '56px'
                    }}
                  >
                    Thêm khung giờ
                  </Button>
                )}
                <FormControl sx={{ minWidth: isSmallScreen ? 100 : 150 }} variant="outlined">
                  <InputLabel id="buoi-hoc-filter-label">{isSmallScreen ? 'Buổi' : 'Lọc theo buổi'}</InputLabel>
                  <Select
                    labelId="buoi-hoc-filter-label"
                    value={selectedBuoiHoc}
                    onChange={(e) => setSelectedBuoiHoc(e.target.value)}
                    label={isSmallScreen ? 'Buổi' : 'Lọc theo buổi'}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {buoiHocOptions.map((buoi) => (
                      <MenuItem key={buoi} value={buoi}>
                        {buoi}
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
                placeholder="Tìm kiếm theo mã hoặc tên khung giờ..."
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
            {filteredSlotTimes.length === 0 ? (
              <Typography>Không có khung giờ nào để hiển thị.</Typography>
            ) : (
              <>
                <SlotTimeTable
                  displayedSlotTimes={displayedSlotTimes}
                  isExtraSmallScreen={isExtraSmallScreen}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  handleViewSlotTime={handleViewSlotTime}
                  handleEditSlotTime={handleEditSlotTime}
                  handleDeleteSlotTime={handleDeleteSlotTime}
                />
                <TablePagination
                  component="div"
                  count={filteredSlotTimes.length}
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
      <SlotTimeDetailModal
        open={openDetail}
        onClose={handleCloseDetail}
        slotTime={selectedSlotTime}
      />
      <AddSlotTimeModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddSlotTime={handleAddNewSlotTime}
        existingSlotTimes={slotTimes}
      />
      <EditSlotTimeModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        slotTime={editedSlotTime}
        onSave={handleSaveEditedSlotTime}
      />
    </Box>
  );
};

export default SlotTime;