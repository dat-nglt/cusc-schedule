import React from 'react';
import {
    Box,
    Grid,
    Avatar,
    Typography,
    Chip,
    Divider,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Person,
    School,
    CalendarToday,
    Class,
    LibraryBooks,
    DateRange,
    TrendingUp,
    DoneAll
} from '@mui/icons-material';

const CompactInfoItem = ({ icon, label, value }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '24px 1fr' : 'auto 1fr',
            alignItems: 'center',
            gap: 2,
            mb: isMobile ? 1.5 : 0
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {React.cloneElement(icon, { fontSize: isMobile ? 'small' : 'medium' })}
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <Typography variant={isMobile ? 'subtitle2' : 'subtitle2'} color="text.secondary" sx={{
                    minWidth: 'fit-content',
                }}>
                    {label}:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 24, flex: 1 }}>
                    <Typography variant={isMobile ? 'subtitle1' : 'subtitle1'} fontWeight={600} >
                        {value}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

const StatBox = ({ value, label, color, icon, progress }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            px: isMobile ? 1.5 : 2,
            py: isMobile ? 1 : 1.5,
            borderRadius: 2,
            backgroundColor: `${color}.light`,
            border: '1px solid',
            borderColor: `${color}.main`,
            position: 'relative',
            overflow: 'hidden',
            mb: isMobile ? 1.5 : 0
        }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress || 0}%`,
                backgroundColor: `${color}.main`,
                opacity: 0.1
            }} />

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative'
            }}>
                <Box>
                    <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ fontWeight: 700 }}>
                        {value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {label}
                    </Typography>
                </Box>
                <Box sx={{
                    color: `${color}.dark`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40,
                    borderRadius: '50%',
                    backgroundColor: `${color}.lighter`
                }}>
                    {React.cloneElement(icon, { fontSize: isMobile ? 'small' : 'medium' })}
                </Box>
            </Box>
        </Box>
    );
};

function StudentInfo({ studentData }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{
            p: isMobile ? 2 : 4,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(to bottom, #f9f9f9, #ffffff)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 5,
                height: '100%',
                backgroundColor: 'primary.main'
            }
        }}>
            <Grid container spacing={isMobile ? 2 : 3} alignItems="center" sx={{
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                {/* Avatar Section */}
                <Grid item xs={12} sm="auto" sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                    <Box sx={{ position: 'relative', }}>
                        <Avatar
                            alt={studentData.name}
                            src={studentData.avatar}
                            sx={{
                                width: isMobile ? 120 : 150,
                                height: isMobile ? 120 : 150,
                                border: '3px solid',
                                borderColor: 'primary.light',
                                boxShadow: 2
                            }}
                        />
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: isMobile ? 24 : 32,
                            height: isMobile ? 24 : 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 1
                        }}>
                            <School fontSize={isMobile ? 'small' : 'medium'} />
                        </Box>
                    </Box>
                </Grid>

                {/* Main Info Section */}
                <Grid item xs={12} sm sx={{ flex: 1, minWidth: isMobile ? '100%' : 300 }}>
                    <Box sx={{
                        mb: isMobile ? 1 : 2, textAlign: isMobile ? 'center' : 'left', display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 1
                    }}>
                        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            {studentData.name}
                        </Typography>
                        <Chip
                            label={studentData.status || "Đang học"}
                            size="small"
                            color={studentData.status === "Tốt nghiệp" ? "success" : "primary"}
                            sx={{ fontWeight: 500, px: 1 }}
                        />
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                        gap: isMobile ? 2 : 3,
                        mb: isMobile ? 1 : 3,
                    }}>
                        {/* Personal Info Column */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            p: isMobile ? 1 : 2,
                            borderRadius: 2,
                            backgroundColor: 'background.default'
                        }}>
                            <CompactInfoItem
                                icon={<Person fontSize="small" sx={{ color: 'primary.main' }} />}
                                label="Mã sinh viên"
                                value={studentData.id}
                            />
                            {!isMobile && <Divider />}
                            <CompactInfoItem
                                icon={<CalendarToday fontSize="small" sx={{ color: 'primary.main' }} />}
                                label="Ngày sinh"
                                value={studentData.birthday || "—"}
                            />
                            {!isMobile && <Divider />}
                            <CompactInfoItem
                                icon={<Class fontSize="small" sx={{ color: 'primary.main' }} />}
                                label="Lớp học"
                                value={
                                    studentData.class
                                }
                            />
                        </Box>

                        {/* Academic Info Column */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            p: isMobile ? 1 : 2,
                            borderRadius: 2,
                            backgroundColor: 'background.default'
                        }}>
                            <CompactInfoItem
                                icon={<School fontSize="small" sx={{ color: 'secondary.main' }} />}
                                label="Chương trình"
                                value={studentData.program}
                            />
                            {!isMobile && <Divider />}
                            <CompactInfoItem
                                icon={<LibraryBooks fontSize="small" sx={{ color: 'secondary.main' }} />}
                                label="Khoa/Viện"
                                value={studentData.faculty}
                            />
                            {!isMobile && <Divider />}
                            <CompactInfoItem
                                icon={<DateRange fontSize="small" sx={{ color: 'secondary.main' }} />}
                                label="Năm nhập học"
                                value={studentData.enrollmentYear}
                            />
                        </Box>

                        {/* Stats Column */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <StatBox
                                value={studentData.gpa}
                                label="GPA"
                                color="primary"
                                icon={<TrendingUp />}
                            />
                            <StatBox
                                value={`${studentData.creditsCompleted}/${studentData.creditsTotal}`}
                                label="Tín chỉ"
                                color="secondary"
                                icon={<DoneAll />}
                                progress={(studentData.creditsCompleted / studentData.creditsTotal) * 100}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentInfo;