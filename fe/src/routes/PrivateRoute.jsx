import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  LinearProgress,
  Fade,
  Stack
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Lock
} from '@mui/icons-material';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userRole, loading } = useAuth();
  const location = useLocation();
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
          <Box sx={{
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 4,
            p: 4,
            boxShadow: 3
          }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={4}>
              <img
                src="https://cusc.ctu.edu.vn/themes/cusc/images/cusc/logo/CUSC%20Logo%20Series.png"
                alt="CUSC Logo"
                style={{ width: '80px', height: 'auto' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  TRUNG TÂM CÔNG NGHỆ PHẦN MỀM
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  ĐẠI HỌC CẦN THƠ
                </Typography>
              </Box>
            </Stack>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Vui lòng chờ trong giây lát
            </Typography>

            <LinearProgress
              color="primary"
              sx={{
                width: '80%',
                margin: '0 auto',
                height: 4,
                mt: 1,
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  animationDuration: '2s',
                }
              }}
            />

          </Box>
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
          <Box sx={{
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'background.paper',
            borderRadius: 4,
            p: 4,
            boxShadow: 3
          }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={4}>
              <img
                src="https://cusc.ctu.edu.vn/themes/cusc/images/cusc/logo/CUSC%20Logo%20Series.png"
                alt="CUSC Logo"
                style={{ width: '80px', height: 'auto' }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  TRUNG TÂM CÔNG NGHỆ PHẦN MỀM
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  ĐẠI HỌC CẦN THƠ
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn không có quyền truy cập trang này
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Tự động chuyển hướng sau {countdown} giây...
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


          </Box>
        </Fade>
      </Container>
    );
  }

  // 4. Authenticated and authorized
  return children;
};

export default PrivateRoute;