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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Visibility, Edit, Delete, MoreVert } from '@mui/icons-material';

const CourseTable = ({
  displayedCourses,
  handleViewCourse,
  handleEditCourse,
  handleDeleteCourse
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table
        sx={{
          minWidth: 650,
          border: '1px solid #e0e0e0',
          tableLayout: 'fixed',
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              width: '8%',
              py: 1.5
            }}>
              STT
            </TableCell>
            <TableCell sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              width: '15%',
              display: isSmallScreen ? 'none' : 'table-cell',
              py: 1.5
            }}>
              Mã khóa học
            </TableCell>
            <TableCell sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              width: isSmallScreen ? '40%' : '25%',
              py: 1.5
            }}>
              Tên khóa học
            </TableCell>
            <TableCell sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              width: '15%',
              display: isSmallScreen ? 'none' : 'table-cell',
              py: 1.5
            }}>
              Bắt đầu
            </TableCell>
            <TableCell sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              width: '15%',
              display: isSmallScreen ? 'none' : 'table-cell',
              py: 1.5
            }}>
              Kết thúc
            </TableCell>
            <TableCell sx={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textAlign: 'center',
              width: '10%',
              py: 1.5
            }}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedCourses.map((course, index) => (
            <TableRow
              key={course.course_id}
              sx={{
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                '&:hover': { backgroundColor: '#f1f8ff' },
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <TableCell sx={{
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                py: 1.5
              }}>
                {index + 1}
              </TableCell>
              <TableCell sx={{
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                py: 1.5,
                display: isSmallScreen ? 'none' : 'table-cell'
              }}>
                {course.course_id}
              </TableCell>
              <TableCell sx={{
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                py: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {course.course_name}
              </TableCell>
              <TableCell sx={{
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                py: 1.5,
                display: isSmallScreen ? 'none' : 'table-cell'
              }}>
                {course.start_date}
              </TableCell>
              <TableCell sx={{
                textAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                py: 1.5,
                display: isSmallScreen ? 'none' : 'table-cell'
              }}>
                {course.end_date}
              </TableCell>
              <TableCell sx={{
                textAlign: 'center',
                py: 1.5
              }}>
                <Tooltip title="Thao tác">
                  <IconButton
                    size="small"
                    onClick={(event) => handleOpenMenu(event, course.course_id)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedRowId === course.course_id}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleViewCourse(course.course_id);
                      handleCloseMenu();
                    }}
                    sx={{ py: 1 }}
                  >
                    <Visibility sx={{ mr: 1.5, fontSize: '20px', color: 'info.main' }} />
                    Xem chi tiết
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleEditCourse(course);
                      handleCloseMenu();
                    }}
                    sx={{ py: 1 }}
                  >
                    <Edit sx={{ mr: 1.5, fontSize: '20px', color: 'primary.main' }} />
                    Chỉnh sửa
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleDeleteCourse(course);
                      handleCloseMenu();
                    }}
                    sx={{ py: 1 }}
                  >
                    <Delete sx={{ mr: 1.5, fontSize: '20px', color: 'error.main' }} />
                    Xóa
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default CourseTable;