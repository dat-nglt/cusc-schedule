import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  LinearProgress,
  Fade,
  Stack,
  useTheme,
  Avatar
} from '@mui/material';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userRole, loading } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [showContent, setShowContent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);

  React.useEffect(() => {
    setShowContent(true);
  }, []);

  // Handle countdown for unauthorized access
  useEffect(() => {
    let timer;
    if (!loading && !isLoggedIn) {
      timer = setTimeout(() => {
        navigate('/login', { state: { from: location }, replace: true });
      }, 3000);
    } else if (!loading && isLoggedIn && allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/login', { state: { from: location }, replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, isLoggedIn, userRole, allowedRoles, navigate, location]);

  // 1. Loading authentication state
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Fade in={showContent} timeout={500}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={4}>
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
                QUẢN LÝ TỔ CHỨC ĐÀO TẠO
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.main', fontStyle: 'italic' }}>
                Vui lòng chờ trong giây lát
              </Typography>

              <LinearProgress
                color="primary"
                sx={{
                  width: '80%',
                  margin: '0 auto',
                  height: 4,
                  mt: 2,
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    animationDuration: '2s',
                  }
                }}
              />
            </Box>
          </Stack>
        </Fade>
      </Container>
    );
  }

  // 2. Check login status
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check role permissions
  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return (
      <Container maxWidth="sm" sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Fade in={showContent} timeout={500}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={4}>
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
                QUẢN LÝ TỔ CHỨC ĐÀO TẠO
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.main' }}>
                Bạn không có quyền truy cập trang này
              </Typography>
              <LinearProgress
                variant="buffer"
                value={100}
                valueBuffer={100}
                color="error"
                sx={{
                  width: '80%',
                  margin: '0 auto',
                  height: 4,
                  borderRadius: 3,
                  mt: 1,
                  '& .MuiLinearProgress-bar': {
                    animation: 'none',
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.main', fontStyle: 'italic' }}>
                Tự động chuyển hướng sau {countdown} giây...
              </Typography>
            </Box>
          </Stack>
        </Fade>
      </Container >
    );
  }

  return children;
};

export default PrivateRoute;