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
    {id:1,stt:1,maThongBao:'TB001',tieuDe:'Thông báo họp lớp',noiDung:'Cuộc họp lớp sẽ diễn ra vào 15:00 ngày 20/06/2025',loaiThongBao:'Họp lớp',mucDoUuTien:'Cao',kenhGui:'Email',thoiGianGui:'2025-06-15 09:00',thoiGianTao:'2025-06-14 08:00',thoiGianCapNhat:'2025-06-14 08:00'},
    {id:2,stt:2,maThongBao:'TB002',tieuDe:'Cập nhật lịch học',noiDung:'Lịch học mới sẽ được áp dụng từ 01/07/2025',loaiThongBao:'Lịch học',mucDoUuTien:'Trung bình',kenhGui:'Website',thoiGianGui:'2025-06-16 10:00',thoiGianTao:'2025-06-15 09:30',thoiGianCapNhat:'2025-06-15 09:30'},
    {id:3,stt:3,maThongBao:'TB003',tieuDe:'Sự kiện giao lưu văn hóa',noiDung:'Sự kiện giao lưu văn hóa sẽ tổ chức vào 18:00 ngày 25/06/2025 tại hội trường A',loaiThongBao:'Sự kiện',mucDoUuTien:'Thấp',kenhGui:'Email',thoiGianGui:'2025-06-20 14:00',thoiGianTao:'2025-06-19 10:00',thoiGianCapNhat:'2025-06-19 10:00'},
    {id:4,stt:4,maThongBao:'TB004',tieuDe:'Thông báo nghỉ lễ',noiDung:'Trường nghỉ lễ từ 30/06/2025 đến 02/07/2025',loaiThongBao:'Lịch học',mucDoUuTien:'Cao',kenhGui:'Website',thoiGianGui:'2025-06-25 08:00',thoiGianTao:'2025-06-24 15:00',thoiGianCapNhat:'2025-06-24 15:00'},
    {id:5,stt:5,maThongBao:'TB005',tieuDe:'Họp phụ huynh',noiDung:'Cuộc họp phụ huynh diễn ra vào 09:00 ngày 28/06/2025 tại phòng họp B',loaiThongBao:'Họp lớp',mucDoUuTien:'Trung bình',kenhGui:'Email',thoiGianGui:'2025-06-26 11:00',thoiGianTao:'2025-06-25 09:00',thoiGianCapNhat:'2025-06-25 09:00'},
    {id:6,stt:6,maThongBao:'TB006',tieuDe:'Workshop kỹ năng mềm',noiDung:'Workshop kỹ năng mềm sẽ diễn ra vào 14:00 ngày 01/07/2025',loaiThongBao:'Sự kiện',mucDoUuTien:'Thấp',kenhGui:'Website',thoiGianGui:'2025-06-28 16:00',thoiGianTao:'2025-06-27 12:00',thoiGianCapNhat:'2025-06-27 12:00'},
    {id:7,stt:7,maThongBao:'TB007',tieuDe:'Cập nhật điểm thi',noiDung:'Điểm thi kỳ 1 sẽ được công bố vào ngày 05/07/2025',loaiThongBao:'Lịch học',mucDoUuTien:'Cao',kenhGui:'Email',thoiGianGui:'2025-07-03 10:00',thoiGianTao:'2025-07-02 08:00',thoiGianCapNhat:'2025-07-02 08:00'},
    {id:8,stt:8,maThongBao:'TB008',tieuDe:'Thông báo kiểm tra định kỳ',noiDung:'Kiểm tra định kỳ sẽ diễn ra vào 08:00 ngày 10/07/2025',loaiThongBao:'Lịch học',mucDoUuTien:'Trung bình',kenhGui:'Website',thoiGianGui:'2025-07-05 09:00',thoiGianTao:'2025-07-04 14:00',thoiGianCapNhat:'2025-07-04 14:00'},
    {id:9,stt:9,maThongBao:'TB009',tieuDe:'Hội thảo công nghệ',noiDung:'Hội thảo công nghệ diễn ra vào 13:00 ngày 15/07/2025 tại hội trường C',loaiThongBao:'Sự kiện',mucDoUuTien:'Cao',kenhGui:'Email',thoiGianGui:'2025-07-10 15:00',thoiGianTao:'2025-07-09 11:00',thoiGianCapNhat:'2025-07-09 11:00'},
    {id:10,stt:10,maThongBao:'TB010',tieuDe:'Thông báo bảo trì hệ thống',noiDung:'Hệ thống sẽ bảo trì từ 22:00 ngày 20/07/2025 đến 06:00 ngày 21/07/2025',loaiThongBao:'Sự kiện',mucDoUuTien:'Thấp',kenhGui:'Website',thoiGianGui:'2025-07-18 17:00',thoiGianTao:'2025-07-17 13:00',thoiGianCapNhat:'2025-07-17 13:00'},
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editedNotification, setEditedNotification] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Danh sách loại thông báo để lọc
  const loaiThongBaoOptions = ['Họp lớp', 'Lịch học', 'Sự kiện'];

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
      const updatedNotifications = [...prevNotifications, { ...newNotification, stt: prevNotifications.length + 1 }];
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
      prevNotifications.map((notif) =>
        notif.id === updatedNotification.id ? { ...notif, ...updatedNotification } : notif
      )
    );
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem thông báo
  const handleViewNotification = (id) => {
    const notif = notifications.find((n) => n.id === id);
    setSelectedNotification(notif);
    setOpenDetail(true);
  };

  // Hàm xử lý xóa thông báo
  const handleDeleteNotification = (id) => {
    const notif = notifications.find((n) => n.id === id);
    setNotificationToDelete(notif);
    setOpenDeleteModal(true);
  };

  // Hàm xác nhận xóa thông báo
  const confirmDeleteNotification = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications
        .filter((notif) => notif.id !== id)
        .map((notif, index) => ({ ...notif, stt: index + 1 }));
      return updatedNotifications;
    });
    setOpenDeleteModal(false);
    setNotificationToDelete(null);
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedNotification(null);
  };

  // Hàm đóng modal xóa
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setNotificationToDelete(null);
  };

  // Lọc danh sách thông báo dựa trên từ khóa tìm kiếm và loại thông báo
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearchTerm =
      notif.maThongBao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.noiDung.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLoaiThongBao = selectedLoaiThongBao
      ? notif.loaiThongBao === selectedLoaiThongBao
      : true;
    return matchesSearchTerm && matchesLoaiThongBao;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedNotifications = filteredNotifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 64px)', overflowY: 'auto', width: '100%' }}>
      {/* Main Content */}
      <Box sx={{ width: '100%', mb: 2 }}>
        {/* Bảng danh sách thông báo */}
        <Card sx={{ width: '100%', boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 2 }}>
              <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
                Danh sách thông báo
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
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
                <FormControl sx={{ minWidth: isSmallScreen ? 100 : 200, flexGrow: 1, maxWidth: { xs: '100%', sm: 200 } }} variant="outlined">
                  <InputLabel id="loai-thong-bao-filter-label">{isSmallScreen ? 'Loại thông báo' : 'Lọc theo loại thông báo'}</InputLabel>
                  <Select
                    labelId="loai-thong-bao-filter-label"
                    value={selectedLoaiThongBao}
                    onChange={(e) => setSelectedLoaiThongBao(e.target.value)}
                    label={isSmallScreen ? 'Loại thông báo' : 'Lọc theo loại thông báo'}
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
                placeholder="Tìm kiếm theo mã thông báo, tiêu đề, nội dung..."
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
                  handleDeleteNotification={handleDeleteNotification}
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
        onDelete={confirmDeleteNotification}
        notification={notificationToDelete}
      />
    </Box>
  );
};

export default Notification;