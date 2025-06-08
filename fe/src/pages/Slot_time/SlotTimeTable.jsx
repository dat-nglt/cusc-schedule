
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

const SlotTimeTable = ({ displayedSlotTimes, isExtraSmallScreen, isSmallScreen, isMediumScreen, handleViewSlotTime, handleEditSlotTime, handleDeleteSlotTime }) => {
  return (
    <Table sx={{ minWidth: isExtraSmallScreen ? 300 : isSmallScreen ? 400 : isMediumScreen ? 600 : 1000, border: '1px solid #e0e0e0' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
            STT
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
            Mã khung giờ
          </TableCell>
          <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'left', borderRight: '1px solid #e0e0e0' }}>
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
              {!isMediumScreen && (
                <>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                    Thời gian tạo
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>
                    Thời gian cập nhật
                  </TableCell>
                </>
              )}
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
            <TableCell sx={{ textAlign: 'left', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
              {slotTime.tenKhungGio}
            </TableCell>
            {!isSmallScreen && (
              <>
                {!isMediumScreen && (
                  <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                    {slotTime.buoiHoc}
                  </TableCell>
                )}
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {slotTime.thoiGianBatDau}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                  {slotTime.thoiGianKetThuc}
                </TableCell>
                {!isMediumScreen && (
                  <>
                    <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                      {slotTime.thoiGianTao}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                      {slotTime.thoiGianCapNhat}
                    </TableCell>
                  </>
                )}
              </>
            )}
            <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Visibility
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleViewSlotTime(slotTime.id)}
                />
                <Edit
                  color="primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEditSlotTime(slotTime.id)}
                />
                <Delete
                  color="error"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteSlotTime(slotTime.id)}
                />
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SlotTimeTable;