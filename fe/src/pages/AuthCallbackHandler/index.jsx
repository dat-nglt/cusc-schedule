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
    useTheme
  } from '@mui/material';
  import {
    CheckCircle,
    Error as ErrorIcon,
    AccountCircle
  } from '@mui/icons-material';

  function AuthCallbackHandler() {
    const navigate = useNavigate();
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
          <Box sx={{
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 4,
            p: 4,
            boxShadow: 24
          }}>
            <Stack direction="row" alignItems="flex-end" justifyContent="center" spacing={4} mb={4}>
              <img
                src="https://cusc.ctu.edu.vn/themes/cusc/images/cusc/logo/CUSC%20Logo%20Series.png"
                alt="CUSC Logo"
                style={{ width: '100px', height: 'auto' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  lineHeight: 1.2
                }}>
                  TRUNG TÂM CÔNG NGHỆ PHẦN MỀM
                </Typography>
                <Typography variant="subtitle1" sx={{
                  fontWeight: 700,
                  color: 'primary.main'
                }}>
                  ĐẠI HỌC CẦN THƠ
                </Typography>
              </Box>
            </Stack>

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
                  color: isError ? 'error.dark' : loading ? 'text.primary' : 'success.dark'
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

            <Typography variant="caption" sx={{
              color: 'text.secondary',
              display: 'block',
              fontStyle: 'italic'
            }}>
              {loading ? 'Vui lòng chờ trong giây lát...' : isError ? 'Đang chuyển về trang đăng nhập' : 'Đang chuyển hướng...'}
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  export default AuthCallbackHandler;