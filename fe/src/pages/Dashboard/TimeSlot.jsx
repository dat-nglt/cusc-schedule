import {
    Box,
    useTheme,
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Today,
    Add,
    FileDownload,
    PostAdd
} from '@mui/icons-material';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { useDrop } from 'react-dnd';
import ScheduleItem from './ScheduleItem';

function TimeSlot({ day, hour, date, onDrop, scheduleItems }) {
    const theme = useTheme()
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
                minHeight: '170px',
                minWidth: { xs: '60px', sm: '100px', md: '120px', lg: '150px' },
                backgroundColor: theme.palette.background.paper,
                padding: '4px',
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {itemsInSlot.map(item => (
                <ScheduleItem key={item.id} item={item} onDrop={onDrop} />
            ))}
        </Box>
    );
}

export default TimeSlot;