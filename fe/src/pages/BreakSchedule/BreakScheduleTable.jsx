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

const BreakScheduleTable = ({ displayedBreakSchedules, isSmallScreen, isMediumScreen, handleViewBreakSchedule, handleEditBreakSchedule, handleDeleteBreakSchedule }) => {
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
              Mã lịch nghỉ
            </TableCell>
          )}
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0', width: isSmallScreen ? '60%' : '20%' }}>
            Loại lịch nghỉ
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
        {displayedBreakSchedules.map((schedule, index) => (
          <TableRow
            key={schedule.break_id}
            sx={{
              backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
              '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '10%' }}>
              {schedule.stt}
            </TableCell>
            {!isSmallScreen && (
              <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '15%' }}>
                {schedule.break_id}
              </TableCell>
            )}
            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5, width: isSmallScreen ? '60%' : '20%' }}>
              {schedule.break_type}
            </TableCell>
            {!isSmallScreen && isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '25%' }}>
                  {schedule.break_start_date}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '30%' }}>
                  {schedule.updated_at}
                </TableCell>
              </>
            )}
            {!isMediumScreen && (
              <>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12.5%' }}>
                  {schedule.break_start_date}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5, width: '12.5%' }}>
                  {schedule.break_end_date}
                </TableCell>
              </>
            )}
            <TableCell sx={{ textAlign: 'center', py: 1.5, width: isSmallScreen ? '30%' : '10%' }}>
              <Tooltip title="Xem">
                <Visibility
                  color="primary"
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => handleViewBreakSchedule(schedule.break_id)}
                />
              </Tooltip>
              <Tooltip title="Sửa">
                <Edit
                  color="primary"
                  style={{ cursor: 'pointer', marginRight: 8 }}
                  onClick={() => handleEditBreakSchedule(schedule)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Delete
                  color="error"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteBreakSchedule(schedule)} // Thay bằng handleDeleteBreakSchedule với toàn bộ schedule object
                />
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BreakScheduleTable;