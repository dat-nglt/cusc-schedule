import React, { useState } from 'react';
import {
    Box,
    Avatar,
    Card,
    CardHeader,
    useTheme,
    alpha,
    Typography,
    Stack,
    Divider,
    Chip,
    Paper,
    IconButton,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    DialogActions, Button,
    ListItem, ListItemIcon, ListItemText

} from '@mui/material';
import {
    Notifications,
    CalendarToday,
    Email,
    Phone,
    School,
    Person,
    LocationOn,
    Cake,
    Class,
    Female,
    Grade, Home,
    Male,
    ExpandMore,
    ExpandLess,
    MoreHoriz,
    Close,
    Visibility,
    Block,
    More
} from '@mui/icons-material';
import StudentDetailModal from './StudentDetailModal';

const InfoCard = ({ icon, title, value, color = 'primary' }) => {
    const theme = useTheme();

    return (
        <Paper elevation={0} sx={{
            p: 2,
            flex: 1,
            minWidth: 160,
            borderRadius: 2,
            bgcolor: alpha(theme.palette[color].main, 0.08),
            border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`
        }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                    p: 1.5,
                    bgcolor: alpha(theme.palette[color].main, 0.2),
                    borderRadius: '12px',
                    color: theme.palette[color].main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {React.cloneElement(icon, { fontSize: 'small' })}
                </Box>
                <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                        {title}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600">
                        {value}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};


function StudentProfile({ studentInfo }) {
    const theme = useTheme();
    const [openModal, setOpenModal] = useState(false); // State to control modal visibility

    // const infoItems = getInfoItems(studentInfo); // Lấy thông tin chi tiết để hiển thị trong modal

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const dataForCard = [
        {
            icon: <Notifications color="warning" />,
            title: "Thông báo chưa đọc",
            value: studentInfo.unreadNotifications || 0,
            color: "warning"
        },
        {
            icon: <CalendarToday color="info" />,
            title: "Sự kiện sắp tới",
            value: studentInfo.upcomingEvents || 0,
            color: "info"
        },
        {
            icon: <School color="success" />,
            title: "Môn học đang học",
            value: studentInfo.currentCourses || 0,
            color: "success"
        },
        {
            icon: <Person color="secondary" />,
            title: "Tín chỉ tích lũy",
            value: `${studentInfo.earnedCredits || 0}/${studentInfo.totalCredits || 0}`,
            color: "secondary"
        }
    ]


    return (
        <Box sx={{ width: '100%' }}>
            <Card elevation={0} sx={{
                borderRadius: 3,
                mb: 1,
                bgcolor: 'background.paper',
                overflow: 'visible' // Ensure dropdown doesn't get clipped
            }}>
                <Box sx={{ p: { xs: 0, md: 3 } }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
                        {/* Avatar Section - Centered on mobile */}
                        <Box sx={{ // Thêm Box bao quanh Avatar và IconButton
                            alignSelf: { xs: 'center', md: 'flex-start' },
                            position: 'relative', // Quan trọng để định vị icon tuyệt đối
                            mr: { xs: 0, sm: 3 }, // Điều chỉnh margin ở đây để phù hợp với Box
                            mb: { xs: 2, sm: 0 },
                        }}>
                            <Avatar sx={{
                                width: { xs: 120, md: 150 },
                                height: { xs: 120, md: 150 },
                                bgcolor: theme.palette.primary.main,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            }}
                                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                            >
                                {studentInfo.name}
                            </Avatar>
                            {/* IconButton mới ở góc dưới bên phải của Avatar */}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    display: { xs: 'flex', md: 'none' },
                                    bottom: -5, // Điều chỉnh vị trí theo ý muốn
                                    right: 0,  // Điều chỉnh vị trí theo ý muốn
                                    bgcolor: theme.palette.secondary.main, // Màu nền của icon
                                    color: 'white', // Màu của icon
                                    border: `2px solid ${theme.palette.background.paper}`, // Viền trắng để nổi bật
                                    '&:hover': {
                                        bgcolor: theme.palette.secondary.dark,
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.2s ease-in-out'
                                    },
                                    width: 35, // Kích thước icon
                                    height: 35,
                                    boxShadow: theme.shadows[3] // Thêm box shadow
                                }}
                                onClick={handleOpenModal} // Gọi hàm để mở dialog chi tiết
                            >
                                <MoreHoriz sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                        </Box>

                        {/* Content Section */}
                        <Box sx={{ flex: 1, width: '100%' }}>
                            <Box sx={{
                                display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center',
                            }}>
                                <Typography
                                    variant="h5"
                                    fontWeight="700"
                                    gutterBottom={false} // Adjust gutterBottom here
                                    sx={{ textAlign: { xs: 'center', md: 'left' }, mr: 2 }} // Add margin-right for the icon
                                >
                                    {studentInfo.name}
                                </Typography>
                                {/* More Info Button - always visible, but consider position for small screens */}
                                <Chip label={'Đang học'} color='primary' size='small' sx={{ px: 2, display: { xs: 'none', md: 'flex' } }} />
                            </Box>

                            <Divider sx={{ my: 2, display: { xs: 'none', md: 'flex' } }} />

                            {/* Chips - wrap on small screens */}
                            <Stack
                                sx={{
                                    display: { xs: 'none', md: 'flex' }, // Only show on medium+ screens
                                    flexDirection: { md: 'row' },
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    alignItems: { md: 'flex-start' },
                                    justifyContent: { md: 'flex-start' }
                                }}
                            >
                                <Chip
                                    label={studentInfo.id}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                        color: theme.palette.secondary.dark
                                    }}
                                />
                                <Chip
                                    label={studentInfo.class}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark
                                    }}
                                />
                                {/* <Chip
                                    label={studentInfo.major}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark
                                    }}
                                />
                                <Chip
                                    label={studentInfo.trainingLevel}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark
                                    }}
                                /> */}
                                <IconButton onClick={handleOpenModal} size="small" color="primary"
                                    sx={{
                                        mt: { xs: -0.5, md: -0.5 }, // Adjust margin top to align with title
                                        display: 'flex', // Ensure it's always visible
                                    }}
                                >
                                    <MoreHoriz />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                {/* Student Details Modal */}
                <StudentDetailModal
                    openModal={openModal}
                    handleCloseModal={handleCloseModal}
                    studentInfo={studentInfo} // Đảm bảo studentInfo được định nghĩa và chứa đủ dữ liệu
                />
            </Card>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 3
            }}>
                {dataForCard.map((card, index) => (
                    <InfoCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        color={card.color}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default StudentProfile;