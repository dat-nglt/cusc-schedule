import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { Typography, Box, useTheme, Stack, Divider, alpha } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RotateRightIcon from '@mui/icons-material/RotateRight';

const CreditProgress = ({ progress, completed, total, target = 120 }) => {
  const theme = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const remaining = total ? target - completed : 0;

  // Color logic based on progress
  const getProgressColor = () => {
    if (progress >= 80) return theme.palette.success.main;
    if (progress >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box sx={{
      width: { sx: '100vw', md: '100%' },
      maxWidth: '100%',
      p: 3,
      borderRadius: 3,
      bgcolor: 'background.paper',
      boxShadow: theme.shadows[1],
      textAlign: 'center'
    }}>
      <Typography variant="h6" sx={{
        mb: 2,
        fontWeight: 600,
        width: '100%',
        color: 'text.primary'
      }}>
        Tiến độ tích lũy tín chỉ
      </Typography>

      <Box sx={{
        width: '100%',
        mx: 'auto',
        mb: 3
      }}>
        <CircularProgressbarWithChildren
          value={clampedProgress}
          styles={buildStyles({
            pathColor: getProgressColor(),
            trailColor: theme.palette.grey[200],
            pathTransitionDuration: 1.5,
            strokeLinecap: 'round',
          })}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: getProgressColor()
            }}>
              {completed}
            </Typography>
            <Typography variant="caption" sx={{
              color: 'text.secondary',
              display: 'block',
              lineHeight: 1.2
            }}>
              tín chỉ
            </Typography>
          </Box>
        </CircularProgressbarWithChildren>
      </Box>

      <Stack
        spacing={2}
        divider={<Divider flexItem />}
        sx={{
          maxWidth: 240,
          mx: 'auto',
          textAlign: 'left'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleOutlineIcon sx={{
            color: theme.palette.success.main,
            mr: 1.5,
            fontSize: 20
          }} />
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Đã hoàn thành
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {completed} / {total} tín chỉ
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RotateRightIcon sx={{
            color: theme.palette.warning.main,
            mr: 1.5,
            fontSize: 20
          }} />
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Còn lại
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {remaining} tín chỉ ({target} yêu cầu)
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Box sx={{
        mt: 3,
        p: 1.5,
        borderRadius: 1,
        bgcolor: alpha(getProgressColor(), 0.1),
        display: 'inline-block'
      }}>
        <Typography variant="caption" sx={{
          color: getProgressColor(),
          fontWeight: 500
        }}>
          {clampedProgress}% hoàn thành chương trình
        </Typography>
      </Box>
    </Box>
  );
};

export default CreditProgress;