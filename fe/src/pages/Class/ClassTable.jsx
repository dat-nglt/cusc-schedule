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

const ClassTable = ({ displayedClasses, isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen, handleViewClass, handleEditClass, handleDeleteClass }) => {
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
  const sortedDisplayedClasses = [...displayedClasses].sort((a, b) => {
    if (orderBy === 'stt' || orderBy === 'siSoLop') {
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
  });

  return (
    <Table sx={{ minWidth: '100%', border: '1px solid #e0e0e0', tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          {/* Cột STT - Luôn hiển thị */}
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
          {/* Cột Mã lớp học - Luôn hiển thị */}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '30%' : isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%' }}>
            <TableSortLabel
              active={orderBy === 'maLopHoc'}
              direction={orderBy === 'maLopHoc' ? order : 'asc'}
              onClick={() => handleSort('maLopHoc')}
              IconComponent={ArrowDropDown}
            >
              Mã lớp học
            </TableSortLabel>
          </TableCell>
          {/* Cột Mã học viên - Hiển thị khi >= 1200px */}
          {!isMediumScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isLargeScreen ? '20%' : '15%' }}>
              <TableSortLabel
                active={orderBy === 'maHocVien'}
                direction={orderBy === 'maHocVien' ? order : 'asc'}
                onClick={() => handleSort('maHocVien')}
                IconComponent={ArrowDropDown}
              >
                Mã học viên
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Mã khóa học - Hiển thị khi > 1400px */}
          {!isLargeScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '15%' }}>
              <TableSortLabel
                active={orderBy === 'maKhoaHoc'}
                direction={orderBy === 'maKhoaHoc' ? order : 'asc'}
                onClick={() => handleSort('maKhoaHoc')}
                IconComponent={ArrowDropDown}
              >
                Mã khóa học
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Sĩ số lớp - Hiển thị khi >= 900px */}
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%' }}>
              <TableSortLabel
                active={orderBy === 'siSoLop'}
                direction={orderBy === 'siSoLop' ? order : 'asc'}
                onClick={() => handleSort('siSoLop')}
                IconComponent={ArrowDropDown}
              >
                Sĩ số lớp
              </TableSortLabel>
            </TableCell>
          )}
          {/* Cột Thao tác - Luôn hiển thị */}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '30%' : isMediumScreen ? '25%' : isLargeScreen ? '20%' : '10%' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedDisplayedClasses.map((cls, index) => (
          <TableRow
            key={cls.id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            {/* Cột STT - Luôn hiển thị */}
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '10%' }}>
              {cls.stt}
            </TableCell>
            {/* Cột Mã lớp học - Luôn hiển thị */}
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: isSmallScreen ? '30%' : isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%' }}>
              {cls.maLopHoc}
            </TableCell>
            {/* Cột Mã học viên - Hiển thị khi >= 1200px */}
            {!isMediumScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: isLargeScreen ? '20%' : '15%' }}>
                {cls.maHocVien}
              </TableCell>
            )}
            {/* Cột Mã khóa học - Hiển thị khi > 1400px */}
            {!isLargeScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
                {cls.maKhoaHoc}
              </TableCell>
            )}
            {/* Cột Sĩ số lớp - Hiển thị khi >= 900px */}
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%' }}>
                {cls.siSoLop}
              </TableCell>
            )}
            {/* Cột Thao tác - Luôn hiển thị */}
            <TableCell sx={{ textAlign: 'center', py: 1.5, width: isSmallScreen ? '30%' : isMediumScreen ? '25%' : isLargeScreen ? '20%' : '10%' }}>
              {isExtraSmallScreen ? (
                <>
                  <Tooltip title="Thao tác">
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, cls.id)}
                      sx={{ color: '#1976d2' }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedRowId === cls.id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleViewClass(cls.id);
                        handleCloseMenu();
                      }}
                    >
                      <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                      Xem
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleEditClass(cls.id);
                        handleCloseMenu();
                      }}
                    >
                      <Edit sx={{ mr: 1, color: '#1976d2' }} />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteClass(cls.id);
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
                      onClick={() => handleViewClass(cls.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Edit
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClass(cls.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Delete
                      color="error"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteClass(cls.id)}
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

export default ClassTable;