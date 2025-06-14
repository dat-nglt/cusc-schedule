import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            // Xử lý lỗi
            console.error('Authentication error:', error);
            navigate('/login?error=' + error);
            return;
        }

        if (token && userParam) {
            try {
                // Lưu token vào localStorage
                localStorage.setItem('token', token);

                // Lưu thông tin user
                const user = JSON.parse(decodeURIComponent(userParam));
                localStorage.setItem('user', JSON.stringify(user));

                // Chuyển hướng dựa theo role
                const redirectPath = getRedirectPath(user.role);
                navigate(redirectPath);
            } catch (error) {
                console.error('Error processing auth callback:', error);
                navigate('/login?error=processing_failed');
            }
        } else {
            // Không có token hoặc user info
            navigate('/login?error=missing_data');
        }
    }, [navigate, searchParams]);

    const getRedirectPath = (role) => {
        switch (role) {
            case 'admin':
                return '/dashboard';
            case 'training_officer':
                return '/dashboard';
            case 'lecturer':
                return '/dashboard';
            case 'student':
                return '/student';
            default:
                return '/dashboard';
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 2
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
                Đang xử lý đăng nhập...
            </Typography>
        </Box>
    );
};

export default AuthCallback;
