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
  Chip,
} from '@mui/material';
import { Visibility, Edit, Delete, Menu as MenuIcon, ArrowDropDown } from '@mui/icons-material';

const NotificationTable = ({
  displayedNotifications,
  isExtraSmallScreen,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  handleViewNotification,
  handleEditNotification,
  handleDeleteNotification,
}) => {
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

  // Hàm hiển thị mức độ ưu tiên với màu sắc
  const getPriorityChip = (priority) => {
    const priorityColors = {
      'Cao': { color: '#d32f2f', bgcolor: '#ffebee' }, // Đỏ
      'Trung bình': { color: '#f57c00', bgcolor: '#fff3e0' }, // Cam
      'Thấp': { color: '#4caf50', bgcolor: '#e8f5e8' }, // Xanh
    };
    const style = priorityColors[priority] || { color: '#757575', bgcolor: '#f5f5f5' };

    return (
      <Chip
        label={priority}
        size="small"
        sx={{
          color: style.color,
          bgcolor: style.bgcolor,
          fontWeight: 'bold',
          fontSize: '0.75rem',
        }}
      />
    );
  };

  // Hàm xử lý sắp xếp
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sắp xếp dữ liệu
  const sortedDisplayedNotifications = [...displayedNotifications].sort((a, b) => {
    if (orderBy === 'stt') {
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return order === 'asc'
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  return (
    <Table sx={{ minWidth: '100%', border: '1px solid #e0e0e0', tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          {/* Cột STT - Luôn hiển thị */}
          <TableCell
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: '#333',
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              width: '10%',
            }}
          >
            <TableSortLabel
              active={orderBy === 'stt'}
              direction={orderBy === 'stt' ? order : 'asc'}
              onClick={() => handleSort('stt')}
              IconComponent={ArrowDropDown}
            >
              STT
            </TableSortLabel>
          </TableCell>
          {/* Cột Mã thông báo - Hiển thị khi >= 1400px */}
          {!isLargeScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: '12%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'maThongBao'}
                direction={orderBy === 'maThongBao' ? order : 'asc'}
                onClick={() => handleSort('maThongBao')}
                IconComponent={ArrowDropDown}
              >
                Mã thông báo
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Tiêu đề nội dung - Luôn hiển thị */}
          <TableCell
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: '#333',
              textAlign: 'left',
              borderRight: '1px solid #e0e0e0',
              width: isSmallScreen ? '25%' : isMediumScreen ? '20%' : '15%',
            }}
          >
            <TableSortLabel
              active={orderBy === 'tieuDeNoiDung'}
              direction={orderBy === 'tieuDeNoiDung' ? order : 'asc'}
              onClick={() => handleSort('tieuDeNoiDung')}
              IconComponent={ArrowDropDown}
            >
              Tiêu đề nội dung
            </TableSortLabel>
          </TableCell>
          {/* Cột Loại thông báo - Hiển thị khi >= 900px */}
          {!isSmallScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: isMediumScreen ? '25%' : '15%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'loaiThongBao'}
                direction={orderBy === 'loaiThongBao' ? order : 'asc'}
                onClick={() => handleSort('loaiThongBao')}
                IconComponent={ArrowDropDown}
              >
                Loại thông báo
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Mức độ ưu tiên - Hiển thị khi >= 900px */}
          {!isSmallScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: isMediumScreen ? '25%' : '15%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'mucDoUuTien'}
                direction={orderBy === 'mucDoUuTien' ? order : 'asc'}
                onClick={() => handleSort('mucDoUuTien')}
                IconComponent={ArrowDropDown}
              >
                Mức độ ưu tiên
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Kênh gửi - Hiển thị khi >= 1400px */}
          {!isLargeScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: '12%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'kenhGui'}
                direction={orderBy === 'kenhGui' ? order : 'asc'}
                onClick={() => handleSort('kenhGui')}
                IconComponent={ArrowDropDown}
              >
                Kênh gửi
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Thao tác - Luôn hiển thị */}
          <TableCell
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: '#333',
              textAlign: 'center',
              width: isSmallScreen ? '25%' : isMediumScreen ? '20%' : '10%',
            }}
          >
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedDisplayedNotifications.map((notification, index) => (
          <TableRow
            key={notification.id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            {/* Cột STT - Luôn hiển thị */}
            <TableCell
              sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '10%' }}
            >
              {notification.stt}
            </TableCell>
            {/* Cột Mã thông báo - Hiển thị khi >= 1400px */}
            {!isLargeScreen && (
              <TableCell
                sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12%' }}
              >
                {notification.maThongBao}
              </TableCell>
            )}
            {/* Cột Tiêu đề nội dung - Luôn hiển thị */}
            <TableCell
              sx={{
                textAlign: 'left',
                borderRight: '1px solid #e0e0e0',
                py: 1.5,
                width: isSmallScreen ? '25%' : isMediumScreen ? '20%' : '15%',
              }}
            >
              {notification.tieuDeNoiDung}
            </TableCell>
            {/* Cột Loại thông báo - Hiển thị khi >= 900px */}
            {!isSmallScreen && (
              <TableCell
                sx={{
                  textAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  py: 1.5,
                  width: isMediumScreen ? '25%' : '15%',
                }}
              >
                {notification.loaiThongBao}
              </TableCell>
            )}
            {/* Cột Mức độ ưu tiên - Hiển thị khi >= 900px */}
            {!isSmallScreen && (
              <TableCell
                sx={{
                  textAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  py: 1.5,
                  width: isMediumScreen ? '25%' : '15%',
                }}
              >
                {getPriorityChip(notification.mucDoUuTien)}
              </TableCell>
            )}
            {/* Cột Kênh gửi - Hiển thị khi >= 1400px */}
            {!isLargeScreen && (
              <TableCell
                sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12%' }}
              >
                {notification.kenhGui}
              </TableCell>
            )}
            {/* Cột Thao tác - Luôn hiển thị */}
            <TableCell
              sx={{
                textAlign: 'center',
                py: 1.5,
                width: isSmallScreen ? '25%' : isMediumScreen ? '20%' : '10%',
              }}
            >
              {isExtraSmallScreen ? (
                <>
                  <Tooltip title="Thao tác">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, notification.id)}
                      sx={{ color: '#1976d2' }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRowId === notification.id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleViewNotification(notification.id);
                        handleCloseMenu();
                      }}
                    >
                      <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                      Xem
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleEditNotification(notification.id);
                        handleCloseMenu();
                      }}
                    >
                      <Edit sx={{ mr: 1, color: '#1976d2' }} />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteNotification(notification);
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
                      onClick={() => handleViewNotification(notification.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Edit
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditNotification(notification.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Delete
                      color="error"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteNotification(notification)}
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

export default NotificationTable;