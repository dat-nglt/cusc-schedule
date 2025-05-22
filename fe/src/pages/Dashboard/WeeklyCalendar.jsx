import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Today,
    Add
} from '@mui/icons-material';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useTimetable } from '../../contexts/TimetableContext';

// Constants
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7h - 22h
const DAYS = Array.from({ length: 7 }, (_, i) => i); // 0-6 (Monday-Sunday)

// Schedule Item Component
const ScheduleItem = ({ item, onDrop }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'SCHEDULE_ITEM',
        item: { id: item.id },
        end: (draggedItem, monitor) => {
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
            ref={drag}
            sx={{
                backgroundColor: '#4a90e2',
                color: 'white',
                borderRadius: '4px',
                padding: '4px 8px',
                margin: '2px 0',
                fontSize: '0.8rem',
                cursor: 'move',
                opacity: isDragging ? 0.5 : 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}
        >
            {item.course} - {item.room}
        </Box>
    );
};

// Time Slot Component
const TimeSlot = ({ day, hour, date, onDrop, scheduleItems }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'SCHEDULE_ITEM',
        drop: () => ({ day, hour, date }),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const slotDate = addDays(date, day);
    const slotDateTime = parseISO(format(slotDate, 'yyyy-MM-dd') + `T${hour.toString().padStart(2, '0')}:00:00`);

    const itemsInSlot = scheduleItems.filter(item =>
        isSameDay(parseISO(item.startTime), slotDate) &&
        format(parseISO(item.startTime), 'H') === hour.toString()
    );

    return (
        <Box
            ref={drop}
            sx={{
                border: '1px solid #e0e0e0',
                minHeight: '60px',
                minWidth: { xs: '60px', sm: '100px', md: '120px', lg: '150px' },
                backgroundColor: isOver ? '#f5f5f5' : 'white',
                padding: '4px',
                overflow: 'hidden',
            }}
        >
            {itemsInSlot.map(item => (
                <ScheduleItem key={item.id} item={item} onDrop={onDrop} />
            ))}
        </Box>
    );
};

// Main Component
const WeeklyCalendar = ({
    initialDate = new Date(),
    scheduleItems = [],
    onItemMove,
    onAddNew
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const { currentDate, setCurrentDate, selectedDateByWeekly } = useTimetable();
    // const [currentDate, setCurrentDate] = useState(startOfWeek(initialDate, { weekStartsOn: 1 }));

    const [weekDays, setWeekDays] = useState([]);

    useEffect(() => {
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
    }, [currentDate]);

    const handlePrevWeek = () => {
        setCurrentDate(addDays(currentDate, -7));
        selectedDateByWeekly(currentDate);
    };
    
    const handleNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7));
        selectedDateByWeekly(currentDate);
    };

    useEffect(() => {

    }, [currentDate]);

    const handleToday = () => {
        setCurrentDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
    };

    const handleDrop = (itemId, { day, hour, date }) => {
        const newDate = addDays(date, day);
        const newStartTime = format(newDate, 'yyyy-MM-dd') + `T${hour.toString().padStart(2, '0')}:00:00`;
        onItemMove(itemId, newStartTime);
    };

    // Use touch backend for mobile devices
    const dndBackend = isMobile ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={dndBackend} options={{ enableMouseEvents: true }}>
            <Paper elevation={2} sx={{
                p: { xs: 1, sm: 2 },
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
                            `Tuần ${format(currentDate, 'dd/MM')} - ${format(addDays(currentDate, 6), 'dd/MM')}`
                        ) : (
                            `Lịch học tuần ${format(currentDate, 'dd/MM/yyyy')} - ${format(addDays(currentDate, 6), 'dd/MM/yyyy')}`
                        )}
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        alignSelf: { xs: 'flex-end', sm: 'center' }
                    }}>
                        {!isMobile && (
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={onAddNew}
                                sx={{ textTransform: 'none' }}
                                size={isTablet ? 'small' : 'medium'}
                            >
                                Thêm lịch
                            </Button>
                        )}

                        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
                            <IconButton onClick={handlePrevWeek} size={isMobile ? 'small' : 'medium'}>
                                <ChevronLeft fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>

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
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #e0e0e0',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        height: '6px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '3px'
                    }
                }}>
                    {/* Empty corner */}
                    <Box sx={{
                        backgroundColor: 'white',
                        padding: '8px',
                        textAlign: 'center',
                        position: 'sticky',
                        left: 0,
                        zIndex: 2
                    }} />

                    {/* Day headers */}
                    {weekDays.map((day) => (
                        <Box key={day.day} sx={{
                            backgroundColor: '#f5f5f5',
                            padding: '8px',
                            textAlign: 'center',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            minWidth: { xs: '60px', sm: '100px' }
                        }}>
                            <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                                {isMobile ? day.shortName : day.name}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                                {day.date}
                            </Typography>
                        </Box>
                    ))}

                    {/* Time slots */}
                    {HOURS.map((hour) => (
                        <React.Fragment key={hour}>
                            <Box sx={{
                                backgroundColor: '#f5f5f5',
                                padding: '4px',
                                textAlign: 'center',
                                position: 'sticky',
                                left: 0,
                                zIndex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
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
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </Box>
            </Paper>
        </DndProvider>
    );
};

export default WeeklyCalendar;