import { format } from 'date-fns';

// Mapping slot_id to time periods
export const SLOT_TIME_MAP = {
    "S1": { start: "07:00", end: "09:00", type: "morning" },
    "S2": { start: "09:00", end: "11:00", type: "morning" },
    "C1": { start: "13:00", end: "15:00", type: "afternoon" },
    "C2": { start: "15:00", end: "17:00", type: "afternoon" },
    "T1": { start: "17:30", end: "19:30", type: "evening" },
    "T2": { start: "19:30", end: "21:30", type: "evening" }
};

// Transform API schedule data for WeeklyCalendar component
export const transformScheduleForCalendar = (scheduleItems) => {
    if (!Array.isArray(scheduleItems)) {
        console.warn('scheduleItems is not an array:', scheduleItems);
        return [];
    }

    return scheduleItems.map(item => {
        const slotInfo = SLOT_TIME_MAP[item.slot_id];

        if (!slotInfo) {
            console.warn('Unknown slot_id:', item.slot_id);
            return null;
        }

        // Create full datetime strings for startTime and endTime
        const startTime = `${item.date}T${slotInfo.start}:00`;
        const endTime = `${item.date}T${slotInfo.end}:00`;

        return {
            id: item.class_schedule_id,
            subject: item.subject?.subject_name || 'Unknown Subject',
            room: item.room?.room_id || 'Unknown room',
            lecturer: item.lecturer?.name || 'Unknown Lecturer',
            type: getSubjectType(item.notes), // Extract type from notes or determine from other fields
            startTime: startTime,
            endTime: endTime,
            date: item.date,
            slot_id: item.slot_id,
            semester: item.semester?.semester_name || '',
            class_name: item.class?.class_name || '',
            program: item.program?.program_name || '',
            status: item.status,
            notes: item.notes
        };
    }).filter(item => item !== null); // Remove null items
};

// Extract subject type from notes or determine based on other criteria
export const getSubjectType = (notes) => {
    if (!notes) return 'Lý thuyết';

    const notesLower = notes.toLowerCase();

    if (notesLower.includes('thực hành') || notesLower.includes('lab') || notesLower.includes('practice')) {
        return 'Thực hành';
    } else if (notesLower.includes('seminar') || notesLower.includes('thảo luận')) {
        return 'Seminar';
    } else {
        return 'Lý thuyết';
    }
};

// Get day of week from date string (0 = Monday, 6 = Sunday)
export const getDayOfWeekFromDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    // Convert Sunday (0) to 6, and shift other days
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
};

// Format display time for schedule items
export const formatScheduleTime = (slot_id) => {
    const slotInfo = SLOT_TIME_MAP[slot_id];
    if (!slotInfo) return 'Unknown Time';

    return `${slotInfo.start} - ${slotInfo.end}`;
};

// Get hour from slot_id for calendar grid positioning
export const getHourFromSlotId = (slot_id) => {
    const slotInfo = SLOT_TIME_MAP[slot_id];
    if (!slotInfo) return 7; // Default to 7 AM

    const hour = parseInt(slotInfo.start.split(':')[0]);
    return hour;
};

// Check if schedule item falls on specific day and hour
export const isScheduleItemInTimeSlot = (scheduleItem, targetDate, targetHour) => {
    if (!scheduleItem || !scheduleItem.date || !scheduleItem.slot_id) {
        return false;
    }

    // Check if dates match
    const itemDate = new Date(scheduleItem.date);
    const itemDateString = format(itemDate, 'yyyy-MM-dd');
    const targetDateString = format(targetDate, 'yyyy-MM-dd');

    if (itemDateString !== targetDateString) {
        return false;
    }

    // Check if hour matches
    const itemHour = getHourFromSlotId(scheduleItem.slot_id);
    return itemHour === targetHour;
};
