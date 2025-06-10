import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import WeeklyCalendarForStudent from './WeeklyCalendarForStudent'; // Giả sử WeeklyCalendarForStudent ở đây
import ScheduleFilterBar from './ScheduleFilterBar'; // Component thanh bộ lọc mới
import StudentDashboardSidebar from './StudentDashboardSidebar'; // Component sidebar mới

function StudentSchedules() {
    return (
        <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={{ xs: 1, md: 3 }}>
                {/* Left Sidebar for Filters and Overview */}
                <Grid item xs={12} md={3}>
                    <StudentDashboardSidebar />
                </Grid>

                {/* Main Content Area for Calendar and Controls */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
                            Lịch học của tôi
                        </Typography>
                        {/* Optional: Add a quick overview here if not in sidebar */}
                        <Typography variant="subtitle1" color="text.secondary">
                            Xem lịch học chi tiết theo tuần.
                        </Typography>
                    </Box>

                    {/* Filter Bar above the calendar */}
                    <Paper elevation={1} sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
                        <ScheduleFilterBar />
                    </Paper>

                    {/* Weekly Calendar Component */}
                    <WeeklyCalendarForStudent />
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentSchedules;