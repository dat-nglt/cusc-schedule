import { useState, useEffect, useCallback } from 'react';
import {
    Box,
} from '@mui/material';
import WeeklyCalendar from './WeeklyCalendar';
import QuickStats from './QuickStats';
import { io } from 'socket.io-client';

import { generateSchedule, getInputDataForAlgorithmAPI, stopScheduleGeneration } from '../../api/scheduleAPI';
import ProgressModal from './ProgressModal';
import { toast } from 'react-toastify';

import { getAllRoomAPI } from '../../api/roomAPI';
import { getProgramCreateScheduleAPI } from '../../api/programAPI';
import { getAllLecturersAPI } from '../../api/lecturerAPI';
import { getClassesAPI } from '../../api/classAPI';
import CreateSchedulesAutoModal from './CreateSchedulesAutoModal';
import { getAllSchedules } from '../../api/classschedule';
import { transformScheduleForCalendar } from '../../utils/scheduleUtils';
import { useRef } from 'react';
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
    const socketRef = useRef(null);
    const [rooms, setRooms] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formTest, setFormTest] = useState(null);
    const [gaProgressData, setGaProgressData] = useState(null);
    const [programsResponseData, setProgramsResponseData] = useState(null);


    const fetchRooms = async () => {
        try {
            const response = await getAllRoomAPI();
            if (!response) {
                throw new Error("Không có dữ liệu phòng học");
            }

            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const fetchPrograms = async () => {
        try {
            const response = await getProgramCreateScheduleAPI();
            if (!response) {
                throw new Error("Không có dữ liệu chương trình học");
            }

            console.log("Programs API response:", response);

            // Lưu response data gốc
            setProgramsResponseData(response.data);

            // Xử lý response data - có thể là object với key 'programs'
            let programsData = response.data;
            if (programsData && programsData.programs) {
                programsData = programsData.programs;
            }

            setPrograms(programsData);
            console.log("Programs set to:", programsData);
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
        fetchClasses();
        fetchAllSchedules();
    }, []);

    useEffect(() => {
        // Khởi tạo kết nối socket chỉ một lần
        if (!socketRef.current) {
            console.log('Creating new socket connection...');
            const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
                withCredentials: true,
            });
            socketRef.current = socket;
        }

        const socket = socketRef.current;

        // --- Hàm xử lý cập nhật trạng thái GA (từ sự kiện 'ga_status') ---
        const handleGAStatus = (data) => {
            // console.log('GA Status:', data);
            setStatusMessage(data.message);
            setProgress(data.progress);

            switch (data.stage) {
                case 'START':
                case 'LOADING_DATA':
                case 'PROCESSING_DATA':
                case 'INITIALIZING_POPULATION':
                case 'RUNNING_GA':
                case 'GENERATING_SEMESTER_SCHEDULE':
                case 'EXPORTING_EXCEL':
                case 'GENERATING_VIEWS':
                case 'STOPPING':
                    setOpen(true);
                    break;
                case 'ABORTED':
                    setOpen(false);
                    toast.info('Tiến trình tạo thời khóa biểu đã bị hủy.');
                    setDownloadableFiles([]);
                    setError('');
                    break;
                case 'COMPLETED':
                    setOpen(false);
                    toast.success('Thời khóa biểu đã được tạo thành công!');
                    setError('');
                    // Yêu cầu danh sách file mới nhất
                    socket.emit('get_results');
                    break;
                case 'ERROR':
                    setOpen(false);
                    toast.error('Đã xảy ra lỗi trong quá trình tạo thời khóa biểu.');
                    setError(data.message || 'Lỗi không xác định.');
                    setDownloadableFiles([]);
                    break;
                case 'IDLE':
                    setOpen(false);
                    setStatusMessage('Sẵn sàng nhận yêu cầu mới');
                    setProgress(0);
                    break;
                default:
                    console.warn('Unknown GA stage:', data.stage);
                    break;
            }
        };

        // --- Hàm xử lý tiến trình GA chi tiết (từ sự kiện 'ga_progress') ---
        const handleGAProgress = (data) => {
            // console.log('GA Progress Detail:', data);
            setGaProgressData(data); // Lưu toàn bộ dữ liệu tiến trình chi tiết

            // Cập nhật log chi tiết
            const generationInfo = data.generation_info;
            const fitnessInfo = data.fitness_metrics;
            const violationInfo = data.violation_analysis;

            const logEntry = `Gen ${generationInfo.current}/${generationInfo.max}: ` +
                `Fitness ${fitnessInfo.current_best} ` +
                `(Best: ${fitnessInfo.overall_best}) ` +
                `Violations: ${violationInfo.current.total_violations}`;

            setGaLogs(prevLogs => {
                if (prevLogs.length > 100) { // Giới hạn số lượng log
                    return [...prevLogs.slice(50), logEntry];
                }
                return [...prevLogs, logEntry];
            });

            // Thông báo khi có cải thiện
            if (fitnessInfo.has_improvement === 'true' && generationInfo.current > 0) {
                toast.success(`Cải thiện mới ở thế hệ ${generationInfo.current}! ` +
                    `Fitness: ${fitnessInfo.overall_best}`);
            }
        };

        // --- Hàm xử lý các sự kiện xuất file (từ sự kiện 'ga_export') ---
        const handleGAExport = (data) => {
            // console.log('GA Export Event:', data);

            switch (data.event_type) {
                case 'EXPORT_STARTED':
                    toast.info(`Bắt đầu xuất file cho ${data.metadata?.total_semesters || 'nhiều'} học kỳ.`);
                    break;

                case 'SEMESTER_EXPORT_START':
                    toast.info(`Đang xử lý học kỳ ${data.semester_id} (${data.current}/${data.total})...`);
                    break;

                case 'SEMESTER_PROCESSING_START':
                    toast.info(`Bắt đầu xử lý học kỳ ${data.semester_id}`);
                    break;

                case 'EXCEL_EXPORT_SUCCESS':
                    toast.success(`Đã xuất file Excel: ${data.file_name}`);
                    setDownloadableFiles(prevFiles => [
                        ...prevFiles,
                        {
                            name: data.file_name,
                            path: data.file_path,
                            type: 'excel',
                            semester: data.semester_id,
                            timestamp: data.timestamp
                        }
                    ]);
                    break;

                case 'COMBINED_JSON_EXPORT_SUCCESS':
                    toast.success(`Đã xuất file JSON tổng hợp: ${data.file_name}`);
                    setDownloadableFiles(prevFiles => [
                        ...prevFiles,
                        {
                            name: data.file_name,
                            path: data.file_path,
                            type: 'json',
                            timestamp: data.timestamp
                        }
                    ]);
                    break;

                case 'EXPORT_COMPLETE':
                    toast.success(`Hoàn thành xuất file! Đã xử lý ${data.metadata?.successful_semesters || 0} học kỳ.`);
                    break;

                case 'SEMESTER_PROCESSING_ERROR':
                    toast.error(`Lỗi xử lý học kỳ ${data.semester_id}: ${data.error}`);
                    break;

                case 'EXCEL_EXPORT_ERROR':
                    toast.error(`Lỗi xuất Excel cho học kỳ ${data.semester_id}: ${data.error}`);
                    break;

                default:
                    console.log('Export event:', data.event_type, data);
                    break;
            }
        };

        // --- Hàm xử lý log thông thường ---
        const handleGALog = (data) => {
            setGaLogs(prevLogs => {
                const newLog = `${data.timestamp || new Date().toISOString()} [${data.type}]: ${data.message}`;
                if (prevLogs.length > 200) {
                    return [...prevLogs.slice(100), newLog];
                }
                return [...prevLogs, newLog];
            });
        };

        // --- Hàm xử lý lỗi ---
        const handleGAError = (data) => {
            console.error('GA Error:', data);
            setOpen(false);
            setError(data.message || 'Lỗi không xác định.');
            setStatusMessage('Đã xảy ra lỗi');
            setProgress(0);
            setDownloadableFiles([]);
            toast.error(data.message || 'Lỗi nghiêm trọng trong thuật toán GA!');
        };

        // --- Hàm nhận kết quả file ---
        const handleGAResults = (data) => {
            console.log('GA Results:', data);
            if (data.excelFiles && data.jsonFiles) {
                const allFiles = [
                    ...data.excelFiles.map(file => ({ name: file, type: 'excel' })),
                    ...data.jsonFiles.map(file => ({ name: file, type: 'json' }))
                ];
                setDownloadableFiles(allFiles);
            }
        };

        // --- Lắng nghe các sự kiện ---
        socket.on('ga_status', handleGAStatus);
        socket.on('ga_progress', handleGAProgress);
        socket.on('ga_export', handleGAExport);
        socket.on('ga_log', handleGALog);
        socket.on('ga_error', handleGAError);
        socket.on('ga_results', handleGAResults);

        // Yêu cầu danh sách file hiện có khi component mount
        socket.emit('get_results');

        // --- Cleanup Function ---
        return () => {
            socket.off('ga_status', handleGAStatus);
            socket.off('ga_progress', handleGAProgress);
            socket.off('ga_export', handleGAExport);
            socket.off('ga_log', handleGALog);
            socket.off('ga_error', handleGAError);
            socket.off('ga_results', handleGAResults);
        };
    }, []);

    // Transform API data to required format
    const transformDataToFormTest = useCallback((data, selections = null) => {
        const { rooms, programs, lecturers, classes } = data;

        console.log("Transforming data to form test structure:", { rooms, programs, lecturers, classes });

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
            program_id: cls.program_id ?? "CT01"
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

        // Transform programs với semesters và subjects từ response data mới
        const transformedPrograms = programsToTransform.map(program => ({
            program_id: program.program_id,
            program_name: program.program_name,
            duration: program.duration,
            semesters: program.semesters?.map(semester => ({
                semester_id: semester.semester_id,
                subject_ids: semester.subject_ids
            })) ?? []
        }));

        // Extract semesters từ programs (nếu có) hoặc từ data.semesters
        const transformedSemesters = [];

        // Lấy từ response API nếu có semesters riêng biệt
        if (data.semesters && Array.isArray(data.semesters)) {
            data.semesters.forEach(semester => {
                transformedSemesters.push({
                    semester_id: semester.semester_id,
                    subject_ids: semester.subject_ids,
                    start_date: semester.start_date || "2025-08-15",
                    end_date: semester.end_date || "2025-11-28",
                    duration_weeks: semester.duration_weeks || 15
                });
            });
        } else {
            // Fallback: extract từ programs
            programsToTransform.forEach(program => {
                if (program.semesters) {
                    program.semesters.forEach(semester => {
                        transformedSemesters.push({
                            semester_id: semester.semester_id,
                            subject_ids: semester.subject_ids,
                            start_date: semester.start_date || "2025-08-15",
                            end_date: semester.end_date || "2025-11-28",
                            duration_weeks: semester.duration_weeks || 15
                        });
                    });
                }
            });
        }

        // Extract subjects từ response data mới (nếu có)
        const transformedSubjects = [];
        if (data.subjects && Array.isArray(data.subjects)) {
            data.subjects.forEach(subject => {
                transformedSubjects.push({
                    subject_id: subject.subject_id,
                    name: subject.name || subject.subject_name,
                    theory_hours: subject.theory_hours ?? 30,
                    practice_hours: subject.practice_hours ?? 15
                });
            });
        }

        console.log("Transformed data:", {
            classes: transformedClasses,
            rooms: transformedRooms,
            lecturers: transformedLecturers,
            programs: transformedPrograms,
            semesters: transformedSemesters,
            subjects: transformedSubjects
        });

        return {
            classes: transformedClasses,
            rooms: transformedRooms,
            lecturers: transformedLecturers,
            programs: transformedPrograms,
            semesters: transformedSemesters,
            subjects: transformedSubjects,
            time_slots: [
                { "slot_id": "S1", "start": "07:00", "end": "09:00", "type": "morning" },
                { "slot_id": "S2", "start": "09:00", "end": "11:00", "type": "morning" },
                { "slot_id": "C1", "start": "13:00", "end": "15:00", "type": "afternoon" },
                { "slot_id": "C2", "start": "15:00", "end": "17:00", "type": "afternoon" },
                { "slot_id": "T1", "start": "17:30", "end": "19:30", "type": "evening" },
                { "slot_id": "T2", "start": "19:30", "end": "21:30", "type": "evening" }
            ],
            days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        };
    }, []);



    // Update formTest when API data is loaded
    useEffect(() => {
        const dataToTransform = { rooms, programs, lecturers, classes };

        // Thêm subjects và semesters từ programs response nếu có
        if (programsResponseData) {
            if (programsResponseData.subjects) {
                dataToTransform.subjects = programsResponseData.subjects;
            }
            if (programsResponseData.semesters) {
                dataToTransform.semesters = programsResponseData.semesters;
            }
        }

        const transformed = transformDataToFormTest(dataToTransform);

        if (transformed) {
            setFormTest(transformed);
            console.log("FormTest structure created:", transformed);
        }
    }, [rooms, programs, lecturers, classes, programsResponseData, transformDataToFormTest]);

    // Function to update formTest with selected data from modal
    const updateFormTestWithSelections = (selections) => {
        const dataToTransform = { rooms, programs, lecturers, classes };

        // Thêm subjects và semesters từ programs response nếu có
        if (programsResponseData) {
            if (programsResponseData.subjects) {
                dataToTransform.subjects = programsResponseData.subjects;
            }
            if (programsResponseData.semesters) {
                dataToTransform.semesters = programsResponseData.semesters;
            }
        }

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

        // await getInputDataForAlgorithmAPI()

        try {
            // const inputData = formTest || actualInputData;
            const inputData = formTest;
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
            setOpen(false); // Mở dialog để hiển thị tiến trình dừng
            await stopScheduleGeneration(); // Hàm này gửi POST request đến /api/stop-ga
            setStatusMessage('Đang yêu cầu dừng tiến trình...');
            // UI sẽ đợi thông báo 'ga_status' với stage 'ABORTED' từ backend
        } catch (err) {
            console.error('Error stopping GA generation:', err);
            setError(err.message || 'Không thể gửi yêu cầu dừng.');
            toast.error('Không thể gửi yêu cầu dừng tiến trình.');
        }
    };

    // const handleDownload = (filename) => {
    //     // Lấy URL download từ API Service
    //     const downloadUrl = getDownloadUrl(filename);
    //     window.open(downloadUrl, '_blank');
    // };



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
                    scheduleItems={transformDataToFormTest}
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