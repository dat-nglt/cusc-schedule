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
    Collapse
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
    Female,
    Male,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';

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
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
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
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => setExpanded(!expanded);

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
    const infoItems = [
        { icon: <Email sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />, value: studentInfo.email },
        { icon: <Phone sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />, value: studentInfo.phone },
        { icon: <Cake sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />, value: studentInfo.dob },
        {
            icon: studentInfo.gender.toLowerCase() === 'nam'
                ? <Male sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />
                : <Female sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />,
            value: studentInfo.gender
        }
    ];

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
                        <Box sx={{
                            alignSelf: { xs: 'center', md: 'flex-start' },
                            position: 'relative'
                        }}>
                            <Avatar sx={{
                                width: { xs: 120 , md: 150 },
                                height: { xs: 120 , md: 150 },
                                bgcolor: theme.palette.primary.main,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            }}
                                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                            >
                                {studentInfo.name.charAt(0)}
                            </Avatar>

                            {/* Expand/Collapse button - only visible on mobile */}
                            <IconButton
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    position: 'absolute',
                                    right: -10,
                                    bottom: -10,
                                    bgcolor: 'background.paper',
                                    boxShadow: 1,
                                    '&:hover': {
                                        bgcolor: 'background.default'
                                    }
                                }}
                                onClick={toggleExpand}
                                size="small"
                            >
                                {expanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Box>

                        {/* Content Section */}
                        <Box sx={{ flex: 1, width: '100%' }}>
                            <Typography
                                variant="h5"
                                fontWeight="700"
                                gutterBottom
                                sx={{ textAlign: { xs: 'center', md: 'left' } }}
                            >
                                {studentInfo.name}
                            </Typography>

                            {/* Chips - wrap on small screens */}
                            <Stack
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    flexDirection: { md: 'row' },
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    mb: 1,
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
                                <Chip
                                    label={studentInfo.trainingLevel}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark
                                    }}
                                />
                                <Chip
                                    label={studentInfo.major}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.dark
                                    }}
                                />
                            </Stack>

                            {/* Menu for mobile */}
                            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                                <Collapse in={expanded}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-around',
                                            px: 1.5,
                                            py: 0.5,
                                            bgcolor: alpha(theme.palette.info.main, 0.1),
                                            color: theme.palette.info.dark,
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            width: '100%',
                                            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                                        }}
                                    >
                                        {[studentInfo.id, studentInfo.class, studentInfo.major].map((item, index, array) => (
                                            <React.Fragment key={index}>
                                                <span>{item}</span>
                                                {index < array.length - 1 && (
                                                    <Box
                                                        component="span"
                                                        sx={{
                                                            mx: 1,
                                                            height: '0.75rem',
                                                            width: '2px',
                                                            bgcolor: theme.palette.divider,
                                                            alignSelf: 'center',
                                                        }}
                                                    />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </Box>
                                    <Stack
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                                            gap: 1,
                                            mt: 1,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {infoItems.map((item, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    px: 1,
                                                    py: 0.75,
                                                    borderRadius: 1,
                                                    bgcolor: theme.palette.action.hover,
                                                }}
                                            >
                                                {React.cloneElement(item.icon, {
                                                    sx: {
                                                        fontSize: 18,
                                                        color: theme.palette.text.secondary,
                                                    },
                                                })}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500,
                                                        color: theme.palette.text.primary,
                                                    }}
                                                >
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>


                                </Collapse>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Info Items - collapsible on mobile */}
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                    sx={{
                                        '& > *': {
                                            minWidth: { xs: 'calc(50% - 8px)', sm: 'auto' }
                                        }
                                    }}
                                >
                                    {infoItems.map((item, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mr: 2,
                                            mb: 1
                                        }}>
                                            {React.cloneElement(item.icon, {
                                                sx: {
                                                    fontSize: '1rem',
                                                    mr: 0.5,
                                                    color: 'text.secondary'
                                                }
                                            })}
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {item.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
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