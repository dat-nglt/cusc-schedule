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
import NotificationDetailModal from './NotificationDetailModal';
import AddNotificationModal from './AddNotificationModal';
import EditNotificationModal from './EditNotificationModal';
import DeleteNotificationModal from './DeleteNotificationModal';
import useResponsive from '../../hooks/useResponsive';
import NotificationTable from './NotificationTable';

const Notification = () => {
  const { isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen } = useResponsive();

  // Dữ liệu mẫu cho danh sách thông báo
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      stt: 1,
      maThongBao: 'TB001',
      tieuDeNoiDung: 'Thông báo nghỉ lễ Quốc khánh',
      loaiThongBao: 'Sự kiện',
      mucDoUuTien: 'Cao',
      kenhGui: 'Email',
      thoiGianGui: '2025-06-18 09:00',
      thoiGianTao: '2025-06-15 10:00',
      thoiGianCapNhat: '2025-06-16 14:30',
    },
    {
      id: 2,
      stt: 2,
      maThongBao: 'TB002',
      tieuDeNoiDung: 'Cập nhật lịch thi học kỳ',
      loaiThongBao: 'Học tập',
      mucDoUuTien: 'Trung bình',
      kenhGui: 'App',
      thoiGianGui: '2025-06-17 15:00',
      thoiGianTao: '2025-06-16 11:00',
      thoiGianCapNhat: '2025-06-17 09:45',
    },
    {
      id: 3,
      stt: 3,
      maThongBao: 'TB003',
      tieuDeNoiDung: 'Họp phụ huynh',
      loaiThongBao: 'Hành chính',
      mucDoUuTien: 'Thấp',
      kenhGui: 'SMS',
      thoiGianGui: '2025-06-19 08:00',
      thoiGianTao: '2025-06-17 13:00',
      thoiGianCapNhat: '2025-06-18 09:00',
    },
  ]);

  // State cho phân trang, tìm kiếm, lọc và modal
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoaiThongBao, setSelectedLoaiThongBao] = useState('');
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedNotification, setEditedNotification] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Danh sách loại thông báo để lọc
  const loaiThongBaoOptions = ['Sự kiện', 'Học tập', 'Hành chính'];

  // Hàm xử lý khi nhấn nút Thêm thông báo
  const handleAddNotification = () => {
    setOpenAddModal(true);
  };

  // Hàm đóng modal thêm thông báo
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Hàm thêm thông báo mới
  const handleAddNewNotification = (newNotification) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [
        ...prevNotifications,
        { ...newNotification, stt: prevNotifications.length + 1 },
      ];
      return updatedNotifications;
    });
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditNotification = (id) => {
    const notificationToEdit = notifications.find((n) => n.id === id);
    setEditedNotification(notificationToEdit);
    setOpenEditModal(true);
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedNotification(null);
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEditedNotification = (updatedNotification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === updatedNotification.id
          ? { ...notification, ...updatedNotification }
          : notification
      )
    );
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem thông báo
  const handleViewNotification = (id) => {
    const notification = notifications.find((n) => n.id === id);
    setSelectedNotification(notification);
    setOpenDetail(true);
  };

  // Hàm mở modal xác nhận xóa
  const handleOpenDeleteModal = (notification) => {
    setNotificationToDelete(notification);
    setOpenDeleteModal(true);
  };

  // Hàm đóng modal xóa
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setNotificationToDelete(null);
  };

  // Hàm xử lý xóa thông báo
  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedNotification(null);
  };

  // Lọc danh sách thông báo dựa trên từ khóa tìm kiếm và loại thông báo
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearchTerm =
      notification.maThongBao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.tieuDeNoiDung.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLoaiThongBao = selectedLoaiThongBao
      ? notification.loaiThongBao === selectedLoaiThongBao
      : true;

    return matchesSearchTerm && matchesLoaiThongBao;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedNotifications = filteredNotifications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 64px)', overflowY: 'auto', width: '100%' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 2 }}>
        {/* Bảng danh sách thông báo */}
        <Card sx={{ width: '100%', boxShadow: 1 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                mb: 2,
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
                Danh sách thông báo
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexGrow: 1,
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                }}
              >
                {isSmallScreen ? (
                  <IconButton
                    color="primary"
                    onClick={handleAddNotification}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    <AddIcon sx={{ color: '#fff' }} />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddNotification}
                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                  >
                    Thêm thông báo
                  </Button>
                )}
                <FormControl
                  sx={{
                    minWidth: isSmallScreen ? 100 : 200,
                    flexGrow: 1,
                    maxWidth: { xs: '100%', sm: 200 },
                  }}
                  variant="outlined"
                >
                  <InputLabel id="loai-thong-bao-filter-label">
                    {isSmallScreen ? 'Loại' : 'Lọc theo loại thông báo'}
                  </InputLabel>
                  <Select
                    labelId="loai-thong-bao-filter-label"
                    value={selectedLoaiThongBao}
                    onChange={(e) => setSelectedLoaiThongBao(e.target.value)}
                    label={isSmallScreen ? 'Loại' : 'Lọc theo loại thông báo'}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {loaiThongBaoOptions.map((loai) => (
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
                placeholder="Tìm kiếm theo mã hoặc tiêu đề thông báo..."
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
            {filteredNotifications.length === 0 ? (
              <Typography>Không có thông báo nào để hiển thị.</Typography>
            ) : (
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <NotificationTable
                  displayedNotifications={displayedNotifications}
                  isExtraSmallScreen={isExtraSmallScreen}
                  isSmallScreen={isSmallScreen}
                  isMediumScreen={isMediumScreen}
                  isLargeScreen={isLargeScreen}
                  handleViewNotification={handleViewNotification}
                  handleEditNotification={handleEditNotification}
                  handleDeleteNotification={handleOpenDeleteModal}
                />
                <TablePagination
                  component="div"
                  count={filteredNotifications.length}
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
      <NotificationDetailModal
        open={openDetail}
        onClose={handleCloseDetail}
        notification={selectedNotification}
      />
      <AddNotificationModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onAddNotification={handleAddNewNotification}
        existingNotifications={notifications}
      />
      <EditNotificationModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        notification={editedNotification}
        onSave={handleSaveEditedNotification}
      />
      <DeleteNotificationModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteNotification}
        notification={notificationToDelete}
      />
    </Box>
  );
};

export default Notification;