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

const ClassTable = ({ displayedClasses, isSmallScreen, isMediumScreen, handleViewClass, handleEditClass, handleDeleteClass }) => {
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
              Mã lớp học
            </TableCell>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '60%' : '20%' }}>
            Tên lớp học
          </TableCell>
          {!isSmallScreen && isMediumScreen && (
            <>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '25%' }}>
                Sĩ số
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '30%' }}>
                Thời gian cập nhật
              </TableCell>
            </>
          )}
          {!isMediumScreen && (
            <>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12.5%' }}>
                Sĩ số
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0', width: '12.5%' }}>
                Tên khóa học
              </TableCell>
            </>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', width: isSmallScreen ? '30%' : '10%' }}>
            Thao tác
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {displayedClasses.map((classItem, index) => (
          <TableRow
            key={classItem.class_id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '10%' }}>
              {classItem.stt}
            </TableCell>
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
                {classItem.class_id}
              </TableCell>
            )}
            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5, width: isSmallScreen ? '60%' : '20%' }}>
              {classItem.class_name || 'N/A'}
            </TableCell>
            {!isSmallScreen && isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '25%' }}>
                  {classItem.class_size || 'N/A'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '30%' }}>
                  {classItem.updated_at}
                </TableCell>
              </>
            )}
            {!isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12.5%' }}>
                  {classItem.class_size || 'N/A'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12.5%' }}>
                  {classItem.course ? classItem.course.course_name : 'N/A'}
                </TableCell>
              </>
            )}
            <TableCell sx={{ textAlign: 'center', py: 1.5, width: isSmallScreen ? '30%' : '10%' }}>
              <Tooltip title="Xem">
                <Visibility
                  color="primary"
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => handleViewClass(classItem.class_id)}
                />
              </Tooltip>
              <Tooltip title="Sửa">
                <Edit
                  color="primary"
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => handleEditClass(classItem)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Delete
                  color="error"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteClass(classItem)}
                />
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClassTable;