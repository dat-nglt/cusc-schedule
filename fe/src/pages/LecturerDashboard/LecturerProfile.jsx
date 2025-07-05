import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Card,
  Typography,
  Stack,
  Divider,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { Notifications, CalendarToday, School, Person, MoreHoriz } from '@mui/icons-material';
import LecturerDetailModal from './LecturerDetailModal';

const InfoCard = ({ icon, title, value, color = 'primary' }) => {
  const theme = useTheme();

  return (
    <Card elevation={0} sx={{
      p: 2,
      flex: 1,
      minWidth: 160,
      borderRadius: 2,
      bgcolor: alpha(theme.palette[color].main, 0.08),
      border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
    }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{
          p: 1.5,
          bgcolor: alpha(theme.palette[color].main, 0.2),
          borderRadius: '12px',
          color: theme.palette[color].main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {React.cloneElement(icon, { fontSize: 'small' })}
        </Box>
        <Box>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="subtitle1" fontWeight="600">
            {value}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};

const LecturerProfile = ({ lecturerInfo }) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const dataForCard = [
    {
      icon: <Notifications color="warning" />,
      title: "Thông báo chưa đọc",
      value: lecturerInfo.unreadNotifications || 0,
      color: "warning",
    },
    {
      icon: <CalendarToday color="info" />,
      title: "Lớp học sắp tới",
      value: lecturerInfo.upcomingClasses || 0,
      color: "info",
    },
    {
      icon: <School color="success" />,
      title: "Khóa học đang dạy",
      value: lecturerInfo.teachingCourses || 0,
      color: "success",
    },
    {
      icon: <Person color="secondary" />,
      title: "Giờ làm việc",
      value: lecturerInfo.officeHours || '---',
      color: "secondary",
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Card elevation={0} sx={{
        borderRadius: 3,
        mb: 1,
        bgcolor: 'background.paper',
        overflow: 'visible',
      }}>
        <Box sx={{ p: { xs: 0, md: 3 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
            <Box sx={{
              alignSelf: { xs: 'center', md: 'flex-start' },
              position: 'relative',
              mr: { xs: 0, sm: 3 },
              mb: { xs: 2, sm: 0 },
            }}>
              <Avatar sx={{
                width: { xs: 120, md: 150 },
                height: { xs: 120, md: 150 },
                bgcolor: theme.palette.primary.main,
                fontSize: { xs: '2rem', md: '2.5rem' },
                border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              >
                {lecturerInfo.name.charAt(0)}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  display: { xs: 'flex', md: 'none' },
                  bottom: -5,
                  right: 0,
                  bgcolor: theme.palette.secondary.main,
                  color: 'white',
                  border: `2px solid ${theme.palette.background.paper}`,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                  width: 35,
                  height: 35,
                  boxShadow: theme.shadows[3],
                }}
                onClick={handleOpenModal}
              >
                <MoreHoriz sx={{ fontSize: '1.2rem' }} />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, width: '100%' }}>
              <Box sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
                alignItems: 'center',
              }}>
                <Typography
                  variant="h5"
                  fontWeight="700"
                  sx={{ textAlign: { xs: 'center', md: 'left' }, mr: 2 }}
                >
                  {lecturerInfo.name}
                </Typography>
                <Chip label={'Giảng viên'} color='primary' size='small' sx={{ px: 2, display: { xs: 'none', md: 'flex' } }} />
              </Box>

              <Divider sx={{ my: 2, display: { xs: 'none', md: 'flex' } }} />

              <Stack
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: { md: 'row' },
                  flexWrap: 'wrap',
                  gap: 1,
                  alignItems: { md: 'flex-start' },
                  justifyContent: { md: 'flex-start' },
                }}
              >
                <Chip
                  label={lecturerInfo.id}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.dark,
                  }}
                />
                <Chip
                  label={lecturerInfo.department}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                  }}
                />
                <Chip
                  label={lecturerInfo.degree}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.dark,
                  }}
                />
                <IconButton onClick={handleOpenModal} size="small" color="primary"
                  sx={{ mt: { xs: -0.5, md: -0.5 }, display: 'flex' }}
                >
                  <MoreHoriz />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Card>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3,
      }}>
        {dataForCard.map((card, index) => (
          <InfoCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            color={card.color}
          />
        ))}
      </Box>

      <LecturerDetailModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        lecturerInfo={lecturerInfo}
      />
    </Box>
  );
};

export default LecturerProfile;