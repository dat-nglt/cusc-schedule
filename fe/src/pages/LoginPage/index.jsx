import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Grid,
    Avatar,
    useTheme,
    Container,
    Link,
    Paper,
    alpha
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import SchoolIcon from '@mui/icons-material/School';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const LoginPage = () => {
    const [selectedRole, setSelectedRole] = useState('Học viên');
    const theme = useTheme();

    const roles = [
        { name: 'Học viên', icon: <SchoolIcon fontSize="large" /> },
        { name: 'Giảng viên', icon: <PersonIcon fontSize="large" /> },
        { name: 'Cán bộ đào tạo', icon: <EngineeringIcon fontSize="large" /> },
        { name: 'Quản trị viên', icon: <AdminPanelSettingsIcon fontSize="large" /> },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: theme.palette.grey[100],
            }}
        >
            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex' }}>
                {/* Left Side - Image */}
                <Box
                    sx={{
                        width: { xs: 0, md: '50%' },
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        p: 4,
                        background: `
      linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.9)} 0%, 
        ${alpha(theme.palette.primary.dark, 0.9)} 100%),
      url('https://cusc.ctu.edu.vn/images/banners/bg-cusc.jpg')
    `,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `radial-gradient(circle at 75% 30%, 
        ${alpha(theme.palette.secondary.light, 0.15)} 0%, 
        transparent 40%)`,
                        }
                    }}
                >
                    {/* Floating Elements */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.3,
                                duration: 0.8,
                                ease: "easeOut"
                            }
                        }}
                        sx={{
                            position: 'relative',
                            zIndex: 2,
                            textAlign: 'center'
                        }}
                    >
                        {/* Logo with floating animation */}
                        <Box
                            component={motion.div}
                            animate={{
                                y: [0, -15, 0],
                                transition: {
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            sx={{
                                mb: 4,
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                            }}
                        >
                            <Box
                                component="img"
                                src="https://cusc.ctu.edu.vn/themes/cusc/images/cusc/logo/CUSC%20Logo%20Series.png"
                                alt="CUSC Logo"
                                sx={{
                                    maxWidth: '70%',
                                    height: 'auto',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>

                        {/* Text with fade-in animation */}
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: {
                                    delay: 0.6,
                                    duration: 1
                                }
                            }}
                        >
                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                sx={{
                                    color: 'white',
                                    fontWeight: 600,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    mb: 2,
                                    textTransform: 'uppercase',
                                }}
                            >
                                Trung tâm Công nghệ phần mềm
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: alpha(theme.palette.common.white, 0.9),
                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                    maxWidth: '80%',
                                    mx: 'auto',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                }}
                            >
                                Đại học Cần Thơ
                            </Typography>
                        </Box>

                        {/* Floating decorative elements */}
                        <Box
                            component={motion.div}
                            animate={{
                                rotate: [0, 360],
                                transition: {
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            }}
                            sx={{
                                position: 'absolute',
                                top: '20%',
                                left: '15%',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                border: `2px dashed ${alpha(theme.palette.secondary.light, 0.4)}`,
                                opacity: 0.6
                            }}
                        />
                        <Box
                            component={motion.div}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.6, 0.9, 0.6],
                                transition: {
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            sx={{
                                position: 'absolute',
                                bottom: '25%',
                                right: '20%',
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                backgroundColor: alpha(theme.palette.secondary.light, 0.3)
                            }}
                        />
                    </Box>

                    {/* Animated background elements */}
                    <Box
                        component={motion.div}
                        animate={{
                            x: ['-50%', '150%'],
                            transition: {
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }
                        }}
                        sx={{
                            position: 'absolute',
                            bottom: -100,
                            left: 0,
                            width: '200%',
                            height: 120,
                            background: `linear-gradient(
        90deg,
        transparent 0%,
        ${alpha(theme.palette.common.white, 0.1)} 50%,
        transparent 100%
      )`,
                            transform: 'rotate(-2deg)'
                        }}
                    />
                </Box>

                {/* Right Side - Login Form */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                    }}
                >
                    <Card
                        sx={{
                            width: '100%',
                            maxWidth: 500,
                            borderRadius: 4, // Bo góc lớn hơn
                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)', // Shadow mềm hơn
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: theme.palette.divider, // Thêm border tinh tế
                            transition: 'transform 0.3s, box-shadow 0.3s', // Hiệu ứng hover
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0px 12px 28px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                    >
                        {/* Header với gradient */}
                        <Box
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                color: 'white',
                                p: 4,
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
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    opacity: 0.9,
                                    mt: 1
                                }}
                            >
                                Đăng nhập hệ thống để quản lý dễ dàng hơn
                            </Typography>
                        </Box>

                        <CardContent sx={{ p: 4 }}>
                            {/* Role selection với hiệu ứng card */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    mb: 3
                                }}
                            >
                                {/* Dòng 1 */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 3,
                                        flexDirection: { xs: 'column', sm: 'row' }
                                    }}
                                >
                                    {roles.slice(0, 2).map((role) => (
                                        <Paper
                                            key={role.name}
                                            elevation={selectedRole === role.name ? 6 : 2}
                                            onClick={() => setSelectedRole(role.name)}
                                            sx={{
                                                flex: 1,
                                                p: { xs: 2, md: 3 },
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                border: '2px solid',
                                                borderColor: selectedRole === role.name
                                                    ? theme.palette.primary.main
                                                    : 'transparent',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: theme.shadows[8],
                                                    borderColor: theme.palette.primary.light
                                                },
                                                textAlign: 'center',
                                                minHeight: '120px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: selectedRole === role.name
                                                    ? alpha(theme.palette.primary.light, 0.1)
                                                    : theme.palette.background.paper
                                            }}
                                        >
                                            <Box sx={{
                                                color: selectedRole === role.name
                                                    ? theme.palette.primary.main
                                                    : theme.palette.text.secondary,
                                                mb: 1.5,
                                                '& svg': {
                                                    fontSize: { xs: '36px', md: '42px' }
                                                }
                                            }}>
                                                {role.icon}
                                            </Box>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="600"
                                                color={selectedRole === role.name
                                                    ? theme.palette.primary.main
                                                    : 'text.primary'}
                                            >
                                                {role.name}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>

                                {/* Dòng 2 */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 3,
                                        flexDirection: { xs: 'column', sm: 'row' }
                                    }}
                                >
                                    {roles.slice(2, 4).map((role) => (
                                        <Paper
                                            key={role.name}
                                            elevation={selectedRole === role.name ? 6 : 2}
                                            onClick={() => setSelectedRole(role.name)}
                                            sx={{
                                                flex: 1,
                                                p: { xs: 2, md: 3 },
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                border: '2px solid',
                                                borderColor: selectedRole === role.name
                                                    ? theme.palette.primary.main
                                                    : 'transparent',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: theme.shadows[8],
                                                    borderColor: theme.palette.primary.light
                                                },
                                                textAlign: 'center',
                                                minHeight: '120px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: selectedRole === role.name
                                                    ? alpha(theme.palette.primary.light, 0.1)
                                                    : theme.palette.background.paper
                                            }}
                                        >
                                            <Box sx={{
                                                color: selectedRole === role.name
                                                    ? theme.palette.primary.main
                                                    : theme.palette.text.secondary,
                                                mb: 1.5,
                                                '& svg': {
                                                    fontSize: { xs: '36px', md: '42px' }
                                                }
                                            }}>
                                                {role.icon}
                                            </Box>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="600"
                                                color={selectedRole === role.name
                                                    ? theme.palette.primary.main
                                                    : 'text.primary'}
                                            >
                                                {role.name}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Box>
                            </Box>

                            {selectedRole && (
                                <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                                    <Divider sx={{
                                        my: 3,
                                        '&::before, &::after': {
                                            borderColor: theme.palette.divider
                                        }
                                    }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                px: 2,
                                                color: 'text.secondary',
                                                backgroundColor: theme.palette.background.paper
                                            }}
                                        >
                                            Đăng nhập với tư cách {selectedRole}
                                        </Typography>
                                    </Divider>

                                    {/* Google Button cải tiến */}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        startIcon={<GoogleIcon />}
                                        sx={{
                                            background: 'linear-gradient(90deg, #4285F4 0%, #34A853 100%)',
                                            color: 'white',
                                            py: 1.75,
                                            borderRadius: 2,
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            letterSpacing: '0.5px',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                boxShadow: '0px 4px 12px rgba(66, 133, 244, 0.3)',
                                                background: 'linear-gradient(90deg, #357ABD 0%, #2D9144 100%)'
                                            },
                                            '& .MuiButton-startIcon': {
                                                backgroundColor: 'white',
                                                borderRadius: '50%',
                                                p: 0.5,
                                                ml: -1,
                                                mr: 1
                                            }
                                        }}
                                    >
                                        Sign in with Google
                                    </Button>

                                    {/* Help text */}
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        textAlign="center"
                                        mt={2}
                                        color="text.secondary"
                                    >
                                        Bạn sẽ được chuyển hướng đến Google để đăng nhập an toàn
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;