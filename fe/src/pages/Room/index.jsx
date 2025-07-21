import React, { useState } from 'react';
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

const RoomManagement = () => {
  const theme = useTheme();
  const { isSmallScreen } = useResponsive();

  // Sample room data
  const [rooms, setRooms] = useState([
    { id: 1, code: 'A101', name: 'Phòng A101', type: 'Lý thuyết', capacity: 50, building: 'A', floor: 1, status: 'available', equipment: ['Máy chiếu', 'Điều hòa'] },
    { id: 2, code: 'A102', name: 'Phòng A102', type: 'Thực hành', capacity: 30, building: 'A', floor: 1, status: 'available', equipment: ['Máy tính', 'Bảng tương tác'] },
    { id: 3, code: 'B201', name: 'Phòng B201', type: 'Lý thuyết', capacity: 60, building: 'A', floor: 1, status: 'maintenance', equipment: ['Máy chiếu', 'Loa'] },
    { id: 4, code: 'B202', name: 'Phòng B202', type: 'Hội thảo', capacity: 80, building: 'A', floor: 2, status: 'available', equipment: ['Máy chiếu', 'Hệ thống âm thanh'] },
    { id: 5, code: 'C301', name: 'Phòng C301', type: 'Thực hành', capacity: 40, building: 'A', floor: 2, status: 'available', equipment: ['Máy tính', 'Máy in 3D'] },
    { id: 6, code: 'C302', name: 'Phòng C302', type: 'Lý thuyết', capacity: 45, building: 'A', floor: 2, status: 'maintenance', equipment: ['Máy chiếu'] },
  ]);

  // State for filters and modals
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = buildingFilter ? room.building === buildingFilter : true;
    const matchesType = typeFilter ? room.type === typeFilter : true;
    const matchesStatus = statusFilter ? room.status === statusFilter : true;

    return matchesSearch && matchesBuilding && matchesType && matchesStatus;
  });

  // Group rooms by building and floor
  const groupedRooms = filteredRooms.reduce((acc, room) => {
    const key = `${room.building}-${room.floor}`;
    if (!acc[key]) {
      acc[key] = {
        building: room.building,
        floor: room.floor,
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
  const handleAddRoom = (newRoom) => {
    setRooms([...rooms, { ...newRoom, id: Math.max(...rooms.map(r => r.id)) + 1 }]);
    setOpenAddModal(false);
  };

  // Edit room
  const handleEditRoom = (updatedRoom) => {
    setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
    setOpenEditModal(false);
  };

  // Delete room
  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header and Filters */}
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
              <MenuItem value="Lý thuyết">Lý thuyết</MenuItem>
              <MenuItem value="Thực hành">Thực hành</MenuItem>
              <MenuItem value="Hội thảo">Hội thảo</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
            sx={{ ml: isSmallScreen ? 0 : 'auto' }}
          >
            Thêm phòng
          </Button>
        </Box>
      </Box>

      {/* Room Matrix Visualization */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        mt: 3
      }}>
        {Object.values(groupedRooms).map(group => (
          <Box key={`${group.building}-${group.floor}`}>
            <Typography variant="body1" sx={{ mb: 2, bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, p: 1, borderRadius: 1 }}>
              Tòa {group.building} - Tầng {group.floor}
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 3
            }}>
              {group.rooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onClick={() => handleRoomClick(room)}
                  onEdit={() => {
                    setSelectedRoom(room);
                    setOpenEditModal(true);
                  }}
                  onDelete={() => handleDeleteRoom(room.id)}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Room Detail Modal */}
      <RoomDetailModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        room={selectedRoom}
      />

      {/* Add Room Modal */}
      <AddRoomModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSave={handleAddRoom}
      />

      {/* Edit Room Modal */}
      <EditRoomModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        room={selectedRoom}
        onSave={handleEditRoom}
      />
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
        backgroundColor: room.status === 'available'
          ? theme.palette.success.main
          : theme.palette.warning.main
      }} />

      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="h6" fontWeight="600">
            {room.name}
          </Typography>
          <Chip
            label={room.status === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
            size="small"
            sx={{
              backgroundColor: room.status === 'available'
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.warning.main, 0.1),
              color: room.status === 'available'
                ? theme.palette.success.dark
                : theme.palette.warning.dark
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {room.building} • {room.type} • {room.capacity} chỗ
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
          {[...Array(Math.min(room.capacity, 30))].map((_, i) => (
            <>
              <Box
                key={i}
                sx={{
                  aspectRatio: '1/1', // Đảm bảo ô vuông
                  borderRadius: '4px',
                  backgroundColor: alpha(
                    room.status === 'available'
                      ? theme.palette.primary.main
                      : theme.palette.warning.main,
                    room.status === 'available' ? 0.2 : 0.1
                  ),
                  border: `1px solid ${alpha(
                    room.status === 'available'
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
                    color: room.status === 'available' ? theme.palette.primary.dark : theme.palette.warning.dark
                  }}>
                    {
                      room.capacity - 30 === 0 ? "" : `+${room.capacity - 30}`
                    }
                  </Typography>
                ) : (
                  // Nếu không phải ô cuối cùng, hiển thị ComputerIcon nếu là phòng thực hành
                  i === 0 && room.type === 'Thực hành' && (
                    <ComputerIcon fontSize="small" sx={{
                      color: alpha(theme.palette.text.secondary, 0.6)
                    }} />
                  )
                )}
              </Box>
            </>
          ))}
        </Box>

        {/* Equipment */}
        <Typography variant="caption" color="text.secondary">
          Thiết bị:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {room.equipment.map((item, index) => (
            <Chip
              key={index}
              label={item}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: '4px',
                backgroundColor: alpha(theme.palette.grey[100], 0.5)
              }}
            />
          ))}
        </Box>

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

// Room Detail Modal Component
const RoomDetailModal = ({ open, onClose, room }) => {
  const theme = useTheme();

  if (!room) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)'
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box sx={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        outline: 'none'
      }}>
        <Paper
          elevation={24}
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}>
            <Typography variant="h5" fontWeight="600">
              Chi tiết phòng học
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                ml: 'auto',
                color: theme.palette.primary.contrastText
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {/* Basic info */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {room.name} ({room.code})
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Tòa {room.building} - Tầng {room.floor}
                  </Typography>
                  <Chip
                    label={room.type}
                    size="medium"
                    sx={{
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.dark,
                      fontWeight: 500,
                      mb: 2
                    }}
                  />
                  <Chip
                    label={room.status === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
                    size="medium"
                    sx={{
                      backgroundColor: room.status === 'available'
                        ? alpha(theme.palette.success.main, 0.1)
                        : alpha(theme.palette.warning.main, 0.1),
                      color: room.status === 'available'
                        ? theme.palette.success.dark
                        : theme.palette.warning.dark,
                      fontWeight: 500,
                      ml: 1
                    }}
                  />
                </Box>

                {/* Details */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  mb: 3
                }}>
                  <DetailItem
                    theme={theme}
                    icon={<RoomIcon />}
                    label="Sức chứa"
                    value={`${room.capacity} chỗ`}
                  />
                  <DetailItem
                    theme={theme}
                    icon={<GroupsIcon />}
                    label="Loại phòng"
                    value={room.type}
                  />
                  <DetailItem
                    theme={theme}
                    icon={<SchoolIcon />}
                    label="Tòa nhà"
                    value={room.building}
                  />
                  <DetailItem
                    theme={theme}
                    icon={<MaintenanceIcon />}
                    label="Tình trạng"
                    value={room.status === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
                    color={room.status === 'available' ? 'success' : 'warning'}
                  />
                </Box>

                {/* Equipment */}
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Thiết bị
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {room.equipment.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="medium"
                      sx={{
                        backgroundColor: alpha(theme.palette.grey[100], 0.5),
                        px: 1.5
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                {/* Room layout */}
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Sơ đồ phòng
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 1.5,
                  p: 2,
                  backgroundColor: alpha(theme.palette.grey[100], 0.3),
                  borderRadius: '12px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                }}>
                  {[...Array(Math.min(room.capacity, 25))].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        aspectRatio: '1/1',
                        borderRadius: '8px',
                        backgroundColor: alpha(
                          room.status === 'available'
                            ? theme.palette.primary.main
                            : theme.palette.warning.main,
                          room.status === 'available' ? 0.15 : 0.08
                        ),
                        border: `1px solid ${alpha(
                          room.status === 'available'
                            ? theme.palette.primary.main
                            : theme.palette.warning.main,
                          0.3
                        )}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: alpha(
                            room.status === 'available'
                              ? theme.palette.primary.main
                              : theme.palette.warning.main,
                            room.status === 'available' ? 0.25 : 0.15
                          )
                        }
                      }}
                    >
                      {i === 0 && room.type === 'Thực hành' && (
                        <ComputerIcon fontSize="small" sx={{
                          color: alpha(theme.palette.text.secondary, 0.7)
                        }} />
                      )}
                    </Box>
                  ))}
                </Box>
                {room.capacity > 25 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Và {room.capacity - 25} chỗ ngồi khác...
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value, color, theme }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: '8px',
      backgroundColor: alpha('#000000', 0.05),
      mr: 1.5,
      color: color ? theme.palette[color].main : 'text.secondary'
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight="500">
        {value}
      </Typography>
    </Box>
  </Box>
);

export default RoomManagement;