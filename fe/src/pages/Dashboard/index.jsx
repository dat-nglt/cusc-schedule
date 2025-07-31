import { useState } from 'react';
import {
    Box,
} from '@mui/material';
import WeeklyCalendar from './WeeklyCalendar';
import QuickStats from './QuickStats';
import { io } from 'socket.io-client';

import { useEffect } from 'react';
import { generateSchedule, getDownloadUrl, stopScheduleGeneration } from '../../api/scheduleAPI';
import ProgressModal from './ProgressModal';
import { toast } from 'react-toastify';
import { getAllLecturersAPI } from '../../api/lecturerAPI';
import { getAllSubjectsAPI } from '../../api/subjectAPI';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', { // Sử dụng biến môi trường cho Socket.IO
    withCredentials: true
});

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [downloadableFiles, setDownloadableFiles] = useState([]);
    const [error, setError] = useState('');
    const [gaLogs, setGaLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const actualInputData = {
        "classes": [
            {
                "class_id": "C01",
                "size": 30,
                "program_id": "P01"
            },
            {
                "class_id": "C02",
                "size": 25,
                "program_id": "P02"
            },
            {
                "class_id": "C03",
                "size": 28,
                "program_id": "P03"
            }
        ],
        "rooms": [
            {
                "room_id": "LT1",
                "type": "theory",
                "capacity": 40
            },
            {
                "room_id": "TH1",
                "type": "practice",
                "capacity": 30
            },
            {
                "room_id": "LT2",
                "type": "theory",
                "capacity": 50
            },
            {
                "room_id": "TH2",
                "type": "practice",
                "capacity": 35
            },
            {
                "room_id": "LT3",
                "type": "theory",
                "capacity": 45
            },
            {
                "room_id": "TH3",
                "type": "practice",
                "capacity": 25
            },
            {
                "room_id": "LT4",
                "type": "theory",
                "capacity": 60
            },
            {
                "room_id": "TH4",
                "type": "practice",
                "capacity": 40
            }
        ],
        "lecturers": [
            {
                "lecturer_id": "GV01",
                "lecturer_name": "Nguyễn Văn An",
                "subjects": [
                    "M01",
                    "M04",
                    "M05"
                ],
                "busy_slots": [
                    {
                        "day": "Mon",
                        "slot_id": "S1"
                    },
                    {
                        "day": "Wed",
                        "slot_id": "C1"
                    }
                ]
            },
            {
                "lecturer_id": "GV02",
                "lecturer_name": "Trần Thị Bình",
                "subjects": [
                    "M02",
                    "M03",
                    "M06"
                ],
                "busy_slots": [
                    {
                        "day": "Tue",
                        "slot_id": "C2"
                    },
                    {
                        "day": "Thu",
                        "slot_id": "T1"
                    }
                ]
            },
            {
                "lecturer_id": "GV03",
                "lecturer_name": "Phạm Minh Châu",
                "subjects": [
                    "M01",
                    "M02",
                    "M06"
                ],
                "busy_slots": [
                    {
                        "day": "Mon",
                        "slot_id": "S2"
                    },
                    {
                        "day": "Fri",
                        "slot_id": "T2"
                    }
                ]
            },
            {
                "lecturer_id": "GV04",
                "lecturer_name": "Lê Quốc Dũng",
                "subjects": [
                    "M03",
                    "M04"
                ],
                "busy_slots": [
                    {
                        "day": "Tue",
                        "slot_id": "S1"
                    },
                    {
                        "day": "Thu",
                        "slot_id": "S2"
                    }
                ]
            }
        ],
        "programs": [
            {
                "program_id": "P01",
                "duration": 15,
                "subjects": [
                    {
                        "subject_id": "M01",
                        "name": "Cấu trúc dữ liệu",
                        "theory_hours": 30,
                        "practice_hours": 15
                    },
                    {
                        "subject_id": "M02",
                        "name": "Thuật toán",
                        "theory_hours": 30,
                        "practice_hours": 15
                    }
                ]
            },
            {
                "program_id": "P02",
                "duration": 12,
                "subjects": [
                    {
                        "subject_id": "M03",
                        "name": "Cơ sở dữ liệu",
                        "theory_hours": 36,
                        "practice_hours": 12
                    },
                    {
                        "subject_id": "M04",
                        "name": "Mạng máy tính",
                        "theory_hours": 24,
                        "practice_hours": 12
                    }
                ]
            },
            {
                "program_id": "P03",
                "duration": 16,
                "subjects": [
                    {
                        "subject_id": "M05",
                        "name": "Trí tuệ nhân tạo",
                        "theory_hours": 40,
                        "practice_hours": 0
                    },
                    {
                        "subject_id": "M06",
                        "name": "Phát triển phần mềm",
                        "theory_hours": 30,
                        "practice_hours": 20
                    }
                ]
            }
        ],
        "time_slots": [
            {
                "slot_id": "S1",
                "start": "07:00",
                "end": "09:00",
                "type": "morning"
            },
            {
                "slot_id": "S2",
                "start": "09:00",
                "end": "11:00",
                "type": "morning"
            },
            {
                "slot_id": "C1",
                "start": "13:00",
                "end": "15:00",
                "type": "afternoon"
            },
            {
                "slot_id": "C2",
                "start": "15:00",
                "end": "17:00",
                "type": "afternoon"
            },
            {
                "slot_id": "T1",
                "start": "17:30",
                "end": "19:30",
                "type": "evening"
            },
            {
                "slot_id": "T2",
                "start": "19:30",
                "end": "21:30",
                "type": "evening"
            }
        ],
        "days_of_week": [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ]
    }

    useEffect(() => {
        // Lắng nghe các sự kiện trạng thái từ backend
        socket.on('ga_status', (data) => {

            setStatusMessage(data.message); // Cập nhật tin nhắn trạng thái
            setProgress(data.progress); // Cập nhật tiến độ

            switch (data.stage) {
                case 'START':
                case 'LOADING_DATA':
                case 'PROCESSING_DATA':
                case 'INITIALIZING_POPULATION':
                case 'RUNNING_GA':
                case 'GENERATING_SEMESTER_SCHEDULE':
                case 'EXPORTING_EXCEL':
                case 'GENERATING_VIEWS':
                case 'STOPPING': // Khi backend báo hiệu đang dừng
                    setOpen(true); // Mở dialog/hiển thị thanh tiến độ
                    break;
                case 'ABORTED': // Khi backend báo hiệu tiến trình đã bị hủy
                    setOpen(false); // Đóng dialog
                    toast.info('Tiến trình tạo thời khóa biểu đã bị hủy.');
                    setDownloadableFiles([]);
                    setError('');
                    break;
                case 'COMPLETED':
                    setOpen(false); // Đóng dialog
                    toast.success('Thời khóa biểu đã được tạo thành công!');
                    setDownloadableFiles([
                        ...(data.excelFiles || []), // Backend cần gửi kèm danh sách file trong trạng thái COMPLETED
                        ...(data.jsonFiles || [])
                    ]);
                    setError('');
                    break;
                case 'ERROR': // Khi có lỗi
                    setOpen(false); // Đóng dialog
                    toast.error('Đã xảy ra lỗi trong quá trình tạo thời khóa biểu.');
                    setError(data.message || 'Lỗi không xác định.');
                    setDownloadableFiles([]); // Xóa file tải về nếu lỗi
                    break;
                default:
                    break;
            }
        });

        socket.on('ga_log', (data) => {
            setGaLogs(prevLogs => [...prevLogs, data.message]);
        });

        socket.on('ga_error', (data) => {
            setOpen(false); // Đóng dialog/progress
            setError(data.message || 'Lỗi không xác định trong quá trình GA.');
            setStatusMessage('');
            setProgress(0);
            setDownloadableFiles([]); // Xóa file tải về nếu lỗi
            toast.error(data.message || 'Lỗi nghiêm trọng trong thuật toán GA!');
        });

        // Cleanup function
        return () => {
            socket.off('ga_status');
            socket.off('ga_log');
            socket.off('ga_error');
        };
    }, []); // Dependency array: đảm bảo lắng nghe lại khi socket thay đổi (thường không thay đổi)

    const handleGenerateTimetable = async () => {
        setStatusMessage('Đang gửi yêu cầu tạo thời khóa biểu...');
        setDownloadableFiles([]);
        setError('');
        setGaLogs([]);
        setProgress(0);
        setOpen(true); // Mở thanh tiến độ ngay lập tức

        try {
            // Gọi API để bắt đầu quá trình tạo lịch
            // Backend của bạn sẽ gửi các cập nhật qua Socket.IO sau đó
            const response = await generateSchedule(actualInputData);

            if (response.aborted) { // Xử lý nếu promise được resolve với trạng thái hủy
                toast.info("Yêu cầu tạo thời khóa biểu đã được hủy.");
                setOpen(false);
            } else if (response.error) { // Xử lý lỗi trả về từ API ngay lập tức
                setError(response.message || response.error);
                setStatusMessage('');
                setOpen(false);
                toast.error(response.message || "Có lỗi khi bắt đầu tiến trình.");
            }
        } catch (err) {
            console.error('Error initiating GA generation:', err);
            setError(err.message || 'Không thể kết nối hoặc lỗi mạng khi gửi yêu cầu.');
            setStatusMessage('');
            setOpen(false); // Đóng thanh tiến độ nếu có lỗi kết nối ban đầu
            toast.error(err.message || 'Lỗi kết nối đến server.');
        }
    };

    const handleStopTimetableGeneration = async () => {
        try {
            // Gọi API để gửi yêu cầu dừng
            await stopScheduleGeneration(); // Hàm này gửi POST request đến /api/stop-ga
            setStatusMessage('Đang yêu cầu dừng tiến trình...');
            // UI sẽ đợi thông báo 'ga_status' với stage 'ABORTED' từ backend
        } catch (err) {
            console.error('Error stopping GA generation:', err);
            setError(err.message || 'Không thể gửi yêu cầu dừng.');
            toast.error('Không thể gửi yêu cầu dừng tiến trình.');
        }
    };

    const handleDownload = (filename) => {
        // Lấy URL download từ API Service
        const downloadUrl = getDownloadUrl(filename);
        window.open(downloadUrl, '_blank');
    };


    const [scheduleItems, setScheduleItems] = useState([
        {
            id: '3',
            course: 'Hóa học cơ bản',
            room: 'P.102',
            lecturer: 'TS. Nguyễn Văn A',
            type: 'Lý thuyết',
            startTime: '2025-06-09T09:00:00',
            endTime: '2025-06-09T11:00:00',
            checkInTime: '2025-06-09T08:50:00',
            checkOutTime: '2025-06-09T11:10:00'
        },
        {
            id: '4',
            course: 'Giải tích 1',
            room: 'P.204',
            lecturer: 'ThS. Trần Thị B',
            type: 'Lý thuyết',
            startTime: '2025-06-10T08:00:00',
            endTime: '2025-06-10T10:00:00',
            checkInTime: '2025-06-10T07:55:00',
            checkOutTime: '2025-06-10T10:05:00'
        },
        {
            id: '5',
            course: 'Tin học đại cương',
            room: 'P.105',
            lecturer: 'ThS. Lê Văn C',
            type: 'Thực hành',
            startTime: '2025-06-11T13:00:00',
            endTime: '2025-06-11T15:00:00',
            checkInTime: '2025-06-11T12:50:00',
            checkOutTime: '2025-06-11T15:10:00'
        },
        {
            id: '6',
            course: 'Kỹ thuật lập trình',
            room: 'P.306',
            lecturer: 'TS. Phạm Thị D',
            type: 'Thực hành',
            startTime: '2025-06-12T10:00:00',
            endTime: '2025-06-12T12:00:00',
            checkInTime: '2025-06-12T09:50:00',
            checkOutTime: '2025-06-12T12:10:00'
        },
        {
            id: '7',
            course: 'Xác suất thống kê',
            room: 'P.103',
            lecturer: 'ThS. Đỗ Văn E',
            type: 'Lý thuyết',
            startTime: '2025-06-13T14:00:00',
            endTime: '2025-06-13T16:00:00',
            checkInTime: '2025-06-13T13:55:00',
            checkOutTime: '2025-06-13T16:05:00'
        }
    ]);
    //fetch data
    const fetchLecturers = async () => {
        try {
            setLoading(true);
            const response = await getAllLecturersAPI();
            if (!response) {
                console.error("Không có dữ liệu giảng viên");
                return;
            }
            setLecturers(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách giảng viên:", error);
        } finally {
            setLoading(false);
            setError('');
        }
    };


    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await getAllSubjectsAPI();
            if (!response) {
                console.error("Không có dữ liệu học phần");
                return;
            }
            setSubjects(response.data.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách học phần:", error);
        } finally {
            setLoading(false);
            setError('');
        }
    };

    //useEffect
    useEffect(() => {
        fetchLecturers();
        fetchSubjects();
    }, []);


    const handleItemMove = (itemId, newStartTime) => {
        setScheduleItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? { ...item, startTime: newStartTime }
                    : item
            )
        );
    };


    const stats = {
        classes: 42,
        teachers: lecturers.length,
        rooms: 15,
        course: subjects.length,
        conflicts: 3
    };

    return (
        <Box sx={{ p: 1, zIndex: 10 }}>
            <ProgressModal
                open={open}
                value={progress}
                message={statusMessage}
                handleStopTimetableGeneration={handleStopTimetableGeneration}
            />          {/* Quick Stats */}
            <QuickStats stats={stats} />

            {/* Main Content */}
            <Box sx={
                {
                    width: 'calc(100vw - 400px)',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    mb: 3
                }
            }>
                {/* Chart Section */}
                <WeeklyCalendar
                    initialDate={new Date()}
                    scheduleItems={scheduleItems}
                    onItemMove={handleItemMove}
                    onCreateNewSchedule={handleGenerateTimetable}
                />
            </Box>
        </Box>
    );
};

export default Dashboard;