import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    useMediaQuery,
    useTheme,
    Modal // Import Modal component
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Today, // We'll repurpose this for opening the modal
    Add,
    FileDownload,
    PostAdd
} from '@mui/icons-material';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTimetable } from '../../contexts/TimetableContext';

// Import the new CalendarModal component
import CalendarModal from './CalendarModal'; // Adjust path as necessary

// Constants (remain the same)
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7h - 22h
const DAYS = Array.from({ length: 7 }, (_, i) => i); // 0-6 (Monday-Sunday)

// Schedule Item Component (remains the same)
const ScheduleItem = ({ item }) => {
    return (
        <Box
            sx={{
                backgroundColor: '#4a90e2',
                color: 'white',
                borderRadius: '4px',
                padding: '4px 8px',
                margin: '2px 0',
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
        >
            {item.course} - {item.room}
        </Box>
    );
};

// Time Slot Component (remains the same)
const TimeSlot = ({ day, hour, date, scheduleItems }) => {
    const theme = useTheme();

    const slotDate = addDays(date, day);

    const itemsInSlot = scheduleItems.filter(item =>
        isSameDay(parseISO(item.startTime), slotDate) &&
        format(parseISO(item.startTime), 'H') === hour.toString()
    );

    return (
        <Box
            sx={{
                border: '1px solid #e0e0e0',
                minHeight: '60px',
                minWidth: { xs: '60px', sm: '100px', md: '120px', lg: '150px' },
                backgroundColor: theme.palette.background.paper,
                padding: '4px',
                overflow: 'hidden',
            }}
        >
            {itemsInSlot.map(item => (
                <ScheduleItem key={item.id} item={item} />
            ))}
        </Box>
    );
};

// Main Component
const WeeklyCalendar = ({
    initialDate = new Date(), // This prop might become less crucial if currentDate is primary
    scheduleItems = [],
    onAddNew
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const { currentDate, setCurrentDate, selectedDateByWeekly } = useTimetable();

    const [weekDays, setWeekDays] = useState([]);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false); // State for modal

    // Ensure currentDate from context is initialized to a Monday for week-based display
    useEffect(() => {
        if (!currentDate) {
            setCurrentDate(startOfWeek(initialDate, { weekStartsOn: 1 }));
        }
    }, [currentDate, initialDate, setCurrentDate]);


    useEffect(() => {
        if (currentDate) { // Only update weekDays if currentDate is set
            const newWeekDays = DAYS.map(day => {
                const date = addDays(currentDate, day);
                return {
                    day,
                    name: format(date, 'EEEE', { locale: vi }),
                    shortName: format(date, 'EEE', { locale: vi }),
                    date: format(date, 'dd/MM'),
                    fullDate: date
                };
            });
            setWeekDays(newWeekDays);
        }
    }, [currentDate]);

    const handlePrevWeek = () => {
        const newDate = addDays(currentDate, -7);
        setCurrentDate(newDate);
        selectedDateByWeekly(newDate); // Call with the new date
    };

    const handleNextWeek = () => {
        const newDate = addDays(currentDate, 7);
        setCurrentDate(newDate);
        selectedDateByWeekly(newDate); // Call with the new date
    };

    // This now opens the modal
    const handleToday = () => {
        setIsCalendarModalOpen(true);
    };

    // Callback when a date is selected in the modal
    const handleDateSelectedFromModal = (date) => {
        setCurrentDate(startOfWeek(date, { weekStartsOn: 1 })); // Set the WeeklyCalendar to the start of the selected date's week
        selectedDateByWeekly(startOfWeek(date, { weekStartsOn: 1 })); // Notify context
        setIsCalendarModalOpen(false); // Close the modal
    };

    return (
        <Paper elevation={2} sx={{
            p: { xs: 1, sm: 3 },
            height: '100%',
            overflow: 'auto',
            flex: 1,
            maxWidth: '100vw'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 1,
                mb: 2
            }}>
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {isMobile ? (
                        `Tuần ${currentDate ? format(currentDate, 'dd/MM') : ''} - ${currentDate ? format(addDays(currentDate, 6), 'dd/MM') : ''}`
                    ) : (
                        `Lịch học tuần ${currentDate ? format(currentDate, 'dd/MM/yyyy') : ''} - ${currentDate ? format(addDays(currentDate, 6), 'dd/MM/yyyy') : ''}`
                    )}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    alignSelf: { xs: 'flex-end', sm: 'center' }
                }}>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<Add fontSize="small" />}
                                onClick={onAddNew}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 2,
                                    minWidth: 'max-content',
                                    whiteSpace: 'nowrap'
                                }}
                                size={isTablet ? 'small' : 'medium'}
                            >
                                Thêm lịch
                            </Button>

                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<PostAdd fontSize="small" />}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 2,
                                    minWidth: 'max-content',
                                    whiteSpace: 'nowrap',
                                    display: { xs: 'none', sm: 'inline-flex' }
                                }}
                                size={isTablet ? 'small' : 'medium'}
                            >
                                Tạo lịch mới
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileDownload fontSize="small" />}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    px: 2,
                                    minWidth: 'max-content',
                                    whiteSpace: 'nowrap',
                                    display: { xs: 'none', sm: 'inline-flex' }
                                }}
                                size={isTablet ? 'small' : 'medium'}
                            >
                                Xuất báo cáo
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
                        <IconButton onClick={handlePrevWeek} size={isMobile ? 'small' : 'medium'}>
                            <ChevronLeft fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>

                        {/* This button now opens the modal */}
                        <IconButton onClick={handleToday} size={isMobile ? 'small' : 'medium'}>
                            <Today fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>

                        <IconButton onClick={handleNextWeek} size={isMobile ? 'small' : 'medium'}>
                            <ChevronRight fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {isMobile && (
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAddNew}
                    sx={{
                        textTransform: 'none',
                        mb: 2,
                        width: '100%'
                    }}
                    size="small"
                >
                    Thêm lịch
                </Button>
            )}

            <Box sx={{
                display: 'grid',
                maxHeight: 'calc(100vh - 350px)',
                gridTemplateColumns: {
                    xs: '50px repeat(7, minmax(60px, 1fr))',
                    sm: '60px repeat(7, minmax(100px, 1fr))',
                    md: '70px repeat(7, minmax(120px, 1fr))',
                    lg: '80px repeat(7, minmax(150px, 1fr))'
                },
                gap: '1px',
                backgroundColor: (theme) => theme.palette.divider,
                border: '1px solid',
                borderColor: (theme) => theme.palette.divider,
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                    height: '6px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    borderRadius: '3px'
                }
            }}>
                {/* Empty corner */}
                <Box sx={{
                    backgroundColor: (theme) => theme.palette.background.default,
                    padding: '8px',
                    textAlign: 'center',
                    position: 'sticky',
                    left: 0,
                    zIndex: 2,
                    borderRight: '1px solid',
                    borderBottom: '1px solid',
                    borderColor: (theme) => theme.palette.divider
                }} />

                {/* Day headers */}
                {weekDays.map((day) => (
                    <Box key={day.day} sx={{
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                            ? theme.palette.grey[800]
                            : theme.palette.grey[100],
                        padding: '8px',
                        textAlign: 'center',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        minWidth: { xs: '60px', sm: '100px' },
                        borderBottom: '1px solid',
                        borderColor: (theme) => theme.palette.divider
                    }}>
                        <Typography variant="subtitle2" sx={{
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            color: (theme) => theme.palette.text.primary
                        }}>
                            {isMobile ? day.shortName : day.name}
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontSize: { xs: '0.6rem', sm: '0.75rem' },
                            color: (theme) => theme.palette.text.secondary
                        }}>
                            {day.date}
                        </Typography>
                    </Box>
                ))}

                {/* Time slots */}
                {HOURS.map((hour) => (
                    <React.Fragment key={hour}>
                        <Box sx={{
                            backgroundColor: (theme) => theme.palette.mode === 'dark'
                                ? theme.palette.grey[800]
                                : theme.palette.grey[100],
                            padding: '4px',
                            textAlign: 'center',
                            position: 'sticky',
                            left: 0,
                            zIndex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRight: '1px solid',
                            borderColor: (theme) => theme.palette.divider
                        }}>
                            <Typography variant="caption" sx={{
                                fontSize: { xs: '0.6rem', sm: '0.75rem' },
                                color: (theme) => theme.palette.text.secondary
                            }}>
                                {hour}:00
                            </Typography>
                        </Box>

                        {weekDays.map((day) => (
                            <TimeSlot
                                key={`${day.day}-${hour}`}
                                day={day.day}
                                hour={hour}
                                date={currentDate}
                                scheduleItems={scheduleItems}
                                sx={{
                                    backgroundColor: (theme) => theme.palette.background.paper,
                                }}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </Box>

            {/* Calendar Modal */}
            <Modal
                open={isCalendarModalOpen}
                onClose={() => setIsCalendarModalOpen(false)}
                aria-labelledby="calendar-modal-title"
                aria-describedby="calendar-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CalendarModal
                    onSelectDate={handleDateSelectedFromModal}
                    initialDate={currentDate || new Date()} // Pass current displayed date to modal
                />
            </Modal>
        </Paper>
    );
};

export default WeeklyCalendar;