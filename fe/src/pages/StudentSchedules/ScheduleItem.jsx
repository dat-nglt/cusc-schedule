import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { formatScheduleTime } from '../../utils/scheduleUtils';

const ScheduleItem = ({ item }) => {
    const theme = useTheme();

    // Định nghĩa màu sắc dựa trên type hoặc một thuộc tính khác
    // Đây là một ví dụ đơn giản, bạn có thể mở rộng logic này
    const getColorForType = (type) => {
        switch (type) {
            case 'theory':
                return theme.palette.info.main; // A calm blue
            case 'practice':
                return theme.palette.success.main; // A vibrant green
            default:
                return theme.palette.primary.main; // Default theme color
        }
    };

    const itemAccentColor = getColorForType(item.type);
    // Create a light background using the accent color with transparency
    const bgColor = alpha(itemAccentColor, theme.palette.mode === 'light' ? 0.15 : 0.25);
    // Text color for main titles and bold labels will be the accent color
    const primaryTextColor = itemAccentColor;
    // Text color for details, using theme's secondary text color for readability
    // const secondaryTextColor = theme.palette.text.secondary;

    // Format times for display using slot_id
    const formattedTime = item.slot_id ? formatScheduleTime(item.slot_id) : 'N/A';

    return (
        <Box
            sx={{
                backgroundColor: bgColor,
                borderLeft: `6px solid ${itemAccentColor}`, // Prominent left border for accent
                borderRadius: 1, // More rounded corners for a softer look
                padding: '10px 15px', // Increased padding for more breathing room
                margin: '4px 0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: '95px', // Ensure enough space for content
                boxShadow: theme.shadows[2], // Deeper shadow when dragging
                transition: 'all 0.3s ease-in-out', // Smooth transitions for all properties
                opacity: 1, // Slight opacity change when dragging
                cursor: 'grab', // Indicate draggable item
                '&:hover': {
                    transform: 'scale(1.1)', // More noticeable lift on hover
                    boxShadow: theme.shadows[4], // Enhanced shadow on hover
                },
                // Add a subtle border for general definition, if desired
                // border: `1px solid ${alpha(itemAccentColor, 0.3)}`, 
            }}
        >
            <Typography
                variant="body1" // Slightly larger font for the course title
                fontWeight="bold"
                sx={{
                    mb: 0.7, // More margin below the title
                    lineHeight: 1.3,
                    color: primaryTextColor, // Use accent color for the main title
                }}
            >
                {item.subject}
            </Typography>
            {/* Details with secondary text color and bold labels using accent color */}
            <Typography variant="subtitle2" sx={{ mb: 0.3, lineHeight: 1.4, color: 'primary' }}>
                {formattedTime}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 0.3, lineHeight: 1.4, color: theme.palette.text.primary }}>
                <Typography component="span" sx={{ color: primaryTextColor }}>Phòng:</Typography> {item.room}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 0.3, lineHeight: 1.4, color: 'primary' }}>
                <Typography component="span" sx={{ color: primaryTextColor }}>GV:</Typography> {item.lecturer}
            </Typography>
            {/* <Typography variant="subtitle2" sx={{ lineHeight: 1.4, color: 'primary' }}>
                <Typography component="span" sx={{ color: primaryTextColor }}>Loại:</Typography> {item.type}
            </Typography> */}
        </Box>
    );
};

export default ScheduleItem;