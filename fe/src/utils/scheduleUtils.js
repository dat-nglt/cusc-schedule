1; // src/utils/scheduleUtils.js

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
