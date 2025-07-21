import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    useMediaQuery,
    useTheme,
    Tooltip,
    alpha
} from '@mui/material';
import {
    ChevronLeft,
    ArrowForward,
    ArrowBack,
    Today,
    Add,
    FileDownload,
    PostAdd,
    Schedule
} from '@mui/icons-material';
import { format, startOfWeek, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useTimetable } from '../../contexts/TimetableContext';
import TimeSlot from './TimeSlot';

// Constants
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7h - 22h
const DAYS = Array.from({ length: 7 }, (_, i) => i); // 0-6 (Monday-Sunday)

const WeeklyCalendar = ({
    scheduleItems = [],
    onItemMove,
    onAddNew,
    onCreateNewSchedule,
    onExportReport
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const { currentDate, setCurrentDate } = useTimetable();
    const [weekDays, setWeekDays] = useState([]);

    useEffect(() => {
        const newWeekDays = DAYS.map(day => {
            const date = addDays(currentDate, day);
            return {
                day,
                name: format(date, 'EEEE', { locale: vi }),
                shortName: format(date, 'EEE', { locale: vi }),
                date: format(date, 'dd/MM'),
                fullDate: date,
                isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            };
        });
        setWeekDays(newWeekDays);
    }, [currentDate]);

    const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const handleToday = () => setCurrentDate(startOfWeek(new Date(), { weekStartsOn: 1 }));

    const handleDrop = (itemId, { day, hour, date }) => {
        const newDate = addDays(date, day);
        const newStartTime = format(newDate, 'yyyy-MM-dd') + `T${hour.toString().padStart(2, '0')}:00:00`;
        onItemMove(itemId, newStartTime);
    };

    const dndBackend = isMobile ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={dndBackend} options={{ enableMouseEvents: true }}>
            <Paper elevation={2} sx={{
                p: { xs: 1, sm: 2 },
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: '12px',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100%',
                minWidth: '99%'
            }}>
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 2,
                    flexShrink: 0
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule color="primary" />
                        <Typography variant="h6" fontWeight="600" sx={{
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            color: theme.palette.primary.main
                        }}>
                            {isMobile ? (
                                `Tuần ${format(currentDate, 'dd/MM')} - ${format(addDays(currentDate, 6), 'dd/MM')}`
                            ) : (
                                `Lịch học tuần ${format(currentDate, 'dd/MM/yyyy')} - ${format(addDays(currentDate, 6), 'dd/MM/yyyy')}`
                            )}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: { xs: 'space-between', sm: 'flex-end' }
                    }}>


                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Thêm lịch học">
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={onAddNew}
                                    size="small"
                                    sx={{
                                        minWidth: 'max-content',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {isMobile ? 'Thêm' : 'Thêm lịch'}
                                </Button>
                            </Tooltip>

                            {!isMobile && (
                                <>
                                    <Tooltip title="Tạo lịch học mới">
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            startIcon={<PostAdd />}
                                            onClick={onCreateNewSchedule}
                                            size="small"
                                        >
                                            Tạo mới
                                        </Button>
                                    </Tooltip>

                                    <Tooltip title="Xuất báo cáo">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<FileDownload />}
                                            onClick={onExportReport}
                                            size="small"
                                        >
                                            Xuất file
                                        </Button>
                                    </Tooltip>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Calendar Grid */}
                <Box sx={{
                    flexGrow: 1,
                    overflow: 'scroll',
                    maxHeight: "580px",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    position: 'relative'
                }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '50px repeat(7, minmax(80px, 1fr))',
                            sm: '50px repeat(7, minmax(120px, 1fr))',
                            md: '60px repeat(7, minmax(150px, 1fr))'
                        },
                        minWidth: 'fit-content',
                        backgroundColor: theme.palette.divider,
                        borderBottom: `1px solid ${theme.palette.divider}`
                    }}>
                        {/* Empty corner */}
                        <Box sx={{
                            position: 'sticky',
                            left: 0,
                            top: 0,
                            zIndex: 1000,
                            backgroundColor: theme.palette.divider,
                            borderRight: `1px solid ${theme.palette.divider}`
                        }}>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                                alignItems: 'center',
                            }}>
                                <Tooltip title="Tuần trước">
                                    <IconButton
                                        onClick={handlePrevWeek}
                                        size="small"
                                        sx={{
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                                            }
                                        }}
                                    >
                                        <ArrowBack fontSize="small" />
                                    </IconButton>
                                </Tooltip>

                                {/* <Button
                                    onClick={handleToday}
                                    size="small"
                                    variant="contained"
                                    sx={{
                                        minWidth: 0,
                                        px: 2,
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: 'none',
                                            bgcolor: theme.palette.primary.dark
                                        }
                                    }}
                                >
                                    Hôm nay
                                </Button> */}

                                <Tooltip title="Tuần sau">
                                    <IconButton
                                        onClick={handleNextWeek}
                                        size="small"
                                        sx={{
                                            color: theme.palette.primary.main,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                                            }
                                        }}
                                    >
                                        <ArrowForward fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Day headers */}
                        {weekDays.map((day) => (
                            <Box key={day.day} sx={{
                                backgroundColor: theme.palette.background.paper,
                                p: 1,
                                textAlign: 'center',
                                position: 'sticky',
                                top: 0,
                                zIndex: 2,
                                borderRight: `1px solid ${theme.palette.divider}`,
                                ...(day.isToday ? {
                                    backgroundColor: theme.palette.primary.dark,
                                    color: theme.palette.primary.contrastText
                                } : {
                                    backgroundColor: theme.palette.primary.light,
                                    color: theme.palette.primary.contrastText
                                })
                            }}>
                                <Typography variant="subtitle2" fontWeight="medium">
                                    {isMobile ? day.shortName : day.name}
                                </Typography>
                                <Typography variant="caption">
                                    {day.date}
                                </Typography>
                            </Box>
                        ))}

                        {/* Time slots */}
                        {HOURS.map((hour) => (
                            <React.Fragment key={hour}>
                                <Box sx={{
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 1,
                                    backgroundColor: theme.palette.primary.light, p: 0.5,
                                    color: theme.palette.primary.contrastText,
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    borderRight: `1px solid ${theme.palette.divider}`,
                                    borderBottom: `1px solid ${theme.palette.divider}`
                                }}>
                                    <Typography variant="caption" fontWeight="medium">
                                        {hour}:00
                                    </Typography>
                                </Box>

                                {weekDays.map((day) => (
                                    <TimeSlot
                                        key={`${day.day}-${hour}`}
                                        day={day.day}
                                        hour={hour}
                                        date={currentDate}
                                        onDrop={handleDrop}
                                        scheduleItems={scheduleItems}
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            borderRight: `1px solid ${theme.palette.divider}`,
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                            minHeight: '60px',
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover
                                            }
                                        }}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </Box>
                </Box>
            </Paper>
        </DndProvider>
    );
};

export default WeeklyCalendar;