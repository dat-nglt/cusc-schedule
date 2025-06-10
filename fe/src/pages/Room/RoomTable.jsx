import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import { Visibility, Edit, Delete, Menu as MenuIcon, ArrowDropDown } from '@mui/icons-material';

const RoomTable = ({ displayedRooms, isExtraSmallScreen, isSmallScreen, isMediumScreen, handleViewRoom, handleEditRoom, handleDeleteRoom }) => {
  // State để quản lý menu và sắp xếp
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [orderBy, setOrderBy] = useState('stt');
  const [order, setOrder] = useState('asc');

  // Hàm mở menu
  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  // Hàm đóng menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sắp xếp dữ liệu
  const sortedDisplayedRooms = [...displayedRooms].sort((a, b) => {
    if (orderBy === 'stt' || orderBy === 'tang' || orderBy === 'sucChua') {
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
  });

  return (
    <Table sx={{ minWidth: '100%', border: '1px solid #e0e0e0', tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          {/* Cột STT - Giữ nguyên 10% */}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '10%' }}>
            <TableSortLabel
              active={orderBy === 'stt'}
              direction={orderBy === 'stt' ? order : 'asc'}
              onClick={() => handleSort('stt')}
              IconComponent={ArrowDropDown}
            >
              STT
            </TableSortLabel>
          </TableCell>
          {/* Cột Mã phòng - Giữ nguyên 12%, Ẩn dưới 1200px */}
          {!isMediumScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12%' }}>
              <TableSortLabel
                active={orderBy === 'maPhongHoc'}
                direction={orderBy === 'maPhongHoc' ? order : 'asc'}
                onClick={() => handleSort('maPhongHoc')}
                IconComponent={ArrowDropDown}
              >
                Mã phòng
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Tên phòng - Giảm xuống 15%, căn giữa */}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '15%' }}>
            <TableSortLabel
              active={orderBy === 'tenPhongHoc'}
              direction={orderBy === 'tenPhongHoc' ? order : 'asc'}
              onClick={() => handleSort('tenPhongHoc')}
              IconComponent={ArrowDropDown}
            >
              Tên phòng
            </TableSortLabel>
          </TableCell>
          {/* Cột Tòa nhà - Tăng lên 13%, Ẩn dưới 900px */}
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '13%' }}>
              <TableSortLabel
                active={orderBy === 'toaNha'}
                direction={orderBy === 'toaNha' ? order : 'asc'}
                onClick={() => handleSort('toaNha')}
                IconComponent={ArrowDropDown}
              >
                Tòa nhà
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Tầng - Giữ nguyên 8%, Ẩn dưới 900px */}
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '8%' }}>
              <TableSortLabel
                active={orderBy === 'tang'}
                direction={orderBy === 'tang' ? order : 'asc'}
                onClick={() => handleSort('tang')}
                IconComponent={ArrowDropDown}
              >
                Tầng
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Sức chứa - Giữ nguyên 12%, Ẩn dưới 1200px */}
          {!isMediumScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12%' }}>
              <TableSortLabel
                active={orderBy === 'sucChua'}
                direction={orderBy === 'sucChua' ? order : 'asc'}
                onClick={() => handleSort('sucChua')}
                IconComponent={ArrowDropDown}
              >
                Sức chứa
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Loại phòng - Giữ nguyên 15% */}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '15%' }}>
            <TableSortLabel
              active={orderBy === 'loaiPhongHoc'}
              direction={orderBy === 'loaiPhongHoc' ? order : 'asc'}
              onClick={() => handleSort('loaiPhongHoc')}
              IconComponent={ArrowDropDown}
            >
              Loại phòng
            </TableSortLabel>
          </TableCell>
          {/* Cột Trạng thái - Tăng lên 13%, Ẩn dưới 700px */}
          {!isExtraSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '13%' }}>
              <TableSortLabel
                active={orderBy === 'trangThai'}
                direction={orderBy === 'trangThai' ? order : 'asc'}
                onClick={() => handleSort('trangThai')}
                IconComponent={ArrowDropDown}
              >
                Trạng thái
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Thao tác - Giữ nguyên 10% */}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: '10%' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedDisplayedRooms.map((room, index) => (
          <TableRow
            key={room.id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            {/* Cột STT - Giữ nguyên 10% */}
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '10%' }}>
              {room.stt}
            </TableCell>
            {/* Cột Mã phòng - Giữ nguyên 12%, Ẩn dưới 1200px */}
            {!isMediumScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12%' }}>
                {room.maPhongHoc}
              </TableCell>
            )}
            {/* Cột Tên phòng - Giảm xuống 15%, căn giữa */}
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
              {room.tenPhongHoc}
            </TableCell>
            {/* Cột Tòa nhà - Tăng lên 13%, Ẩn dưới 900px */}
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '13%' }}>
                {room.toaNha}
              </TableCell>
            )}
            {/* Cột Tầng - Giữ nguyên 8%, Ẩn dưới 900px */}
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '8%' }}>
                {room.tang}
              </TableCell>
            )}
            {/* Cột Sức chứa - Giữ nguyên 12%, Ẩn dưới 1200px */}
            {!isMediumScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12%' }}>
                {room.sucChua}
              </TableCell>
            )}
            {/* Cột Loại phòng - Giữ nguyên 15% */}
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
              {room.loaiPhongHoc}
            </TableCell>
            {/* Cột Trạng thái - Tăng lên 13%, Ẩn dưới 700px */}
            {!isExtraSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '13%' }}>
                {room.trangThai}
              </TableCell>
            )}
            {/* Cột Thao tác - Giữ nguyên 10% */}
            <TableCell sx={{ textAlign: 'center', py: 1.5, width: '10%' }}>
              {isExtraSmallScreen ? (
                <>
                  <Tooltip title="Thao tác">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, room.id)}
                      sx={{ color: '#1976d2' }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRowId === room.id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleViewRoom(room.id);
                        handleCloseMenu();
                      }}
                    >
                      <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                      Xem
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleEditRoom(room.id);
                        handleCloseMenu();
                      }}
                    >
                      <Edit sx={{ mr: 1, color: '#1976d2' }} />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteRoom(room.id);
                        handleCloseMenu();
                      }}
                    >
                      <Delete sx={{ mr: 1, color: '#d32f2f' }} />
                      Xóa
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="Xem">
                    <Visibility
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleViewRoom(room.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Edit
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditRoom(room.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Delete
                      color="error"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteRoom(room.id)}
                    />
                  </Tooltip>
                </Box>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RoomTable;