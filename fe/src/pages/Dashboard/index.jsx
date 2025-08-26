import { useState, useEffect, useContext } from 'react';
import {
    Box,
} from '@mui/material';
import WeeklyCalendar from './WeeklyCalendar';
import QuickStats from './QuickStats';
import { io } from 'socket.io-client';
import { generateSchedule, stopScheduleGeneration } from '../../api/scheduleAPI';
import ProgressModal from './ProgressModal';
import { toast } from 'react-toastify';
import { getAllSchedulesAPI } from '../../api/classscheduleAPI';
import CreateSchedulesAutoModal from './CreateSchedulesAutoModal';
import { ScheduleContext } from '../../contexts/ScheduleContext';


const Dashboard = () => {
    // Lấy giá trị từ ScheduleContext
    const { filterOption, filterValue } = useContext(ScheduleContext);

    const [open, setOpen] = useState(false);
    const [createScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [scheduleItems, setScheduleItems] = useState();
    const [filteredScheduleItems, setFilteredScheduleItems] = useState();

    const fetchClassSchedule = async () => {
        setError(null);
        try {
            const response = await getAllSchedulesAPI();
            if (response && response.data) {
                setScheduleItems(response.data);
            } else {
                setScheduleItems([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải thời khóa biểu:", error);
            setError("Không thể tải thời khóa biểu. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        fetchClassSchedule();
    }, []);

    // Logic lọc đã được cập nhật
    useEffect(() => {
        if (!scheduleItems) {
            setFilteredScheduleItems([]);
            return;
        }

        if (!filterOption || !filterValue) {
            setFilteredScheduleItems(scheduleItems);
            return;
        }

        const filtered = scheduleItems.filter(item => {
            switch (filterOption) {
                case 'classes':
                    // Sửa lại để truy cập item.class.class_id
                    return item.class && item.class.class_id === filterValue;
                case 'rooms':
                    // Sửa lại để truy cập item.room.room_id
                    return item.room && item.room.room_id === filterValue;
                case 'lecturers':
                    // Sửa lại để truy cập item.lecturer.lecturer_id
                    return item.lecturer && item.lecturer.lecturer_id === filterValue;
                default:
                    return true;
            }
        });

        setFilteredScheduleItems(filtered);

    }, [scheduleItems, filterOption, filterValue]);

    const handleItemMove = (itemId, newStartTime) => {
        setScheduleItems(prevItems =>
            prevItems.map(item =>
                item.class_schedule_id === itemId
                    ? { ...item, date: newStartTime.toISOString().split('T')[0], slot_id: newStartTime.slot_id }
                    : item
            )
        );
    };

    const stats = {
        classes: 42,
        teachers: 28,
        rooms: 15,
        course: 15,
        conflicts: 3
    };

    return (
        <Box sx={{ p: 1, zIndex: 10 }}>
            <ProgressModal
                open={open}
                value={progress}
                message={statusMessage}
            />
            <QuickStats stats={stats} />
            <Box sx={
                {
                    width: 'calc(100vw - 400px)',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    mb: 3
                }
            }>
                <WeeklyCalendar
                    initialDate={new Date()}
                    scheduleItems={filteredScheduleItems}
                    onItemMove={handleItemMove}
                    onCreateNewSchedule={() => setCreateScheduleModalOpen(true)}
                    programs={programs}
                    rooms={rooms}
                    lecturers={lecturers}
                    classes={classes}
                />
            </Box>
        </Box>
    );
};

export default Dashboard;