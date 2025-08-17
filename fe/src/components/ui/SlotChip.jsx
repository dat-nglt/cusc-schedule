import { Chip } from "@mui/material";

// Hàm format slot thành tiết học và thời gian
export const formatSlotWithTime = (slotId) => {
    if (!slotId) return '-';

    const slotMapping = {
        'S1': 'Tiết 1 (07:00 - 09:00)',
        'S2': 'Tiết 2 (09:00 - 11:00)',
        'C1': 'Tiết 3 (13:00 - 15:00)',
        'C2': 'Tiết 4 (15:00 - 17:00)',
        'T1': 'Tiết 5 (17:30 - 19:30)',
        'T2': 'Tiết 6 (19:30 - 21:30)',
    };

    return slotMapping[slotId] || slotId;
};

// Hàm chỉ lấy số tiết
export const getSlotNumber = (slotId) => {
    if (!slotId) return '-';

    const slotNumbers = {
        'S1': '1',
        'S2': '2',
        'C1': '3',
        'C2': '4',
        'T1': '5',
        'T2': '6',
    };

    return slotNumbers[slotId] || slotId;
};

// Hàm chỉ lấy thời gian
export const getSlotTime = (slotId) => {
    if (!slotId) return '-';

    const slotTimes = {
        'S1': '07:00 - 09:00',
        'S2': '09:30 - 11:30',
        'C1': '13:00 - 15:00',
        'C2': '15:30 - 17:30',
        'T1': '18:00 - 20:00',
        'T2': '20:30 - 22:30',
    };

    return slotTimes[slotId] || slotId;
};