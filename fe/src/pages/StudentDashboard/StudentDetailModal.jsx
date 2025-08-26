import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Chip,
    Avatar,
    useTheme,
    alpha,
    useMediaQuery // Import useMediaQuery
} from '@mui/material';
import {
    Close,
    School,
    Person,
    Class,
    Grade,
    CalendarToday,
    Email,
    Phone,
    LocationOn,
    Home,
    Wc,
} from '@mui/icons-material';

const StudentDetailModal = ({ openModal, handleCloseModal, studentInfo }) => {
    const theme = useTheme();
    // Use useMediaQuery to check for small screens
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Enhanced InfoItem component for Flexbox layout
    const InfoItem = ({ icon, label, value, sx }) => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start', // Align items to the start for multi-line address
                flexBasis: { xs: '100%', sm: 'calc(50% - 16px)' }, // approx 2 columns on sm, 1 on xs
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)' },
                flexGrow: 1, // Allow items to grow
                gap: 1.5,
                p: { xs: 1.5, sm: 1 }, // Slightly more padding on mobile
                borderRadius: 2,
                bgcolor: alpha(theme.palette.grey[100], 0.8), // Slightly lighter background for items
                border: `1px solid ${theme.palette.divider}`,
                boxSizing: 'border-box', // Include padding in width
                ...sx,
            }}
        >
            <Box sx={{
                width: 35,
                height: 35,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                {React.cloneElement(icon, {
                    fontSize: 'small', // Smaller icon size on mobile
                    sx: { color: theme.palette.primary.main }
                })}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        lineHeight: 1.2,
                        display: 'block'
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        mt: 0.5,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' } // Adjust font size for readability
                    }}
                >
                    {value || 'Chưa cập nhật'}
                </Typography>
            </Box>
        </Box>
    );

    // Helper for section titles
    const SectionTitle = ({ icon, title }) => (
        <Typography
            variant="subtitle2"
            sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.dark,
                fontWeight: 600,
                pb: 1,
                borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.5)}`, // Dotted line for subtle separation
            }}
        >
            {React.cloneElement(icon, { sx: { mr: 1, fontSize: 18 } })}
            {title}
        </Typography>
    );

    return (
        <Dialog
            open={openModal}
            onClose={handleCloseModal}
            // Adjust maxWidth based on screen size
            maxWidth={isMobile ? 'xs' : 'md'}
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden',
                    margin: isMobile ? 1 : 4,
                    maxHeight: isMobile ? '80vh' : 'auto'
                }
            }}
        >
            {/* Header with gradient background */}
            <DialogTitle sx={{
                py: { xs: 1.5, sm: 1 }, // Slightly more padding on mobile
                px: { xs: 2, sm: 3 }, // Adjust horizontal padding
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                position: 'relative'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Hồ sơ sinh viên
                    </Typography>
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                bgcolor: alpha('#fff', 0.1)
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>

            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 3, sm: 4 } }}> {/* Adjust padding for content */}
                    {/* Student Profile Header */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}>
                        <Avatar
                            src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                            sx={{
                                width: { xs: 70, sm: 80 }, // Slightly smaller avatar on mobile
                                height: { xs: 70, sm: 80 },
                                mr: { xs: 0, sm: 3 },
                                mb: { xs: 2, sm: 0 },
                                border: `3px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                                bgcolor: theme.palette.primary.light,
                                flexShrink: 0 // Prevents avatar from shrinking
                            }}
                        />
                        <Box sx={{ flexGrow: 1 }}> {/* Allow name box to grow */}
                            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                {studentInfo.name}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: { xs: 0.5, sm: 1 }, // Smaller gap for chips on mobile
                                justifyContent: { xs: 'center', sm: 'flex-start' }
                            }}>
                                <Chip
                                    label={studentInfo.id}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                        color: theme.palette.secondary.dark,
                                        fontSize: { xs: '0.6rem', sm: '0.75rem' } // Adjust chip font size
                                    }}
                                />
                                <Chip
                                    label={studentInfo.class}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark,
                                        fontSize: { xs: '0.6rem', sm: '0.75rem' }
                                    }} />
                                {/* <Chip
                                    label={studentInfo.major}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark,
                                        fontSize: { xs: '0.6rem', sm: '0.75rem' }
                                    }} />
                                <Chip
                                    label={studentInfo.trainingLevel}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark,
                                        fontSize: { xs: '0.6rem', sm: '0.75rem' }
                                    }}
                                /> */}
                            </Box>
                        </Box>
                    </Box>

                    {/* Information Layout using Flexbox */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' }, // Stack on small, row on medium+
                        gap: { xs: 2, sm: 3 }, // Adjust gap between major sections
                    }}>
                        {/* Personal Info Section */}
                        <Box sx={{
                            flex: 1, // Allows section to grow and shrink
                            p: { xs: 1.5, sm: 2 }, // Adjust padding
                            bgcolor: alpha(theme.palette.background.paper, 0.9), // Use paper color
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`
                        }}>
                            <SectionTitle icon={<Person />} title="Thông tin cá nhân" />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: { xs: 1.5, sm: 2 }, // Adjust gap between InfoItems
                            }}>
                                <InfoItem icon={<CalendarToday />} label="Ngày sinh" value={studentInfo.dob} />
                                <InfoItem icon={<Wc />} label="Giới tính" value={studentInfo.gender === 'male' ? 'Nam' : "Nữ"} />
                                <InfoItem
                                    icon={<LocationOn />}
                                    label="Địa chỉ"
                                    value={studentInfo.address}
                                    sx={{
                                        flexBasis: '100%', // Địa chỉ luôn chiếm toàn bộ chiều rộng
                                        minWidth: '100%'
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Academic Info Section */}
                        <Box sx={{
                            p: { xs: 1.5, sm: 2 }, // Adjust padding
                            flex: 1,
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`
                        }}>
                            <SectionTitle icon={<School />} title="Thông tin học tập" />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: { xs: 1.5, sm: 2 },
                            }}>
                                <InfoItem icon={<Class />} label="Lớp" value={studentInfo.class} />
                                <InfoItem icon={<Home />} label="Chuyên ngành" value={studentInfo.major} />
                            </Box>
                        </Box>

                        {/* Contact Info Section */}
                        <Box sx={{
                            p: { xs: 1.5, sm: 2 }, // Adjust padding
                            flex: 1,
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`
                        }}>
                            <SectionTitle icon={<Phone />} title="Liên hệ" />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: { xs: 1.5, sm: 2 },
                            }}>
                                <InfoItem icon={<Email />} label="Email" value={studentInfo.email} />
                                <InfoItem icon={<Phone />} label="Điện thoại" value={studentInfo.phone} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: { xs: 2, sm: 3 }, justifyContent: 'flex-end' }}>
                <Button
                    onClick={handleCloseModal}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        px: { xs: 2, sm: 3 },
                        textTransform: 'none',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' } // Adjust button font size
                    }}
                >
                    Đóng
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        px: { xs: 2, sm: 3 },
                        textTransform: 'none',
                        bgcolor: theme.palette.primary.main,
                        '&:hover': {
                            bgcolor: theme.palette.primary.dark
                        },
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                >
                    In hồ sơ
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default StudentDetailModal;