import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    IconButton,
    Select, // Added Select for year dropdown
    MenuItem, // Added MenuItem for year dropdown options
    FormControl, // Added FormControl for better select styling
} from '@mui/material';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    format,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    getYear,
    setYear,
    // getDay,
    // getDate,
} from 'date-fns';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
// import { useTimetable } from '../../contexts/TimetableContext';

const CalendarModal = ({ onSelectDate, initialDate = new Date() }) => {
    // We'll manage the internal calendar's displayed month/year with its own state.
    // The initialDate prop will set this when the modal opens.
    const [displayDate, setDisplayDate] = useState(initialDate);
    const [selectedDateInternal, setSelectedDateInternal] = useState(initialDate);
    const [weekRangeInternal, setWeekRangeInternal] = useState([]);


    useEffect(() => {
        // When the modal opens, ensure its internal state matches the initial date
        // from the parent (WeeklyCalendar's currentDate).
        setDisplayDate(initialDate);
        setSelectedDateInternal(initialDate);
        processDateInternal(initialDate);
    }, [initialDate]); // Re-run if initialDate changes (e.g., modal opens with new date)

    const processDateInternal = (date) => {
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

        setSelectedDateInternal(date);
        setWeekRangeInternal(daysInWeek);
    };

    // Handle clicking a date in the calendar
    const handleDateClick = (date) => {
        // When a date is clicked, update the internal state
        processDateInternal(date);
        // And then call the callback to notify the parent
        onSelectDate(date);
    };

    // Change month
    const handlePrevMonth = () => {
        setDisplayDate(subMonths(displayDate, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(addMonths(displayDate, 1));
    };

    // Change year
    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value);
        setDisplayDate(setYear(displayDate, newYear));
    };

    // Get days for the calendar grid
    const getCalendarDays = () => {
        const monthStart = startOfMonth(displayDate);
        const monthEnd = endOfMonth(displayDate);

        // Calculate the start of the first week (Monday of the week containing monthStart)
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        // Calculate the end of the last week (Sunday of the week containing monthEnd)
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

        const weeks = [];
        let currentWeek = [];

        daysInCalendar.forEach((day) => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });
        return weeks;
    };

    // Check if a day is within the currently highlighted week
    const isInSelectedWeek = (date) => {
        return date && weekRangeInternal.some(day => isSameDay(day, date));
    };

    // Check if a day is the specifically selected date
    const isSelectedDate = (date) => {
        return date && isSameDay(date, selectedDateInternal);
    };

    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const currentYear = getYear(displayDate);
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i); // 10 years back, current, 10 years forward

    const weeks = getCalendarDays();

    return (
        <Paper elevation={3} sx={{ p: 2, maxWidth: 500, minHeight: 335 }}>
            {/* Header with month/year controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handlePrevMonth}>
                    <ChevronLeft />
                </IconButton>

                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {format(displayDate, 'MMMM')}
                    </Typography>
                    <FormControl variant="outlined" size="small">
                        <Select
                            value={currentYear}
                            onChange={handleYearChange}
                            sx={{
                                border: 'none',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                paddingRight: '14px', // Adjust spacing for dropdown icon
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Limit height of dropdown list
                                    },
                                },
                            }}
                        >
                            {years.map(year => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <IconButton onClick={handleNextMonth}>
                    <ChevronRight />
                </IconButton>
            </Box>

            {/* Day names */}
            <Grid container columns={7} justifyContent="space-around" spacing={1} sx={{ mb: 1 }}>
                {dayNames.map((day) => (
                    <Grid item xs={1} key={day}>
                        <Typography variant="body2" align="center" fontWeight="bold">
                            {day}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Days in calendar */}
            {weeks.map((week, weekIndex) => (
                <Grid container columns={7} justifyContent="space-around" spacing={1} key={weekIndex}>
                    {week.map((day, dayIndex) => {
                        // Check if the day belongs to the current month being displayed
                        const isCurrentMonth = day && format(day, 'MM') === format(displayDate, 'MM');

                        return (
                            <Grid item xs={1} key={dayIndex}>
                                <Button
                                    fullWidth
                                    onClick={() => day && handleDateClick(day)} // Only clickable if day is not null
                                    sx={{
                                        minWidth: 30,
                                        minHeight: 36,
                                        p: 0,
                                        borderRadius: 1,
                                        textAlign: 'center',
                                        opacity: isCurrentMonth ? 1 : 0.4, // Dim days outside current month
                                        cursor: day ? 'pointer' : 'default', // No pointer if day is null
                                        backgroundColor: isInSelectedWeek(day)
                                            ? 'primary.main'
                                            : 'transparent',
                                        color: isInSelectedWeek(day) ? 'white' : 'inherit',
                                        '&:hover': {
                                            backgroundColor: isSelectedDate(day)
                                                ? 'primary.dark'
                                                : isInSelectedWeek(day)
                                                    ? 'primary.light'
                                                    : day ? 'action.hover' : 'transparent', // No hover effect for null days
                                        },
                                        border: isSelectedDate(day) ? '2px solid' : 'none',
                                        borderColor: isSelectedDate(day) ? 'primary.dark' : 'none',
                                    }}
                                    disabled={!day} // Disable button if day is null
                                >
                                    <Typography variant="subtitle2" fontWeight={isInSelectedWeek(day) ? 'bold' : 'normal'}>
                                        {day ? format(day, 'd') : ''}
                                    </Typography>
                                </Button>
                            </Grid>
                        );
                    })}
                </Grid>
            ))}
        </Paper>
    );
};

export default CalendarModal;
