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
import {
  Visibility,
  Edit,
  Delete,
  Menu as MenuIcon,
  ArrowDropDown,
} from '@mui/icons-material';

const ClassSectionTable = ({
  displayedClassSectiones,
  isExtraSmallScreen,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  handleViewClassSection,
  handleEditClassSection,
  handleDeleteClassSection,
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

  const sortedDisplayedClassSectiones = [...displayedClassSectiones].sort((a, b) => {
    if (orderBy === 'stt' || orderBy === 'siSoToiDa') {
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
    return order === 'asc'
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  return (
    <Table
      sx={{
        minWidth: '100%',
        border: '1px solid #e0e0e0',
        tableLayout: 'fixed',
      }}
    >
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          {/* Cột STT */}
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

          {/* Cột Mã lớp học phần */}
          <TableCell
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: '#333',
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              width: isSmallScreen
                ? '30%'
                : isMediumScreen
                ? '25%'
                : isLargeScreen
                ? '20%'
                : '15%',
            }}
          >
            <TableSortLabel
              active={orderBy === 'maLopHocPhan'}
              direction={orderBy === 'maLopHocPhan' ? order : 'asc'}
              onClick={() => handleSort('maLopHocPhan')}
              IconComponent={ArrowDropDown}
            >
              Mã lớp học phần
            </TableSortLabel>
          </TableCell>

          {/* Cột Mã lớp học */}
          {!isMediumScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: isLargeScreen ? '20%' : '15%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'maLopHoc'}
                direction={orderBy === 'maLopHoc' ? order : 'asc'}
                onClick={() => handleSort('maLopHoc')}
                IconComponent={ArrowDropDown}
              >
                Mã lớp học
              </TableSortLabel>
            </TableCell>
          )}

          {/* Cột Mã học phần */}
          {!isLargeScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: '15%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'maHocPhan'}
                direction={orderBy === 'maHocPhan' ? order : 'asc'}
                onClick={() => handleSort('maHocPhan')}
                IconComponent={ArrowDropDown}
              >
                Mã học phần
              </TableSortLabel>
            </TableCell>
          )}

          {/* Cột Tên lớp học phần */}
          {!isSmallScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'tenLopHocPhan'}
                direction={orderBy === 'tenLopHocPhan' ? order : 'asc'}
                onClick={() => handleSort('tenLopHocPhan')}
                IconComponent={ArrowDropDown}
              >
                Tên lớp học phần
              </TableSortLabel>
            </TableCell>
          )}

          {/* Cột Sĩ số tối đa */}
          {!isSmallScreen && (
            <TableCell
              sx={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#333',
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%',
              }}
            >
              <TableSortLabel
                active={orderBy === 'siSoToiDa'}
                direction={orderBy === 'siSoToiDa' ? order : 'asc'}
                onClick={() => handleSort('siSoToiDa')}
                IconComponent={ArrowDropDown}
              >
                Sĩ số tối đa
              </TableSortLabel>
            </TableCell>
          )}

          {/* Cột Thao tác */}
          <TableCell
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              color: '#333',
              textAlign: 'center',
              width: isSmallScreen
                ? '30%'
                : isMediumScreen
                ? '25%'
                : isLargeScreen
                ? '20%'
                : '10%',
            }}
          >
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {sortedDisplayedClassSectiones.map((cls, index) => (
          <TableRow
            key={cls.id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell
              sx={{
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                py: 1.5,
                width: '10%',
              }}
            >
              {cls.stt}
            </TableCell>
            <TableCell
              sx={{
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                py: 1.5,
                width: isSmallScreen
                  ? '30%'
                  : isMediumScreen
                  ? '25%'
                  : isLargeScreen
                  ? '20%'
                  : '15%',
              }}
            >
              {cls.maLopHocPhan}
            </TableCell>
            {!isMediumScreen && (
              <TableCell
                sx={{
                  textAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  py: 1.5,
                  width: isLargeScreen ? '20%' : '15%',
                }}
              >
                {cls.maLopHoc}
              </TableCell>
            )}
            {!isLargeScreen && (
              <TableCell
                sx={{
                  textAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  py: 1.5,
                  width: '15%',
                }}
              >
                {cls.maHocPhan}
              </TableCell>
            )}
            {!isSmallScreen && (
              <TableCell
                sx={{
                  textAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  py: 1.5,
                  width: isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%',
                }}
              >
                {cls.tenLopHocPhan}
              </TableCell>
            )}
            {!isSmallScreen && (
              <TableCell
                sx={{
                  textAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  py: 1.5,
                  width: isMediumScreen ? '25%' : isLargeScreen ? '20%' : '15%',
                }}
              >
                {cls.siSoToiDa}
              </TableCell>
            )}
            <TableCell
              sx={{
                textAlign: 'center',
                py: 1.5,
                width: isSmallScreen
                  ? '30%'
                  : isMediumScreen
                  ? '25%'
                  : isLargeScreen
                  ? '20%'
                  : '10%',
              }}
            >
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
                        handleViewClassSection(cls.id);
                        handleCloseMenu();
                      }}
                    >
                      <Visibility sx={{ mr: 1, color: '#1976d2' }} />
                      Xem
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleEditClassSection(cls.id);
                        handleCloseMenu();
                      }}
                    >
                      <Edit sx={{ mr: 1, color: '#1976d2' }} />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteClassSection(cls.id);
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
                      onClick={() => handleViewClassSection(cls.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <Edit
                      color="primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEditClassSection(cls.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Delete
                      color="error"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteClassSection(cls.id)}
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

export default ClassSectionTable;
