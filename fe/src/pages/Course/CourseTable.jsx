// src/pages/Course/CourseTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Tooltip,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

const CourseTable = ({ displayedCourses, isSmallScreen, isMediumScreen, handleViewCourse, handleEditCourse, handleDeleteCourse }) => {
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
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '10%' }}>
            STT
          </TableCell>
          {!isSmallScreen && (
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '15%' }}>
              Mã khóa học
            </TableCell>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '60%' : '20%' }}>
            Tên khóa học
          </TableCell>
          {!isSmallScreen && isMediumScreen && (
            <>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '25%' }}>
                Thời gian bắt đầu
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '30%' }}>
                Thời gian cập nhật
              </TableCell>
            </>
          )}
          {!isMediumScreen && (
            <>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12.5%' }}>
                Thời gian bắt đầu
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12.5%' }}>
                Thời gian kết thúc
              </TableCell>
            </>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '30%' : '10%' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {displayedCourses.map((course, index) => (
          <TableRow
            key={course.courseid}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '10%' }}>
              {course.stt}
            </TableCell>
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
                {course.courseid}
              </TableCell>
            )}
            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5, width: isSmallScreen ? '60%' : '20%' }}>
              {course.coursename}
            </TableCell>
            {!isSmallScreen && isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '25%' }}>
                  {course.startdate}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '30%' }}>
                  {course.updated_at}
                </TableCell>
              </>
            )}
            {!isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12.5%' }}>
                  {course.startdate}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12.5%' }}>
                  {course.enddate}
                </TableCell>
              </>
            )}
            <TableCell sx={{ textAlign: 'center', py: 1.5, width: isSmallScreen ? '30%' : '10%' }}>
              <Tooltip title="Xem">
                <Visibility
                  color="primary"
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => handleViewCourse(course.courseid)}
                />
              </Tooltip>
              <Tooltip title="Sửa">
                <Edit
                  color="primary"
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => handleEditCourse(course)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Delete
                  color="error"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    console.log('Delete button clicked for course:', course); // Debug
                    handleDeleteCourse(course);
                  }}
                />
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CourseTable;