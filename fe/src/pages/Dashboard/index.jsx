import { useState, useEffect, useCallback } from 'react';
import {
    Box,
} from '@mui/material';
import WeeklyCalendar from './WeeklyCalendar';
import QuickStats from './QuickStats';
import { io } from 'socket.io-client';

import { generateSchedule, getDownloadUrl, stopScheduleGeneration } from '../../api/scheduleAPI';
import ProgressModal from './ProgressModal';
import { toast } from 'react-toastify';

import { getAllRoomAPI } from '../../api/roomAPI';
import { getProgramCreateScheduleAPI } from '../../api/programAPI';
import { getAllLecturersAPI } from '../../api/lecturerAPI';
import { getClassesAPI } from '../../api/classAPI';
import { getAllSubjectsAPI } from '../../api/subjectAPI';
import { getSemesterCreateScheduleAPI } from '../../api/semesterAPI';
import CreateSchedulesAutoModal from './CreateSchedulesAutoModal';
import { getAllSchedules } from '../../api/classschedule';
import { transformScheduleForCalendar } from '../../utils/scheduleUtils';
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
    withCredentials: true
});

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [createScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [downloadableFiles, setDownloadableFiles] = useState([]);
    const [error, setError] = useState('');
    const [gaLogs, setGaLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [scheduleItems, setScheduleItems] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formTest, setFormTest] = useState(null);

    const days_of_week = {
        "days_of_week": [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ]
    };

    const timeslot = {
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
    };

    console.log("SCHEDULE:", formTest)
    console.log("scheduleItems:", scheduleItems);


    const transformedScheduleItems = transformScheduleForCalendar(scheduleItems);

    const actualInputData = {
        "classes": [
            { "class_id": "CL01", "size": 30, "program_id": "CT01" },
            { "class_id": "CL02", "size": 28, "program_id": "CT01" },
            { "class_id": "CL03", "size": 35, "program_id": "CT02" }
        ],
        "rooms": [
            { "room_id": "R101", "type": "theory", "capacity": 40 },
            { "room_id": "R102", "type": "theory", "capacity": 35 },
            { "room_id": "R103", "type": "theory", "capacity": 40 },
            { "room_id": "R104", "type": "theory", "capacity": 32 },
            { "room_id": "LAB01", "type": "practice", "capacity": 50 },
            { "room_id": "LAB02", "type": "practice", "capacity": 50 },
            { "room_id": "LAB03", "type": "practice", "capacity": 50 },
            { "room_id": "LAB04", "type": "practice", "capacity": 50 }
        ],
        "lecturers": [
            {
                "lecturer_id": "GV01",
                "lecturer_name": "Nguyễn Văn A",
                "subjects": ["MH01", "MH02", "MH05"],
                "busy_slots": [{ "day": "Mon", "slot_id": "S1" }]
            },
            {
                "lecturer_id": "GV02",
                "lecturer_name": "Trần Thị B",
                "subjects": ["MH03", "MH04", "MH06"],
                "busy_slots": [{ "day": "Tue", "slot_id": "S2" }]
            },
            {
                "lecturer_id": "GV03",
                "lecturer_name": "Lê Văn C",
                "subjects": ["MH05", "MH06", "MH01"],
                "busy_slots": [{ "day": "Fri", "slot_id": "T1" }]
            },
            {
                "lecturer_id": "GV04",
                "lecturer_name": "Phạm Văn D",
                "subjects": ["MH03", "MH04"],
                "busy_slots": []
            }
        ],
        "programs": [
            {
                "program_id": "CT01",
                "program_name": "Chương trình Đào tạo CNTT",
                "duration": 4,
                "semesters": [
                    {
                        "semester_id": "HK1_CT01",
                        "subject_ids": ["MH01", "MH02"]
                    },
                    {
                        "semester_id": "HK2_CT01",
                        "subject_ids": ["MH05", "MH06"]
                    }
                ]
            },
            {
                "program_id": "CT02",
                "program_name": "Chương trình Đào tạo Kinh tế",
                "duration": 3,
                "semesters": [
                    {
                        "semester_id": "HK1_CT02",
                        "subject_ids": ["MH03", "MH04"]
                    }
                ]
            }
        ],
        "semesters": [
            {
                "semester_id": "HK1_CT01",
                "subject_ids": ["MH01", "MH02"],
                "duration_weeks": 15
            },
            {
                "semester_id": "HK2_CT01",
                "subject_ids": ["MH05", "MH06"],
                "duration_weeks": 16
            },
            {
                "semester_id": "HK1_CT02",
                "subject_ids": ["MH03", "MH04"],
                "duration_weeks": 15
            }
        ],
        "subjects": [
            {
                "subject_id": "MH01",
                "name": "Lập trình cơ bản",
                "theory_hours": 30,
                "practice_hours": 15
            },
            {
                "subject_id": "MH02",
                "name": "Cơ sở dữ liệu",
                "theory_hours": 30,
                "practice_hours": 15
            },
            {
                "subject_id": "MH03",
                "name": "Mạng máy tính",
                "theory_hours": 30,
                "practice_hours": 15
            },
            {
                "subject_id": "MH04",
                "name": "Thiết kế Web",
                "theory_hours": 30,
                "practice_hours": 15
            },
            {
                "subject_id": "MH05",
                "name": "Cấu trúc dữ liệu",
                "theory_hours": 30,
                "practice_hours": 15
            },
            {
                "subject_id": "MH06",
                "name": "Thuật toán",
                "theory_hours": 30,
                "practice_hours": 15
            }
        ],
        "time_slots": [
            { "slot_id": "S1", "start": "07:00", "end": "09:00", "type": "morning" },
            { "slot_id": "S2", "start": "09:00", "end": "11:00", "type": "morning" },
            { "slot_id": "C1", "start": "13:00", "end": "15:00", "type": "afternoon" },
            { "slot_id": "C2", "start": "15:00", "end": "17:00", "type": "afternoon" },
            { "slot_id": "T1", "start": "17:30", "end": "19:30", "type": "evening" },
            { "slot_id": "T2", "start": "19:30", "end": "21:30", "type": "evening" }
        ],
        "days_of_week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }


    const fetchRooms = async () => {
        try {
            const response = await getAllRoomAPI();
            if (!response) {
                throw new Error("Không có dữ liệu phòng học");
            }
            console.log("Rooms fetched:", response.data);

            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };
    const fetchSubjests = async () => {
        try {
            const response = await getAllSubjectsAPI();
            if (!response) {
                throw new Error("Không có dữ liệu môn học");
            }
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };
    console.log("semester:", semesters);

    const fetchSemesters = async () => {
        try {
            const response = await getSemesterCreateScheduleAPI();
            if (!response) {
                throw new Error("Không có dữ liệu học kỳ");
            }

            setSemesters(response.data);
        } catch (error) {
            console.error("Error fetching semesters:", error);
        }
    };
    const fetchPrograms = async () => {
        try {
            const response = await getProgramCreateScheduleAPI();
            if (!response) {
                throw new Error("Không có dữ liệu chương trình học");
            }
            setPrograms(response.data);
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    };
    const fetchLecturers = async () => {
        try {
            const response = await getAllLecturersAPI();
            if (!response) {
                throw new Error("Không có dữ liệu giảng viên");
            }
            setLecturers(response.data);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
        }
    };
    const fetchClasses = async () => {
        try {
            const response = await getClassesAPI();
            if (!response) {
                throw new Error("Không có dữ liệu lớp học");
            }
            setClasses(response.data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const fetchAllSchedules = async () => {
        try {
            const response = await getAllSchedules();
            if (!response) {
                throw new Error("Không có dữ liệu thời khóa biểu");
            }
            setScheduleItems(response.data);
            // Xử lý dữ liệu thời khóa biểu nếu cần
        }
        catch (error) {
            console.error("Error fetching schedules:", error);
            // Xử lý lỗi nếu cần
        }
    };
    // Gọi các hàm fetch dữ liệu khi component mount
    useEffect(() => {
        fetchRooms();
        fetchPrograms();
        fetchLecturers();
        fetchSubjests();
        fetchSemesters();
        fetchClasses();
        fetchAllSchedules();
    }, []);

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

    // Transform API data to required format
    const transformDataToFormTest = useCallback((data, selections = null) => {
        const { rooms, programs, lecturers, classes, subjects, semesters } = data;

        console.log("Transforming data to form test structure:", { rooms, programs, lecturers, classes, subjects, semesters });

        // If selections are provided, filter data based on selections
        const filterData = (items, selectedIds, idField) => {
            if (!selections || !selectedIds?.length) return items;
            return items.filter(item => selectedIds.includes(item[idField]));
        };

        const filteredClasses = filterData(classes, selections?.classes, 'class_id');
        const filteredRooms = filterData(rooms, selections?.rooms, 'room_id');
        const filteredLecturers = filterData(lecturers, selections?.lecturers, 'lecturer_id');
        const filteredPrograms = filterData(programs, selections?.programs, 'program_id');

        // Use filtered data or all data if no selections
        const classesToTransform = filteredClasses.length ? filteredClasses : classes;
        const roomsToTransform = filteredRooms.length ? filteredRooms : rooms;
        const lecturersToTransform = filteredLecturers.length ? filteredLecturers : lecturers;
        const programsToTransform = filteredPrograms.length ? filteredPrograms : programs;

        if (!classesToTransform?.length || !roomsToTransform?.length || !lecturersToTransform?.length || !programsToTransform?.length) {
            console.warn("Dữ liệu đầu vào không đầy đủ. Trả về cấu trúc rỗng.");
            return {
                classes: [],
                rooms: [],
                lecturers: [],
                programs: [],
                semesters: [],
                subjects: [],
                time_slots: [],
                days_of_week: []
            };
        }

        const transformedClasses = classesToTransform.map(cls => ({
            class_id: cls.class_id,
            size: cls.class_size,
            program_id: cls.program_id ?? "CT001"
        }));

        const transformedRooms = roomsToTransform.map(room => ({
            room_id: room.room_id,
            type: room.type === "Lý thuyết" ? "theory" : "practice",
            capacity: room.capacity
        }));

        const transformedLecturers = lecturersToTransform.map(lecturer => ({
            lecturer_id: lecturer.lecturer_id,
            lecturer_name: lecturer.name,
            subjects: lecturer.subjects?.map(subject => subject.subject_id) ?? [],
            busy_slots: lecturer.busy_slots ?? [],
            semester_busy_slots: lecturer.semester_busy_slots ?? [],
        }));

        const transformedPrograms = programsToTransform.map(program => ({
            program_id: program.program_id,
            program_name: program.program_name,
            duration: program.duration,
            semesters: program.semesters ?? []
        }));
        console.log("semesters:", semesters)
        const transformedSemesters = semesters?.map(semester => ({
            semester_id: semester.semester_id,
            subject_ids: semester.subject_ids || semester.subjects?.map(s => s.subject_id) || [],
            start_date: semester.start_date,
            end_date: semester.end_date,
            duration_weeks: semester.duration_weeks
        })) ?? [];


        const transformedSubjects = subjects?.map(subject => ({
            subject_id: subject.subject_id,
            name: subject.subject_name,
            theory_hours: subject.theory_hours ?? 30,
            practice_hours: subject.practice_hours ?? 15
        })) ?? [];

        return {
            classes: transformedClasses,
            rooms: transformedRooms,
            lecturers: transformedLecturers,
            programs: transformedPrograms,
            semesters: transformedSemesters,
            subjects: transformedSubjects,
            time_slots: timeslot?.time_slots ?? [],
            days_of_week: days_of_week?.days_of_week ?? []
        };
    }, []);



    // Update formTest when API data is loaded
    useEffect(() => {
        const dataToTransform = { rooms, programs, lecturers, classes, subjects, semesters };
        const transformed = transformDataToFormTest(dataToTransform);

        if (transformed) {
            setFormTest(transformed);
        }
    }, [rooms, programs, lecturers, classes, subjects, semesters, transformDataToFormTest]);

    // Function to update formTest with selected data from modal
    const updateFormTestWithSelections = (selections) => {
        const dataToTransform = { rooms, programs, lecturers, classes, subjects, semesters };
        const transformed = transformDataToFormTest(dataToTransform, selections);

        if (transformed) {
            setFormTest(transformed);
            console.log("FormTest updated with selections:", transformed);
        }
    };

    const handleGenerateTimetable = async () => {
        setStatusMessage('Đang gửi yêu cầu tạo thời khóa biểu...');
        setDownloadableFiles([]);
        setError('');
        setGaLogs([]);
        setProgress(0);
        setOpen(true);

        try {
            // Use formTest data if available, otherwise use actualInputData as fallback
            const inputData = formTest || actualInputData;
            const response = await generateSchedule(inputData);

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
                handleStopTimetableGeneration={handleStopTimetableGeneration}
            />
            {/* Quick Stats */}
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
                    scheduleItems={transformedScheduleItems}
                    onItemMove={handleItemMove}
                    onCreateNewSchedule={() => setCreateScheduleModalOpen(true)}
                    programs={programs}
                    rooms={rooms}
                    lecturers={lecturers}
                    classes={classes}
                />
            </Box>

            <CreateSchedulesAutoModal
                open={createScheduleModalOpen}
                onClose={() => setCreateScheduleModalOpen(false)}
                programs={programs}
                rooms={rooms}
                lecturers={lecturers}
                classes={classes}
                onGenerate={handleGenerateTimetable}
                onSelectionChange={updateFormTestWithSelections}
            />
        </Box>
    );
};

export default Dashboard;