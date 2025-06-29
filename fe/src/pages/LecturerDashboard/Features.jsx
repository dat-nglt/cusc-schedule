import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Box, useTheme } from '@mui/system';
import { Book, CalendarToday, People, School } from '@mui/icons-material';

const Features = ({ features }) => {
  const theme = useTheme();

  // Dữ liệu mẫu cho features của giảng viên, nếu không được truyền từ props
  const defaultFeatures = [
    { icon: <Book fontSize="small" />, name: 'Khóa học', path: '/lecturer/courses' },
    { icon: <CalendarToday fontSize="small" />, name: 'Lịch dạy', path: '/lecturer/schedule' },
    { icon: <People fontSize="small" />, name: 'Sinh viên', path: '/lecturer/students' },
    { icon: <School fontSize="small" />, name: 'Thông tin cá nhân', path: '/lecturer' },
  ];

  const featureList = features || defaultFeatures;

  return (
    <Box sx={{
      width: '100%',
      border: `1px solid ${theme.palette.divider}`,
    }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        {featureList.map((feature, index) => (
          <Box
            key={index}
            sx={{
              flex: '1 1 calc(25% - 16px)', // Điều chỉnh cho 4 mục trên hàng
              minWidth: '120px',
              maxWidth: '200px',
            }}
          >
            <Button
              component={Link}
              to={feature.path}
              fullWidth
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                py: 2,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {feature.icon}
              <Typography variant="caption">{feature.name}</Typography>
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Features;