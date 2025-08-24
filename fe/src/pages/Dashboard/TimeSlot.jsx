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
import { format, addDays } from 'date-fns';
import { useDrop } from 'react-dnd';
import ScheduleItem from './ScheduleItem';

function TimeSlot({ day, slotId, date, onDrop, scheduleItems }) {
    const theme = useTheme()
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'SCHEDULE_ITEM',
        drop: () => ({ day, slotId, date }),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const slotDate = addDays(date, day);

    const itemsInSlot = (scheduleItems || []).filter(item =>
        item.date === format(slotDate, 'yyyy-MM-dd') &&
        item.slot_id === slotId
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
            {/* Ensure ScheduleItem renders only string/number, not object */}
            {itemsInSlot.map(item => (
                <ScheduleItem
                    key={item.class_schedule_id}
                    item={{
                        ...item
                    }}
                    onDrop={onDrop}
                />
            ))}
        </Box>
    );
}

export default TimeSlot;