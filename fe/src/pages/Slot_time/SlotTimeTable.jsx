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
import { getStatusChip } from '../../components/ui/StatusChip';

export default function SlotTimeTable({ displayedSlotTimes, isSmallScreen, isMediumScreen, handleViewSlotTime, handleEditSlotTime, handleDeleteSlotTime }) {
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
  const getTypeChip = (type) => {
    const typeColors = {
      'sáng': { color: '#4caf50', bgcolor: '#e8f5e8' },
      'Sáng': { color: '#4caf50', bgcolor: '#e8f5e8' },
      'chiều': { color: '#f57c00', bgcolor: '#fff3e0' },
      'Chiều': { color: '#f57c00', bgcolor: '#fff3e0' },
      'tối': { color: '#2196f3', bgcolor: '#e3f2fd' },
      'Tối': { color: '#2196f3', bgcolor: '#e3f2fd' },
    };
    const style = typeColors[type] || { color: '#757575', bgcolor: '#f5f5f5' };

    return (
      <Chip
        label={type}
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
    <Table
      sx={{
        minWidth: isSmallScreen ? 300 : isMediumScreen ? 500 : 650,
        border: '1px solid #e0e0e0',
        width: '100%',
        tableLayout: 'fixed',
      }}
    >
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '8%' }}>
            STT
          </TableCell>
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12%' }}>
              Mã khung giờ
            </TableCell>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '40%' : '35%' }}>
            Tên khung giờ
          </TableCell>
          {!isMediumScreen && (
            <>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12%' }}>
                Buổi học
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '20%' }}>
                Thời gian
              </TableCell>
            </>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '25%' : '13%' }}>
            Trạng thái
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '27%' : '10%' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {displayedSlotTimes.map((slotTime, index) => (
          <TableRow
            key={slotTime.slot_id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {index + 1}
            </TableCell>
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                {slotTime.slot_id}
              </TableCell>
            )}
            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {slotTime.slot_name}
            </TableCell>
            {!isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {getTypeChip(slotTime.type)}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  <Chip
                    label={`${slotTime.start_time.slice(0, 5)} - ${slotTime.end_time.slice(0, 5)}`}
                    size="small"
                    sx={{
                      bgcolor: '#f3e5f5',
                      color: '#7b1fa2',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>
              </>
            )}
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {getStatusChip(slotTime.status)}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
              {isSmallScreen ? (
                <>
                  <Tooltip title="Thao tác">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, slotTime.slot_id)}
                      sx={{ color: '#1976d2' }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRowId === slotTime.slot_id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleViewSlotTime(slotTime.slot_id);
                        handleCloseMenu();
                      }}
                    >
                      <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                      Xem
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleEditSlotTime(slotTime.slot_id);
                        handleCloseMenu();
                      }}
                    >
                      <Edit sx={{ mr: 1, color: '#1976d2' }} />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteSlotTime(slotTime.slot_id);
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
                      onClick={() => handleViewSlotTime(slotTime.slot_id)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Edit
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditSlotTime(slotTime.slot_id)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Delete
                      color="error"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteSlotTime(slotTime.slot_id)}
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
}