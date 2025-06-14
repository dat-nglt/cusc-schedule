import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleLoginTest = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/google';
    };

    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Test Google Login
            </Typography>
            <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{ mt: 2 }}
            >
                Login with Google
            </Button>
        </Box>
    );
};

export default GoogleLoginTest;
