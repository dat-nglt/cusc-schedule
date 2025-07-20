// src/pages/AuthCallbackHandler.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentUserData } from '../../api/authAPI';
import {
  LinearProgress,
  Box,
  Typography,
  Container,
  Fade,
  Stack,
  useTheme,
  Avatar
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  AccountCircle
} from '@mui/icons-material';

function AuthCallbackHandler() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, logout } = useAuth();
  const [message, setMessage] = useState('Đang xác thực tài khoản...');
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 90);
      });
    }, 500);

    const handleAuthProcess = async () => {
      try {
        const response = await getCurrentUserData();

        if (response?.success) {
          setProgress(100);
          login(response.role);
          setMessage('Xác thực thành công!');
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000);
        } else {
          const errorMessage = response?.message || 'Xác thực không thành công';
          throw new Error(errorMessage);
        }
      } catch (error) {
        setProgress(100);
        logout();
        setMessage(error.message);
        setIsError(true);
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(error.message)}`, { replace: true });
        }, 2000);
      } finally {
        setLoading(false);
        clearInterval(timer);
      }
    };

    handleAuthProcess();

    return () => clearInterval(timer);
  }, [navigate, login, logout]);

  return (
    <Container maxWidth="sm" sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      // background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
    }}>
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Avatar
            src="https://sanvieclamcantho.com/upload/imagelogo/trung-tam-cong-nghe-phan-mem-dai-hoc-can-tho1573111986.png"
            alt="Logo"
            sx={{
              width: 72,
              height: 72,
              margin: '0 auto 16px',
              border: '3px solid white',
              boxShadow: theme.shadows[3]
            }}
          />
          <Typography variant="h5" component="h1" fontWeight="600">
            HỆ THỐNG QUẢN LÝ THỜI KHOÁ BIỂU
          </Typography>
          <Box sx={{
            p: 2,
            borderRadius: 3,
          }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
              {loading ? (
                <AccountCircle sx={{
                  fontSize: 32,
                  color: 'primary.main',
                  flexShrink: 0
                }} />
              ) : isError ? (
                <ErrorIcon sx={{
                  fontSize: 32,
                  color: 'error.main',
                  flexShrink: 0
                }} />
              ) : (
                <CheckCircle sx={{
                  fontSize: 32,
                  color: 'success.main',
                  flexShrink: 0
                }} />
              )}
              <Typography variant="body1" sx={{
                fontWeight: 500,
                color: isError ? 'error.dark' : loading ? 'text.main' : 'success.light'
              }}>
                {message}
              </Typography>
            </Stack>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            color={isError ? 'error' : 'primary'}
            sx={{
              width: '80%',
              margin: '0 auto',
              height: 3,
              borderRadius: 4,
              mb: 2,
              transition: 'all 0.3s ease',
              backgroundColor: 'divider'
            }}
          />
          </Box>
      </Fade>
    </Container >
  );
}

export default AuthCallbackHandler;