
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

const CourseTable = ({ displayedCourses, isSmallScreen, isMediumScreen, handleViewCourse, handleEditCourse, handleDeleteCourse }) => {
  return (
    <Table sx={{ minWidth: isSmallScreen ? 300 : isMediumScreen ? 500 : 650, border: '1px solid #e0e0e0' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
            STT
          </TableCell>
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0' }}>
              Tên khóa học
            </TableCell>
          )}
          {isSmallScreen ? (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0' }}>
              Tên
            </TableCell>
          ) : null}
          {!isSmallScreen && isMediumScreen && (
            <>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian bắt đầu
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian cập nhật
              </TableCell>
            </>
          )}
          {!isMediumScreen && (
            <>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Mã khóa học
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0' }}>
                Tên khóa học
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian bắt đầu
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian kết thúc
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian tạo
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                Thời gian cập nhật
              </TableCell>
            </>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {displayedCourses.map((course, index) => (
          <TableRow
            key={course.id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {course.stt}
            </TableCell>
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                {course.tenKhoaHoc}
              </TableCell>
            )}
            {isSmallScreen && (
              <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                {course.tenKhoaHoc}
              </TableCell>
            )}
            {!isSmallScreen && isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.thoiGianBatDau}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.thoiGianCapNhat}
                </TableCell>
              </>
            )}
            {!isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.maKhoaHoc}
                </TableCell>
                <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.tenKhoaHoc}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.thoiGianBatDau}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.thoiGianKetThuc}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.thoiGianTao}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {course.thoiGianCapNhat}
                </TableCell>
              </>
            )}
            <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Visibility
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleViewCourse(course.id)}
                />
                <Edit
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEditCourse(course.id)}
                />
                <Delete
                  color="error"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteCourse(course.id)}
                />
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CourseTable;