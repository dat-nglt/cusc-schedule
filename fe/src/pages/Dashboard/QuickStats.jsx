import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    School as SchoolIcon,
    People as PeopleIcon,
    MeetingRoom as RoomIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const StatCard = ({ icon, title, value, maxValue, isError, tooltip }) => {
    const percentage = maxValue ? Math.min(100, (value / maxValue) * 100) : 0;
    const color = isError ? 'error' : 'primary';

    return (
        <Tooltip title={tooltip} arrow>
            <Card elevation={2} sx={{
                border: isError ? '1px solid red' : 'none',
                position: 'relative',
                overflow: 'visible'
            }}>
                <CardContent sx={{
                    display: 'flex',
                    alignItems: 'center',
                    pb: '16px !important'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: theme => isError ? theme.palette.error.main : 'transparent',
                        color: 'white',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem'
                    }}>
                        {isError && <InfoIcon fontSize="small" />}
                    </Box>

                    {React.cloneElement(icon, {
                        color: color,
                        sx: { fontSize: 40, mr: 2 }
                    })}

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color={color}
                        >
                            {value}
                            {maxValue && (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 1 }}
                                >
                                    /{maxValue}
                                </Typography>
                            )}
                        </Typography>

                        {maxValue && (
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                color={color}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    mt: 1,
                                    backgroundColor: theme => theme.palette.grey[200]
                                }}
                            />
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Tooltip>
    );
};

const QuickStats = ({ stats }) => {
    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    icon={<SchoolIcon />}
                    title="Lớp học"
                    value={stats.classes}
                    maxValue={50} // Giá trị tối đa tham chiếu
                    tooltip={`Tổng số lớp học: ${stats.classes}`}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    icon={<PeopleIcon />}
                    title="Giảng viên"
                    value={stats.teachers}
                    maxValue={30} // Giá trị tối đa tham chiếu
                    tooltip={`Tổng số giảng viên: ${stats.teachers}`}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    icon={<RoomIcon />}
                    title="Phòng học"
                    value={stats.rooms}
                    maxValue={20} // Giá trị tối đa tham chiếu
                    tooltip={`Tổng số phòng học: ${stats.rooms}`}
                />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    icon={<WarningIcon />}
                    title="Xung đột"
                    value={stats.conflicts}
                    isError={stats.conflicts > 0}
                    tooltip={`Số xung đột lịch chưa giải quyết: ${stats.conflicts}`}
                />
            </Grid>
        </Grid>
    );
};

export default QuickStats;