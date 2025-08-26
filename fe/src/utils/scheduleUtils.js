1; // src/utils/scheduleUtils.js
import { format } from 'date-fns';
export const SLOT_TIME_MAP = {
  "S1": { start: "07:00", end: "09:00", type: "morning" },
  "S2": { start: "09:00", end: "11:00", type: "morning" },
  "C1": { start: "13:00", end: "15:00", type: "afternoon" },
  "C2": { start: "15:00", end: "17:00", type: "afternoon" },
  "T1": { start: "17:30", end: "19:30", type: "evening" },
  "T2": { start: "19:30", end: "21:30", type: "evening" }
};

export const getDayName = (dayCode) => {
  const days = {
    Mon: "Thứ 2",
    Tue: "Thứ 3",
    Wed: "Thứ 4",
    Thu: "Thứ 5",
    Fri: "Thứ 6",
    Sat: "Thứ 7",
  };
  return days[dayCode] || dayCode;
};

export const getSlotLabel = (slotId) => {
  const slots = {
    S1: "S1 (7:00-9:00)",
    S2: "S2 (9:00-11:00)",
    C1: "C1 (13:00-15:00)",
    C2: "C2 (15:00-17:00)",
    T1: "T1 (17:30-19:30)",
    T2: "T2 (19:30-21:30)",
  };
  return slots[slotId] || slotId;
};

export const formatScheduleTime = (slot_id) => {
  const slotInfo = SLOT_TIME_MAP[slot_id];
  if (!slotInfo) return 'Unknown Time';

  return `${slotInfo.start} - ${slotInfo.end}`;
};

//===================
// Get hour from slot_id for calendar grid positioning
export const getHourFromSlotId = (slot_id) => {
  const slotInfo = SLOT_TIME_MAP[slot_id];
  if (!slotInfo) return 7; // Default to 7 AM

  const hour = parseInt(slotInfo.start.split(':')[0]);
  return hour;
};



//==================================
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