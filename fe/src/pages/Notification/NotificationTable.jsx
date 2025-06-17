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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [orderBy, setOrderBy] = useState('stt');
  const [order, setOrder] = useState('asc');

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedDisplayedNotifications = [...displayedNotifications].sort((a, b) => {
    if (orderBy === 'stt') {
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
  });

  return (
    <Table sx={{ minWidth: '100%', border: '1px solid #e0e0e0', tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
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
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '25%' : '15%' }}>
            <TableSortLabel
              active={orderBy === 'maThongBao'}
              direction={orderBy === 'maThongBao' ? order : 'asc'}
              onClick={() => handleSort('maThongBao')}
              IconComponent={ArrowDropDown}
            >
              Mã thông báo
            </TableSortLabel>
          </TableCell>
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '20%' }}>
              <TableSortLabel
                active={orderBy === 'tieuDe'}
                direction={orderBy === 'tieuDe' ? order : 'asc'}
                onClick={() => handleSort('tieuDe')}
                IconComponent={ArrowDropDown}
              >
                Tiêu đề
              </TableSortLabel>
            </TableCell>
          )}
          {!isMediumScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '25%' }}>
              <TableSortLabel
                active={orderBy === 'noiDung'}
                direction={orderBy === 'noiDung' ? order : 'asc'}
                onClick={() => handleSort('noiDung')}
                IconComponent={ArrowDropDown}
              >
                Nội dung
              </TableSortLabel>
            </TableCell>
          )}
          {!isLargeScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '15%' }}>
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
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '15%' }}>
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
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '15%' }}>
            <TableSortLabel
              active={orderBy === 'kenhGui'}
              direction={orderBy === 'kenhGui' ? order : 'asc'}
              onClick={() => handleSort('kenhGui')}
              IconComponent={ArrowDropDown}
            >
              Kênh gửi
            </TableSortLabel>
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '25%' : '10%' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedDisplayedNotifications.map((notif, index) => (
          <TableRow
            key={notif.id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '10%' }}>
              {notif.stt}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: isSmallScreen ? '25%' : '15%' }}>
              {notif.maThongBao}
            </TableCell>
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '20%' }}>
                {notif.tieuDe}
              </TableCell>
            )}
            {!isMediumScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '25%' }}>
                {notif.noiDung}
              </TableCell>
            )}
            {!isLargeScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
                {notif.loaiThongBao}
              </TableCell>
            )}
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
                {notif.mucDoUuTien}
              </TableCell>
            )}
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
              {notif.kenhGui}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', py: 1.5, width: isSmallScreen ? '25%' : '10%' }}>
              {isExtraSmallScreen ? (
                <>
                  <Tooltip title="Thao tác">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, notif.id)}
                      sx={{ color: '#1976d2' }}
                      aria-label="Mở menu thao tác"
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRowId === notif.id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleViewNotification(notif.id);
                        handleCloseMenu();
                      }}
                    >
                      <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                      Xem
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleEditNotification(notif.id);
                        handleCloseMenu();
                      }}
                    >
                      <Edit sx={{ mr: 1, color: '#1976d2' }} />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteNotification(notif.id);
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
                      onClick={() => handleViewNotification(notif.id)}
                      aria-label="Xem thông báo"
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Edit
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditNotification(notif.id)}
                      aria-label="Chỉnh sửa thông báo"
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Delete
                      color="error"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteNotification(notif.id)}
                      aria-label="Xóa thông báo"
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