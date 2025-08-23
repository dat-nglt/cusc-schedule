import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    LinearProgress,
    Typography,
    Modal,
    Backdrop,
    Avatar,
    Fade,
    Container,
    Stack,
    useTheme
} from '@mui/material';
import { CancelPresentation } from '@mui/icons-material';

const ProgressModal = ({
    open,
    value,
    message = 'Hệ thống đang xử lý dữ liệu...',
    handleStopTimetableGeneration,
    blurIntensity = 2
}) => {
    const theme = useTheme();
    const progressValue = Math.min(100, Math.max(0, value));

    return (
        <Modal
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                style: {
                    backdropFilter: `blur(${blurIntensity}px)`,
                    WebkitBackdropFilter: `blur(${blurIntensity}px)`,
                }
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
            }}
        >
            <Fade in={open} timeout={500}>
                <Container maxWidth="sm" sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        mb={4}
                        width="100%"
                    >
                        <Box
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                color: 'white',
                                p: 4,
                                borderRadius: 2,
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                width: '100%',
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
                            <CancelPresentation
                                onClick={handleStopTimetableGeneration}
                                sx={{ position: "absolute", right: 10, top: 10, cursor: 'pointer' }} />
                            <Avatar
                                src="https://sanvieclamcantho.com/upload/imagelogo/trung-tam-cong-nghe-phan-mem-dai-hoc-can-tho1573111986.png"
                                alt="CUSC Logo"
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
                            <Typography variant="caption" sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontStyle: 'italic',
                                display: 'block',
                                mt: 1
                            }}>
                                {progressValue >= 100 ? "Đang hoàn tất quá trình khởi tạo...!" : message}
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={progressValue}
                                color="primary"
                                sx={{
                                    width: '80%',
                                    margin: '20px auto 0',
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3,
                                        background: `linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,1))`,
                                        animationDuration: '2s',
                                    }
                                }}
                            />
                            <Typography variant="caption" sx={{
                                display: 'block',
                                textAlign: 'right',
                                width: '80%',
                                margin: '4px auto 0',
                                color: 'rgba(255,255,255,0.8)'
                            }}>
                                {`${Math.round(progressValue)}%`}
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </Fade>
        </Modal>
    );
};

ProgressModal.propTypes = {
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
    message: PropTypes.string,
    blurIntensity: PropTypes.number
};

export default ProgressModal;