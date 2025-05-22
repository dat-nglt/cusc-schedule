import React, { useState, useEffect } from 'react';
import {
    Paper,
    Box,
    Typography,
    IconButton,
    TextField,
    InputAdornment,
    ButtonGroup,
    Button
} from '@mui/material';
import {
    Today as TodayIcon,
    DateRange as DateRangeIcon,
    CalendarToday as CalendarIcon,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    format,
    startOfWeek,
    endOfWeek,
    addDays,
    isWithinInterval,
    addWeeks,
    isSameDay
} from 'date-fns';
import { vi } from 'date-fns/locale';

const DateSelector = ({
    initialDate = new Date(),
    onWeekChange,
    showWeekNavigation = true
}) => {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [weekRange, setWeekRange] = useState({
        start: startOfWeek(initialDate, { locale: vi }),
        end: endOfWeek(initialDate, { locale: vi })
    });

    // Update week range when selected date changes
    useEffect(() => {
        const start = startOfWeek(selectedDate, { locale: vi });
        const end = endOfWeek(selectedDate, { locale: vi });
        setWeekRange({ start, end });
        onWeekChange?.({ start, end });
    }, [selectedDate, onWeekChange]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today);
    };

    const handlePrevWeek = () => {
        setSelectedDate(prev => addWeeks(prev, -1));
    };

    const handleNextWeek = () => {
        setSelectedDate(prev => addWeeks(prev, 1));
    };

    // Generate week days for display
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const day = addDays(weekRange.start, i);
        return {
            date: day,
            formatted: format(day, 'EEE', { locale: vi }),
            isSelected: isSameDay(day, selectedDate)
        };
    });

    return (
        <Paper elevation={0} sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'background.default' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
            }}>
                <Typography variant="subtitle2" fontWeight="bold">
                    Lịch xem
                </Typography>

                <Box display="flex" alignItems="center">
                    {showWeekNavigation && (
                        <ButtonGroup size="small" sx={{ mr: 1 }}>
                            <Button onClick={handlePrevWeek}>
                                <ChevronLeft fontSize="small" />
                            </Button>
                            <Button onClick={handleNextWeek}>
                                <ChevronRight fontSize="small" />
                            </Button>
                        </ButtonGroup>
                    )}

                    <IconButton size="small" onClick={handleTodayClick}>
                        <TodayIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </LocalizationProvider>

            {/* Week days display */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
                mb: 1
            }}>
                {weekDays.map((day, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            borderRadius: '4px',
                            backgroundColor: day.isSelected ? 'primary.light' : 'transparent',
                            color: day.isSelected ? 'primary.main' : 'text.primary',
                            fontWeight: day.isSelected ? 'bold' : 'normal'
                        }}
                    >
                        <Typography variant="caption">{day.formatted}</Typography>
                        <Typography variant="body2">
                            {format(day.date, 'dd')}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                Tuần từ {format(weekRange.start, 'dd/MM')} đến {format(weekRange.end, 'dd/MM/yyyy')}
            </Typography>
        </Paper>
    );
};

export default DateSelector;