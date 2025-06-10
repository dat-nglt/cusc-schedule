// components/WeeklyCalendar/ScheduleItem.jsx
import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useDrag } from 'react-dnd';

const ScheduleItem = ({ item, onDrop }) => {
    const theme = useTheme();

    // Define colors for each type, using theme's palette for consistency
    const getColorForType = (type) => {
        switch (type) {
            case 'Lý thuyết':
                return theme.palette.info.main; // A calm blue
            case 'Thực hành':
                return theme.palette.success.main; // A vibrant green
            case 'Seminar':
                return theme.palette.warning.main; // A warm orange/yellow
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

    // Format times for display
    const formattedStartTime = item.startTime ? format(parseISO(item.startTime), 'HH:mm') : 'N/A';
    const formattedEndTime = item.endTime ? format(parseISO(item.endTime), 'HH:mm') : 'N/A';

    // React DND hook for drag functionality
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'SCHEDULE_ITEM',
        item: { id: item.id },
        end: (draggedItem, monitor) => {
            // Only call onDrop if the item was successfully dropped on a valid target
            if (monitor.didDrop()) {
                onDrop(draggedItem.id, monitor.getDropResult());
            }
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <Box
            ref={drag} // Attach the drag ref to the Box component
            sx={{
                flex: 1,
                backgroundColor: bgColor,
                borderLeft: `6px solid ${itemAccentColor}`, // Prominent left border for accent
                borderRadius: 1, // More rounded corners for a softer look
                padding: '10px 15px', // Increased padding for more breathing room
                margin: '4px 0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: '95px', // Ensure enough space for content
                boxShadow: isDragging ? theme.shadows[6] : theme.shadows[2], // Deeper shadow when dragging
                transition: 'all 0.3s ease-in-out', // Smooth transitions for all properties
                opacity: isDragging ? 0.7 : 1, // Slight opacity change when dragging
                cursor: 'grab', // Indicate draggable item
                '&:hover': {
                    transform: isDragging ? 'none' : 'scale(1.1)', // More noticeable lift on hover
                    boxShadow: isDragging ? theme.shadows[6] : theme.shadows[4], // Enhanced shadow on hover
                },
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
                {item.course}
            </Typography>
            {/* Details with secondary text color and bold labels using accent color */}
            <Typography variant="subtitle2" sx={{ mb: 0.3, lineHeight: 1.4, color: theme.palette.text.primary }}>
                <Typography component="span" sx={{ color: primaryTextColor }}>Phòng:</Typography> {item.room}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 0.3, lineHeight: 1.4, color: 'primary' }}>
                <Typography component="span" sx={{ color: primaryTextColor }}>GV:</Typography> {item.lecturer}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 0.3, lineHeight: 1.4, color: 'primary' }}>
                <Typography component="span" sx={{ color: primaryTextColor }}>Giờ:</Typography> {formattedStartTime} - {formattedEndTime}
            </Typography>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.4, color: 'primary' }}>
                <Typography component="span" sx={{ color: primaryTextColor }}>Loại:</Typography> {item.type}
            </Typography>
        </Box>
    );
};

export default ScheduleItem;