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
import ScheduleItem from '../../components/ui/ScheduleItem';

function TimeSlot({ day, hour, date, onDrop, scheduleItems }) {
    const theme = useTheme()
    const [, drop] = useDrop(() => ({
        accept: 'SCHEDULE_ITEM',
        drop: () => ({ day, hour, date }),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const slotDate = addDays(date, day);

    // Ensure scheduleItems is always an array
    const safeScheduleItems = Array.isArray(scheduleItems) ? scheduleItems : [];

    // Filter items based on date and hour matching
    const itemsInSlot = safeScheduleItems.filter(item => {
        if (!item.startTime) return false;

        try {
            const itemDate = parseISO(item.startTime);
            const itemHour = parseInt(format(itemDate, 'H'));

            return isSameDay(itemDate, slotDate) && itemHour === hour;
        } catch (error) {
            console.error('Error parsing schedule item date:', error, item);
            return false;
        }
    });

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