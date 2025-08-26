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
  Paper,
  Grid,
  Tabs,
  Tab,
  useTheme,
  alpha,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

import {
  Add as AddIcon,
  Search as SearchIcon,
  MeetingRoom as RoomIcon,
  Computer as ComputerIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  FilterList as FilterIcon
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeTab, setActiveTab] = useState(0);

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

  // Group rooms by building
  const groupedRooms = filteredRooms.reduce((acc, room) => {
    // Extract building from location string
    const buildingMatch = room.location?.match(/(Tòa|Khu) [A-Z]/i);
    const building = buildingMatch ? buildingMatch[0] : 'Khác';

    if (!acc[building]) {
      acc[building] = [];
    }
    acc[building].push(room);
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

  const handleChangeLayout = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Set building filter based on tab selection
    const buildings = Object.keys(groupedRooms);
    if (newValue === 0) {
      setBuildingFilter('');
    } else if (newValue <= buildings.length) {
      setBuildingFilter(buildings[newValue - 1]);
    }
  };

  return (
    <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
      {/* Header and Filters */}
      <Paper sx={{ width: '100%', p: 2, mb: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isSmallScreen ? 'stretch' : 'center',
          mb: 2,
          gap: 2
        }}>
          <Typography variant="h5" fontWeight="600">
            Danh sách phòng học
          </Typography>

          <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center'
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
              <InputLabel>Loại phòng</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Loại phòng"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="theory">Lý thuyết</MenuItem>
                <MenuItem value="practice">Thực hành</MenuItem>
                <MenuItem value="lab">Phòng Lab</MenuItem>
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
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddRoomClick}
              sx={{ ml: 1 }}
            >
              Thêm phòng
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', // Cho phép flex wrap để đảm bảo responsive
            width: '100%',
          }}
        >
          {/* Tabs chọn tòa nhà */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              flexGrow: 1,
              minHeight: 48,
              '& .MuiTabs-scroller': {
                display: 'flex',
                alignItems: 'center'
              }
            }}
          >
            <Tab label="Tất cả" sx={{ minWidth: 'auto', px: 1 }} />
            {Object.keys(groupedRooms).map((building) => (
              <Tab key={building} label={building} sx={{ minWidth: 'auto', px: 1 }} />
            ))}
          </Tabs>

          {/* Toggle view (grid / list) - Hiển thị trên mọi kích thước */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleChangeLayout}
            aria-label="View mode"
            size="small"
            sx={{ ml: 2, height: 36 }}
          >
            <ToggleButton value="grid" aria-label="Grid view">
              <GridIcon />
              Lưới
            </ToggleButton>
            <ToggleButton value="list" aria-label="List view">
              <ListIcon />
              Danh sách
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Room Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
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
        <Box>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              {Object.entries(groupedRooms).map(([building, buildingRooms]) => (
                <Box key={building}>
                  <Typography variant="h6" sx={{
                    mb: 2,
                    p: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <RoomIcon color="primary" />
                    {building}
                    <Chip
                      label={`${buildingRooms.length} phòng`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Typography>

                  <Grid container spacing={2}>
                    {buildingRooms.map(room => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={room.room_id}>
                        <RoomCard
                          room={room}
                          onClick={() => handleRoomClick(room)}
                          onEdit={() => handleEditRoomClick(room)}
                          onDelete={() => handleDeleteRoom(room.room_id)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <Paper sx={{ p: 2 }}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 1
              }}>
                {filteredRooms.map(room => (
                  <RoomListItem
                    key={room.room_id}
                    room={room}
                    onClick={() => handleRoomClick(room)}
                    onEdit={() => handleEditRoomClick(room)}
                    onDelete={() => handleDeleteRoom(room.room_id)}
                  />
                ))}
              </Box>
            </Paper>
          )}
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
        roomData={selectedRoom}
        existingRooms={rooms}
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
    </Box>
  );
};

// Room Card Component (Giữ nguyên từ bản trước)
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
        backgroundColor: room.status === 'active'
          ? theme.palette.success.main
          : room.status === 'maintenance'
            ? theme.palette.warning.main
            : theme.palette.error.main
      }} />

      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="h6" fontWeight="600">
            {room.room_name || room.room_id}
          </Typography>
          <Chip
            label={
              room.status === 'active' ? 'Sẵn sàng' :
                room.status === 'maintenance' ? 'Bảo trì' : 'Ngưng hoạt động'
            }
            size="small"
            sx={{
              backgroundColor: room.status === 'active'
                ? alpha(theme.palette.success.main, 0.1)
                : room.status === 'maintenance'
                  ? alpha(theme.palette.warning.main, 0.1)
                  : alpha(theme.palette.error.main, 0.1),
              color: room.status === 'active'
                ? theme.palette.success.dark
                : room.status === 'maintenance'
                  ? theme.palette.warning.dark
                  : theme.palette.error.dark
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {room.location} • {room.type === 'theory'
            ? 'Lý thuyết'
            : room.type === 'practice'
              ? 'Thực hành'
              : room.type === 'lab'
                ? 'Phòng Lab'
                : room.type} • {room.capacity} chỗ
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
            <Box
              key={i}
              sx={{
                aspectRatio: '1/1',
                borderRadius: '4px',
                backgroundColor: alpha(
                  room.status === 'active'
                    ? theme.palette.primary.main
                    : room.status === 'maintenance'
                      ? theme.palette.warning.main
                      : theme.palette.error.main,
                  room.status === 'active' ? 0.2 : 0.1
                ),
                border: `1px solid ${alpha(
                  room.status === 'active'
                    ? theme.palette.primary.main
                    : room.status === 'maintenance'
                      ? theme.palette.warning.main
                      : theme.palette.error.main,
                  0.3
                )}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: alpha(theme.palette.text.primary, 0.7),
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            >
              {i === 29 && room.capacity > 30 ? (
                <Typography variant="caption" sx={{
                  color: room.status === 'active'
                    ? theme.palette.primary.dark
                    : room.status === 'maintenance'
                      ? theme.palette.warning.dark
                      : theme.palette.error.dark
                }}>
                  +{room.capacity - 30}
                </Typography>
              ) : (
                i === 0 && room.type === 'practice' && (
                  <ComputerIcon fontSize="small" sx={{
                    color: alpha(theme.palette.text.secondary, 0.6)
                  }} />
                )
              )}
            </Box>
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

// Room List Item Component for List View
const RoomListItem = ({ room, onClick, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderColor: alpha(theme.palette.primary.main, 0.3)
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box sx={{
          width: 12,
          height: 40,
          borderRadius: 1,
          backgroundColor: room.status === 'active'
            ? theme.palette.success.main
            : room.status === 'maintenance'
              ? theme.palette.warning.main
              : theme.palette.error.main
        }} />

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="600">
              {room.room_name || room.room_id}
            </Typography>
            <Chip
              label={
                room.status === 'active' ? 'Sẵn sàng' :
                  room.status === 'maintenance' ? 'Bảo trì' : 'Ngưng hoạt động'
              }
              size="small"
              sx={{
                backgroundColor: room.status === 'active'
                  ? alpha(theme.palette.success.main, 0.1)
                  : room.status === 'maintenance'
                    ? alpha(theme.palette.warning.main, 0.1)
                    : alpha(theme.palette.error.main, 0.1),
                color: room.status === 'active'
                  ? theme.palette.success.dark
                  : room.status === 'maintenance'
                    ? theme.palette.warning.dark
                    : theme.palette.error.dark
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {room.location} • {room.type === 'theory'
              ? 'Lý thuyết'
              : room.type === 'practice'
                ? 'Thực hành'
                : room.type === 'lab'
                  ? 'Phòng Lab'
                  : room.type} • {room.capacity} chỗ
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default RoomManagement;