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
  Chip,
} from '@mui/material';
import { Visibility, Edit, Delete, Menu as MenuIcon } from '@mui/icons-material';

const SlotTimeTable = ({ displayedSlotTimes, isExtraSmallScreen, isSmallScreen, isMediumScreen, handleViewSlotTime, handleEditSlotTime, handleDeleteSlotTime }) => {
  // State để quản lý menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

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

  // Hàm hiển thị buổi học với màu sắc
  const getSessionChip = (session) => {
    const sessionColors = {
      'Sáng': { color: '#4caf50', bgcolor: '#e8f5e8' },
      'Chiều': { color: '#f57c00', bgcolor: '#fff3e0' },
      'Tối': { color: '#2196f3', bgcolor: '#e3f2fd' },
    };
    const style = sessionColors[session] || { color: '#757575', bgcolor: '#f5f5f5' };

    return (
      <Chip
        label={session}
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

  return (
    <Table sx={{ width: '100%', border: '1px solid #e0e0e0', tableLayout: 'auto' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
            STT
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
            Mã khung giờ
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
            Tên khung giờ
          </TableCell>
          {!isSmallScreen && (
            <>
              {!isMediumScreen && (
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                  Buổi học
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian bắt đầu
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian kết thúc
              </TableCell>
            </>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {displayedSlotTimes.map((slotTime, index) => (
          <TableRow
            key={slotTime.id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {slotTime.stt}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {slotTime.maKhungGio}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {slotTime.tenKhungGio}
            </TableCell>
            {!isSmallScreen && (
              <>
                {!isMediumScreen && (
                  <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                    {getSessionChip(slotTime.buoiHoc)}
                  </TableCell>
                )}
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {slotTime.thoiGianBatDau}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {slotTime.thoiGianKetThuc}
                </TableCell>
              </>
            )}
            <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
              {isExtraSmallScreen ? (
                <>
                  <Tooltip title="Thao tác">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, slotTime.id)}
                      sx={{ color: '#1976d2' }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRowId === slotTime.id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleViewSlotTime(slotTime.id);
                        handleCloseMenu();
                      }}
                    >
                      <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                      Xem
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleEditSlotTime(slotTime.id);
                        handleCloseMenu();
                      }}
                    >
                      <Edit sx={{ mr: 1, color: '#1976d2' }} />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteSlotTime(slotTime.id);
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
                      onClick={() => handleViewSlotTime(slotTime.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Edit
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditSlotTime(slotTime.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Delete
                      color="error"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteSlotTime(slotTime.id)}
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

export default SlotTimeTable;