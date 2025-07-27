import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Avatar,
  Paper,
  Modal,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MeetingRoom as RoomIcon,
  Computer as ComputerIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  Construction as MaintenanceIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import useResponsive from '../../hooks/useResponsive';
import AddRoomModal from './AddRoomModal';
import EditRoomModal from './EditRoomModal';
import DeleteRoomModal from './DeleteRoomModal';
import RoomDetailModal from './RoomDetailModal';
import {
  getAllRoomAPI,
  createRoomAPI,
  updateRoomAPI,
  deleteRoomAPI,
} from '../../api/roomAPI';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const theme = useTheme();
  const { isSmallScreen } = useResponsive();

  // State for rooms data
  const [rooms, setRooms] = useState([]);

  // State for filters and modals
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log("room", rooms)

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllRoomAPI();
      if (!response) {
        console.error("Không có dữ liệu phòng học");
        setError("Không có dữ liệu phòng học");
        return;
      }
      setRooms(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng học:", error);
      setError("Không thể tải danh sách phòng học. Vui lòng thử lại.");
      toast.error('Lỗi khi tải danh sách phòng học. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = (room.room_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_id?.toLowerCase().includes(searchTerm.toLowerCase())) ?? true;
    const matchesBuilding = buildingFilter ? room.location?.includes(buildingFilter) : true;
    const matchesType = typeFilter ? room.type === typeFilter : true;
    const matchesStatus = statusFilter ? room.status === statusFilter : true;

    return matchesSearch && matchesBuilding && matchesType && matchesStatus;
  });

  // Group rooms by building and floor (optional feature if needed)
  const groupedRooms = filteredRooms.reduce((acc, room) => {
    // Extract building from location string (assuming format like "Tầng 2, Tòa A")
    const locationParts = room.location?.split(',') || [];
    const building = locationParts.length > 1 ? locationParts[1]?.trim() : 'Unknown';
    const floor = locationParts.length > 0 ? locationParts[0]?.trim() : 'Unknown';

    const key = `${building}-${floor}`;
    if (!acc[key]) {
      acc[key] = {
        building,
        floor,
        rooms: []
      };
    }
    acc[key].rooms.push(room);
    return acc;
  }, {});

  // Handle room selection
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setOpenDetailModal(true);
  };

  // Add new room
  const handleAddRoom = async (newRoomData) => {
    try {
      setLoading(true);
      setError('');
      const response = await createRoomAPI(newRoomData);
      if (response) {
        toast.success('Thêm phòng học thành công!');
        await fetchRooms(); // Refresh the room list
        setOpenAddModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi thêm phòng học:", error);
      setError("Không thể thêm phòng học. Vui lòng kiểm tra lại thông tin.");
      toast.error('Thêm phòng học thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Edit room
  const handleEditRoom = async (updatedRoomData) => {
    try {
      setLoading(true);
      setError('');
      const response = await updateRoomAPI(updatedRoomData.room_id, updatedRoomData);
      if (response) {
        toast.success('Cập nhật phòng học thành công!');
        await fetchRooms(); // Refresh the room list
        setOpenEditModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật phòng học:", error);
      setError("Không thể cập nhật phòng học. Vui lòng kiểm tra lại thông tin.");
      toast.error('Cập nhật phòng học thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Delete room
  const handleDeleteRoom = (roomId) => {
    const room = rooms.find((r) => r.room_id === roomId);
    setRoomToDelete(room);
    setOpenDeleteModal(true);
  };

  // Confirm delete room
  const confirmDeleteRoom = async (roomId) => {
    try {
      setLoading(true);
      setError('');
      const response = await deleteRoomAPI(roomId);
      if (response) {
        toast.success('Xóa phòng học thành công!');
        await fetchRooms(); // Refresh the room list
      }
    } catch (error) {
      console.error("Lỗi khi xóa phòng học:", error);
      setError("Không thể xóa phòng học. Vui lòng thử lại.");
      toast.error('Xóa phòng học thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
      setRoomToDelete(null);
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (room) => {
    setRoomToDelete(room);
    setOpenDeleteModal(true);
  };

  // Handle add room button click
  const handleAddRoomClick = () => {
    setOpenAddModal(true);
  };

  // Handle edit room click
  const handleEditRoomClick = (room) => {
    setSelectedRoom(room);
    setOpenEditModal(true);
  };

  // Close modal handlers
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedRoom(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setRoomToDelete(null);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedRoom(null);
  };

  return (
    <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      {/* Header and Filters */}
      <Card sx={{ width: '100%', boxShadow: 1 }}>
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
              Quản lý Phòng học
            </Typography>

            <Box sx={{
              display: 'flex',
              gap: 2,
              flexDirection: isSmallScreen ? 'column' : 'row',
              width: isSmallScreen ? '100%' : 'auto'
            }}>
              <TextField
                size="small"
                placeholder="Tìm phòng..."
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
                <InputLabel>Tòa nhà</InputLabel>
                <Select
                  value={buildingFilter}
                  onChange={(e) => setBuildingFilter(e.target.value)}
                  label="Tòa nhà"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="A">Tòa A</MenuItem>
                  <MenuItem value="B">Tòa B</MenuItem>
                  <MenuItem value="C">Tòa C</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Loại phòng</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Loại phòng"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Lý thuyết">Phòng học lý thuyết</MenuItem>
                  <MenuItem value="Thực hành">Phòng thực hành</MenuItem>
                  {/* <MenuItem value="Phòng hội thảo">Phòng hội thảo</MenuItem> */}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Sẵn sàng">Sẵn sàng</MenuItem>
                  <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddRoomClick}
                sx={{ ml: isSmallScreen ? 0 : 'auto' }}
              >
                Thêm phòng
              </Button>
            </Box>
          </Box>

          {/* Room Matrix Visualization */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Đang tải dữ liệu phòng học...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : filteredRooms.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Không có phòng học nào để hiển thị.</Typography>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              mt: 3
            }}>
              {Object.values(groupedRooms).map(group => (
                <Box key={`${group.building}-${group.floor}`}>
                  <Typography variant="body1" sx={{ mb: 2, bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, p: 1, borderRadius: 1 }}>
                    {group.floor}
                  </Typography>

                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 3
                  }}>
                    {group.rooms.map(room => (
                      <RoomCard
                        key={room.room_id}
                        room={room}
                        onClick={() => handleRoomClick(room)}
                        onEdit={() => handleEditRoomClick(room)}
                        onDelete={() => handleDeleteRoom(room.room_id)}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Room Detail Modal */}
          <RoomDetailModal
            open={openDetailModal}
            onClose={handleCloseDetailModal}
            room={selectedRoom}
          />

          {/* Add Room Modal */}
          <AddRoomModal
            open={openAddModal}
            onClose={handleCloseAddModal}
            onAddRoom={handleAddRoom}
            existingRooms={rooms}
            error={error}
            loading={loading}
            fetchRooms={fetchRooms}
          />

          {/* Edit Room Modal */}
          <EditRoomModal
            open={openEditModal}
            onClose={handleCloseEditModal}
            room={selectedRoom}
            onSave={handleEditRoom}
            error={error}
            loading={loading}
          />

          {/* Delete Room Modal */}
          <DeleteRoomModal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            room={roomToDelete}
            onDelete={confirmDeleteRoom}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

// Room Card Component
const RoomCard = ({ room, onClick, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: alpha(theme.palette.primary.main, 0.3)
        }
      }}
    >
      {/* Status bar */}
      <Box sx={{
        height: 6,
        backgroundColor: room.status === 'Sẵn sàng'
          ? theme.palette.success.main
          : theme.palette.warning.main
      }} />

      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="h6" fontWeight="600">
            {room.room_name || room.room_id}
          </Typography>
          <Chip
            label={room.status === 'Sẵn sàng' ? 'Sẵn sàng' : 'Bảo trì'}
            size="small"
            sx={{
              backgroundColor: room.status === 'Sẵn sàng'
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.warning.main, 0.1),
              color: room.status === 'Sẵn sàng'
                ? theme.palette.success.dark
                : theme.palette.warning.dark
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {room.location} • {room.type} • {room.capacity} chỗ
        </Typography>

        {/* Room matrix visualization */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: 1,
          mb: 2,
          p: 1,
          backgroundColor: alpha(theme.palette.grey[100], 0.5),
          borderRadius: '8px'
        }}>
          {[...Array(Math.min(room.capacity || 0, 30))].map((_, i) => (
            <>
              <Box
                key={i}
                sx={{
                  aspectRatio: '1/1', // Đảm bảo ô vuông
                  borderRadius: '4px',
                  backgroundColor: alpha(
                    room.status === 'Sẵn sàng'
                      ? theme.palette.primary.main
                      : theme.palette.warning.main,
                    room.status === 'Sẵn sàng' ? 0.2 : 0.1
                  ),
                  border: `1px solid ${alpha(
                    room.status === 'Sẵn sàng'
                      ? theme.palette.primary.main
                      : theme.palette.warning.main,
                    0.3
                  )}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // Thêm style cho text nếu có
                  color: alpha(theme.palette.text.primary, 0.7), // Màu chữ cho 'OK'
                  fontWeight: 'bold',
                  fontSize: '0.75rem', // Kích thước chữ cho 'OK'
                }}
              >
                {/* Kiểm tra nếu là ô cuối cùng được render */}
                {i === 29 ? (
                  <Typography variant="caption" sx={{
                    color: room.status === 'Sẵn sàng' ? theme.palette.primary.dark : theme.palette.warning.dark
                  }}>
                    {
                      room.capacity - 30 === 0 ? "" : `+${room.capacity - 30}`
                    }
                  </Typography>
                ) : (
                  // Nếu không phải ô cuối cùng, hiển thị ComputerIcon nếu là phòng thực hành
                  i === 0 && room.type?.toLowerCase().includes('thực hành') && (
                    <ComputerIcon fontSize="small" sx={{
                      color: alpha(theme.palette.text.secondary, 0.6)
                    }} />
                  )
                )}
              </Box>
            </>
          ))}
        </Box>

        {/* Note */}
        {room.note && (
          <>
            <Typography variant="caption" color="text.secondary">
              Ghi chú:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, p: 1, backgroundColor: alpha(theme.palette.grey[100], 0.5), borderRadius: '4px' }}>
              {room.note}
            </Typography>
          </>
        )}

        {/* Action buttons */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          mt: 2,
          '& button': {
            minWidth: 32,
            height: 32
          }
        }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            sx={{
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.info.main, 0.2)
              }
            }}
          >
            <EditIcon fontSize="small" color="info" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.2)
              }
            }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomManagement;
