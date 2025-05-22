import React, { createContext, useState, useContext } from 'react';
import { startOfWeek } from 'date-fns';

const TimetableContext = createContext();

export const TimetableProvider = ({ children }) => {

    const [selectedDateByWeekly, setSeletedDateByWeekly] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    console.log(currentDate);

    return (
        <TimetableContext.Provider value={{ selectedDateByWeekly, setSeletedDateByWeekly, currentDate, setCurrentDate }}>
            {children}
        </TimetableContext.Provider>
    );
};

// Custom hook (gợi ý sử dụng)
export const useTimetable = () => useContext(TimetableContext);
