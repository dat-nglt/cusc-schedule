import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    IconButton,
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
    getDay,
    getDate
} from 'date-fns';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTimetable } from '../../contexts/TimetableContext';

const CalendarWithWeekHighlight = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekRange, setWeekRange] = useState([]);
    const { currentDate, setCurrentDate } = useTimetable();

    const processDate = (date) => {
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

        setSelectedDate(date); // Nếu bạn muốn cập nhật cả selectedDate
        setWeekRange(daysInWeek);
        setCurrentDate(weekStart); // nếu cần chuẩn hóa lại
    };


    // Xử lý khi chọn ngày
    const handleDateClick = (date) => {
        processDate(date);
    };

    useEffect(() => {
        if (currentDate) {
            processDate(currentDate);
        }
    }, [currentDate]);

    // Chuyển tháng
    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    // Chuyển năm
    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value);
        setCurrentDate(setYear(currentDate, newYear));
    };

    // Lấy các ngày trong tháng và sắp xếp theo tuần
    const getCalendarDays = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

        // Tạo mảng 6 tuần x 7 ngày (42 ô)
        const weeks = [];
        let currentWeek = Array(7).fill(null);

        daysInMonth.forEach(day => {
            const dayOfWeek = getDay(day) === 0 ? 6 : getDay(day) - 1; // Chuyển Chủ nhật (0) thành 6

            if (getDate(day) === 1 && dayOfWeek !== 0) {
                // Ngày đầu tháng không phải Thứ 2
                currentWeek = Array(7).fill(null);
            }

            currentWeek[dayOfWeek] = day;

            if (dayOfWeek === 6 || getDate(day) === daysInMonth.length) {
                // Kết thúc tuần hoặc ngày cuối tháng
                weeks.push([...currentWeek]);
                currentWeek = Array(7).fill(null);
            }
        });

        return weeks;
    };

    // Kiểm tra ngày có trong tuần được chọn
    const isInSelectedWeek = (date) => {
        return date && weekRange.some(day => isSameDay(day, date));
    };

    // Kiểm tra ngày có phải ngày được chọn
    const isSelectedDate = (date) => {
        return date && isSameDay(date, selectedDate);
    };

    // Tên các ngày trong tuần
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    // Tạo danh sách năm để chọn (10 năm trước đến 10 năm sau)
    const currentYear = getYear(currentDate);
    const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

    // Lấy các tuần trong tháng
    const weeks = getCalendarDays();

    return (
        <Paper elevation={3} sx={{ p: 2, maxWidth: 500, minHeight: 335 }}>
            {/* Header với điều khiển tháng/năm */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handlePrevMonth}>
                    <ChevronLeft />
                </IconButton>

                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {format(currentDate, 'MMMM')}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ p: '0 5px', minWidth: 100, textTransform: 'none' }}
                    >
                        <select
                            value={currentYear}
                            onChange={handleYearChange}
                            style={{
                                border: 'none',
                                fontSize: '1rem',
                                color: 'inherit',
                                padding: '0.5rem',
                                backgroundColor: 'transparent',
                                textAlign: 'center',
                                outline: 'none',
                            }}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </Button>
                </Box>

                <IconButton onClick={handleNextMonth}>
                    <ChevronRight />
                </IconButton>
            </Box>

            {/* Tên các ngày trong tuần */}
            <Grid container columns={7} justifyContent="space-around" spacing={1} sx={{ mb: 1 }}>
                {dayNames.map((day) => (
                    <Grid item xs={1} key={day}>
                        <Typography variant="body2" align="center" fontWeight="bold">
                            {day}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Các ngày trong lịch */}
            {weeks.map((week, weekIndex) => (
                <Grid container columns={7} justifyContent="space-around" spacing={1} key={weekIndex}>
                    {week.map((day, dayIndex) => {
                        if (!day) {
                            return (
                                <Grid item xs={1} key={dayIndex}>
                                    <Box sx={{ minWidth: 30, minHeight: 36 }} />
                                </Grid>
                            );
                        }

                        const dayIsInSelectedWeek = isInSelectedWeek(day);
                        const dayIsSelected = isSelectedDate(day);

                        return (
                            <Grid item xs={1} key={dayIndex}>
                                <Button
                                    fullWidth
                                    onClick={() => handleDateClick(day)}
                                    sx={{
                                        minWidth: 30,
                                        minHeight: 36,
                                        p: 0,
                                        borderRadius: 1,
                                        textAlign: 'center',
                                        backgroundColor: dayIsInSelectedWeek
                                            ? 'primary.main'
                                            : 'transparent',
                                        color: dayIsInSelectedWeek ? 'white' : 'inherit',
                                        '&:hover': {
                                            backgroundColor: dayIsSelected
                                                ? 'primary.dark'
                                                : dayIsInSelectedWeek
                                                    ? 'primary.light'
                                                    : 'action.hover',
                                        },
                                        border: dayIsSelected ? '2px solid' : 'none',
                                        borderColor: dayIsSelected ? 'primary.dark' : 'none',
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight={dayIsInSelectedWeek ? 'bold' : 'normal'}>
                                        {format(day, 'd')}
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

export default CalendarWithWeekHighlight;