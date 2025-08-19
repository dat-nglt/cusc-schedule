import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import LecturerProfile from './LecturerProfile';
import TeachingSection from './TeachingSection';
import Features from './Features';

const LecturerDashboard = () => {
  const { userData, loading } = useAuth();
  // Fallback data nếu userData chưa có
  const lecturerInfo = userData ? {
    name: userData.name || "Chưa cập nhật",
    id: userData.code || "Chưa có mã",
    department: userData.department || "Chưa cập nhật",
    email: userData.email || "Chưa cập nhật",
    phone: userData.phone_number || "Chưa cập nhật",
    degree: userData.degree || "Chưa cập nhật",
    office: userData.office || "Chưa cập nhật",
    teachingCourses: userData.teachingCourses || 0,
    upcomingClasses: userData.upcomingClasses || 0,
    officeHours: userData.officeHours || "Chưa cập nhật",
  } : {
    name: "Đang tải...",
    id: "...",
    department: "...",
    email: "...",
    phone: "...",
    degree: "...",
    office: "...",
    teachingCourses: 0,
    upcomingClasses: 0,
    officeHours: "...",
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography>Đang tải thông tin...</Typography>
      </Box>
    );
  }

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

      <LecturerProfile lecturerInfo={lecturerInfo} />

      <Features />

      <TeachingSection />
    </Box>
  );
};

export default LecturerDashboard;