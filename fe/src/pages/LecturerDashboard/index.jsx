import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import LecturerProfile from './LecturerProfile';
import TeachingSection from './TeachingSection';
import Features from './Features';

const LecturerDashboard = () => {
  const sampleLecturerInfo = {
    name: "Nguyễn Văn A",
    id: "GV20230001",
    department: "Khoa Công nghệ Thông tin",
    email: "nguyenvana@university.edu",
    phone: "0987654321",
    degree: "Tiến sĩ",
    office: "Phòng A203",
    teachingCourses: 3,
    upcomingClasses: 2,
    officeHours: "Thứ 3, Thứ 5: 14:00 - 16:00",
  };

  return (
    <Box sx={{
      p: 2,
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 1,
      gap: 2,
      width: '97%',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1,
        borderRadius: 2,
        bgcolor: 'background.default',
        mb: 1,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 6,
            height: 32,
            bgcolor: 'primary.main',
            borderRadius: 1,
            mr: 1,
          }} />
          <Typography color="primary" variant="h5" fontWeight="bold" textTransform="uppercase" sx={{ letterSpacing: 1 }}>
            THÔNG TIN GIẢNG VIÊN
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <LecturerProfile lecturerInfo={sampleLecturerInfo} />

      <Features />

      <TeachingSection />
    </Box>
  );
};

export default LecturerDashboard;