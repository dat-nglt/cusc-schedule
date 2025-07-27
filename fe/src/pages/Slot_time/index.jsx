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
} from '@mui/icons-material';
import SlotTimeDetailModal from './SlotTimeDetailModal';
import AddSlotTimeModal from './AddSlotTimeModal';
import EditSlotTimeModal from './EditSlotTimeModal';
import DeleteSlotTimeModal from './DeleteSlotTimeModal';
import useResponsive from '../../hooks/useResponsive';
import SlotTimeTable from './SlotTimeTable.jsx';
import {
  getAllTimeslotAPI,
  getTimeslotByIdAPI,
  createTimeslotAPI,
  updateTimeslotAPI,
  deleteTimeslotAPI,
} from '../../api/timeslotAPI.js';
import { toast } from 'react-toastify';

const SlotTime = () => {
  const { isExtraSmallScreen, isSmallScreen, isMediumScreen } = useResponsive();

  // Dữ liệu mẫu cho danh sách khung giờ
  const [slotTimes, setSlotTimes] = useState([]);

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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [slotTimeToDelete, setSlotTimeToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log('SlotTime slotTimes:', slotTimes);

  // Hàm lấy danh sách khung giờ từ API
  const fetchSlotTimes = async () => {
    try {
      setLoading(true);
      const response = await getAllTimeslotAPI();
      if (!response) {
        console.error("Không có dữ liệu khung giờ.");
        return;
      }
      setSlotTimes(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khung giờ:", error);
      setError("Không thể tải danh sách khung giờ. Vui lòng thử lại.");
      toast.error('Lỗi khi tải danh sách khung giờ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng useEffect để gọi API khi component mount
  useEffect(() => {
    fetchSlotTimes();
  }, []);

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
  const handleAddNewSlotTime = async (newSlotTime) => {
    try {
      setLoading(true);
      const response = await createTimeslotAPI(newSlotTime);
      if (response && response.data) {
        toast.success('Thêm khung giờ thành công!');
        fetchSlotTimes(); // Tải lại danh sách khung giờ sau khi thêm thành công
      }
    } catch (error) {
      console.error("Lỗi khi thêm khung giờ:", error);
      setError("Không thể thêm khung giờ. Vui lòng kiểm tra lại thông tin.");
      toast.error('Thêm khung giờ thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditSlotTime = async (id) => {
    try {
      setLoading(true);
      const response = await getTimeslotByIdAPI(id);
      if (response && response.data) {
        setEditedSlotTime(response.data);
        setOpenEditModal(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khung giờ để chỉnh sửa:", error);
      setError("Không thể lấy thông tin khung giờ để chỉnh sửa. Vui lòng thử lại.");
      toast.error('Lỗi khi lấy thông tin khung giờ để chỉnh sửa. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm đóng modal chỉnh sửa
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedSlotTime(null);
  };

  // Hàm lưu thay đổi sau khi chỉnh sửa
  const handleSaveEditedSlotTime = async (updatedSlotTime) => {
    try {
      setLoading(true);
      const response = await updateTimeslotAPI(updatedSlotTime.id, updatedSlotTime);
      if (response && response.data) {
        toast.success('Cập nhật khung giờ thành công!');
        fetchSlotTimes(); // Tải lại danh sách khung giờ sau khi cập nhật thành công
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật khung giờ:", error);
      setError("Không thể cập nhật khung giờ. Vui lòng kiểm tra lại thông tin.");
      toast.error('Cập nhật khung giờ thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý xem khung giờ
  const handleViewSlotTime = async (id) => {
    try {
      setLoading(true);
      const response = await getTimeslotByIdAPI(id);
      if (response && response.data) {
        setSelectedSlotTime(response.data);
        setOpenDetail(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin chi tiết khung giờ:", error);
      setError("Không thể lấy thông tin chi tiết khung giờ. Vui lòng thử lại.");
      toast.error('Lỗi khi lấy thông tin chi tiết khung giờ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa khung giờ
  const handleDeleteSlotTime = (id) => {
    const slotTime = slotTimes.find((s) => s.slot_id === id);
    setSlotTimeToDelete(slotTime);
    setOpenDeleteModal(true);
  };

  // Hàm xử lý xác nhận xóa khung giờ
  const handleConfirmDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteTimeslotAPI(id);
      if (response) {
        toast.success('Xóa khung giờ thành công!');
        fetchSlotTimes(); // Tải lại danh sách khung giờ sau khi xóa thành công
      }
    } catch (error) {
      console.error("Lỗi khi xóa khung giờ:", error);
      setError("Không thể xóa khung giờ. Vui lòng thử lại.");
      toast.error('Xóa khung giờ thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
      setSlotTimeToDelete(null);
    }
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedSlotTime(null);
  };

  // Hàm đóng modal xóa
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSlotTimeToDelete(null);
  };

  // Lọc danh sách khung giờ dựa trên từ khóa tìm kiếm và buổi học
  const filteredSlotTimes = slotTimes.filter((slotTime) => {
    const matchesSearchTerm =
      slotTime.slot_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slotTime.slot_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBuoiHoc = selectedBuoiHoc
      ? slotTime.type === selectedBuoiHoc
      : true;

    return matchesSearchTerm && matchesBuoiHoc;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const displayedSlotTimes = filteredSlotTimes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
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
        fetchSlotTimes={fetchSlotTimes}
      />
      <EditSlotTimeModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        slotTime={editedSlotTime}
        onSave={handleSaveEditedSlotTime}
      />
      <DeleteSlotTimeModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
        slotTime={slotTimeToDelete}
      />
    </Box>
  );
};

export default SlotTime;