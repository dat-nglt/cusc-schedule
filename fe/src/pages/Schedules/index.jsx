import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Container,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    useMediaQuery,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider,
    Chip,
    Tabs,
    Tab,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    useTheme,
    alpha
} from '@mui/material';
import {
    Add as AddIcon,
    FileDownload as FileDownloadIcon,
    FilterList as FilterListIcon,
    Sort as SortIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';

import { useEffect, useCallback, useState } from 'react';
import { io } from 'socket.io-client';

import { generateSchedule, stopScheduleGeneration } from '../../api/scheduleAPI';
import ProgressModal from '../Dashboard/ProgressModal';
import { toast } from 'react-toastify';

import { getAllRoomAPI } from '../../api/roomAPI';
import { getProgramToCreateScheduleAPI } from '../../api/programAPI';
import { getAllLecturersAPI } from '../../api/lecturerAPI';
import { getClassesAPI } from '../../api/classAPI';
import CreateSchedulesAutoModal from '../Dashboard/CreateSchedulesAutoModal';
// import { getAllSchedules } from '../../api/classschedule';
import { useRef } from 'react';
// import { getAllSchedules } from '../../api/classschedule';

const ScheduleManagement = () => {


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
    const [subjects, setSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
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
            console.log("Fetched rooms:", response.data);
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const fetchPrograms = async () => {
        try {
            const response = await getProgramToCreateScheduleAPI();
            if (!response) {
                throw new Error("Không có dữ liệu chương trình học");
            }

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
            setLecturers(response.data.lecturers);
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
    console.log("formTest data:", formTest);

    // Fetch all schedules
    // const fetchAllSchedules = async () => {
    //     try {
    //         const response = await getAllSchedules();
    //         if (!response) {
    //             throw new Error("Không có dữ liệu thời khóa biểu");
    //         }
    //         setScheduleItems(response.data);
    //         // Xử lý dữ liệu thời khóa biểu nếu cần
    //     }
    //     catch (error) {
    //         console.error("Error fetching schedules:", error);
    //         // Xử lý lỗi nếu cần
    //     }
    // };
    // Gọi các hàm fetch dữ liệu khi component mount
    useEffect(() => {
        fetchRooms();
        fetchPrograms();
        fetchLecturers();
        fetchClasses();
        // fetchAllSchedules();
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
        // Extract the actual data arrays from the API response
        const roomsArray = Array.isArray(data.rooms) ? data.rooms : Object.values(data.rooms || {});
        const programsArray = Array.isArray(data.programs) ? data.programs : Object.values(data.programs || {});
        const lecturersArray = Array.isArray(data.lecturers) ? data.lecturers : Object.values(data.lecturers || {});
        const classesArray = Array.isArray(data.classes) ? data.classes : Object.values(data.classes || {});

        // Helper function to filter data based on selections
        const filterData = (items, selectedIds, idField) => {
            if (!selectedIds || !selectedIds.length) {
                return {}; // Return all items if no selections
            }
            return items.filter(item => selectedIds.includes(item[idField]));
        };

        // Apply selections if provided
        const filteredClasses = filterData(classesArray, selections?.classes, 'class_id');
        const filteredRooms = filterData(roomsArray, selections?.rooms, 'room_id');
        const filteredLecturers = filterData(lecturersArray, selections?.lecturers, 'lecturer_id');
        const filteredPrograms = filterData(programsArray, selections?.programs, 'program_id');

        if (!filteredClasses?.length || !filteredRooms?.length || !filteredLecturers?.length || !filteredPrograms?.length) {
            console.warn("Dữ liệu đầu vào không đầy đủ sau khi lọc. Trả về cấu trúc rỗng.");
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

        const transformedClasses = filteredClasses.map(cls => ({
            class_id: cls.class_id,
            size: cls.class_size,
            program_id: cls.program_id ?? "CT01"
        }));

        const transformedRooms = filteredRooms.map(room => ({
            room_id: room.room_id,
            type: room.type === "Lý thuyết" ? "theory" : "practice",
            capacity: room.capacity
        }));

        const transformedLecturers = filteredLecturers.map(lecturer => ({
            lecturer_id: lecturer.lecturer_id,
            lecturer_name: lecturer.name,
            subjects: lecturer.subjects?.map(subject => subject.subject_id) ?? [],
            busy_slots: lecturer.busy_slots ?? [],
            semester_busy_slots: lecturer.semester_busy_slots ?? [],
        }));

        // Transform programs với semesters từ programsResponseData structure
        const transformedPrograms = filteredPrograms.map(program => ({
            program_id: program.program_id,
            program_name: program.program_name,
            duration: program.duration,
            semesters: program.semesters?.map(semester => ({
                semester_id: semester.semester_id,
                subject_ids: semester.subject_ids
            })) ?? []
        }));

        // Extract semesters từ programsResponseData.semesters
        const transformedSemesters = [];
        if (data.semesters && Array.isArray(data.semesters)) {
            // Filter semesters based on selected programs if selections exist
            const semestersToInclude = data.semesters.filter(semester => {
                if (!selections?.programs?.length) return true;

                // Check if this semester belongs to any of the selected programs
                return filteredPrograms.some(program =>
                    program.semesters?.some(progSemester =>
                        progSemester.semester_id === semester.semester_id
                    )
                );
            });

            semestersToInclude.forEach(semester => {
                transformedSemesters.push({
                    semester_id: semester.semester_id,
                    subject_ids: semester.subject_ids,
                    start_date: semester.start_date || "2025-08-15",
                    end_date: semester.end_date || "2025-11-28",
                    duration_weeks: semester.duration_weeks || 15
                });
            });
        }

        // Extract subjects từ programsResponseData.subjects
        const transformedSubjects = [];
        if (data.subjects && Array.isArray(data.subjects)) {
            // Filter subjects based on selected semesters if selections exist
            const subjectsToInclude = data.subjects.filter(subject => {
                if (!transformedSemesters.length) return true;

                // Check if this subject is used in any of the included semesters
                return transformedSemesters.some(semester =>
                    semester.subject_ids?.includes(subject.subject_id)
                );
            });

            subjectsToInclude.forEach(subject => {
                transformedSubjects.push({
                    subject_id: subject.subject_id,
                    name: subject.name || subject.subject_name,
                    theory_hours: subject.theory_hours ?? 30,
                    practice_hours: subject.practice_hours ?? 15
                });
            });
        }


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
        setFormTest(transformDataToFormTest(dataToTransform))
    }, [rooms, programs, lecturers, classes, programsResponseData, transformDataToFormTest]);

    const handleGenerateFromModal = async (selections) => {
        //Log dữ liệu lựa chọn nhận được từ modal
        console.log("Selections received from modal:", selections);

        //Chuẩn bị và biến đổi dữ liệu thành payload cuối cùng
        const dataToTransform = { rooms, programs, lecturers, classes };

        if (programsResponseData) {
            if (programsResponseData.subjects) {
                dataToTransform.subjects = programsResponseData.subjects;
            }
            if (programsResponseData.semesters) {
                dataToTransform.semesters = programsResponseData.semesters;
            }
        }

        const finalPayload = transformDataToFormTest(dataToTransform, selections);

        // Kiểm tra payload trước khi gửi
        if (!finalPayload || !finalPayload.classes?.length || !finalPayload.programs?.length || !finalPayload.rooms?.length || !finalPayload.lecturers?.length) {
            toast.error("Dữ liệu đầu vào không hợp lệ hoặc bị thiếu. Vui lòng chọn đủ thông tin.");
            console.error("Invalid payload generated:", finalPayload);
            return; // Dừng lại nếu payload không hợp lệ
        }

        // Cập nhật state formTest
        setFormTest(finalPayload);
        console.log("Final payload being sent to API:", finalPayload);

        //Thực hiện các hành động gọi API (logic từ handleGenerateTimetable cũ)
        setStatusMessage('Đang gửi yêu cầu tạo thời khóa biểu...');
        setDownloadableFiles([]);
        setError('');
        setGaLogs([]);
        setProgress(0);
        setOpen(true);

        try {
            // Gửi trực tiếp payload vừa tạo, không đọc từ state
            const response = await generateSchedule(finalPayload);

            if (response.aborted) {
                toast.info("Yêu cầu tạo thời khóa biểu đã được hủy.");
                setOpen(false);
            } else if (response.error) {
                setError(response.message || response.error);
                setStatusMessage('');
                setOpen(false);
                toast.error(response.message || "Có lỗi khi bắt đầu tiến trình.");
            }
        } catch (err) {
            console.error('Error initiating GA generation:', err);
            setError(err.message || 'Không thể kết nối hoặc lỗi mạng khi gửi yêu cầu.');
            setStatusMessage('');
            setOpen(false);
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




    // Sample data
    const schedules = [
        { id: 1, name: 'HK1 2023-2024', generation: '1.0', optimized: 85, created: '2023-08-15', classes: 45, status: 'Hoạt động' },
        { id: 2, name: 'HK2 2023-2024', generation: '1.1', optimized: 92, created: '2024-01-10', classes: 48, status: 'Hoạt động' },
        { id: 3, name: 'HK1 2024-2025', generation: '2.0', optimized: 88, created: '2024-08-20', classes: 50, status: 'Dự thảo' },
    ];

    const timetableData = [
        { id: 1, time: '7:30 - 9:00', mon: 'Toán - P101', tue: 'Văn - P202', wed: 'Anh - P305', thu: 'Lý - Lab1', fri: 'Hóa - Lab2', sat: '', sun: '' },
        { id: 2, time: '9:10 - 10:40', mon: 'Lý - P103', tue: 'Hóa - P204', wed: 'Sử - P301', thu: 'Địa - P102', fri: 'GDCD - P105', sat: '', sun: '' },
        { id: 3, time: '13:30 - 15:00', mon: 'Anh - P205', tue: 'Toán - P101', wed: 'Văn - P202', thu: 'Sinh - Lab1', fri: 'CN - Lab2', sat: '', sun: '' },
    ];

    const statusOptions = ['Tất cả', 'Hoạt động', 'Dự thảo', 'Đã khóa'];

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useTheme()
    const [darkMode, setDarkMode] = useState(prefersDarkMode);
    const [tabValue, setTabValue] = useState(0);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('all');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleCreateNewSchedule = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleConfirmCreate = () => {
        setOpenCreateDialog(false);
        showSnackbar('Đã tạo thời khóa biểu mới thành công', 'success');
    };

    const handleDeleteSchedule = () => {
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        setOpenDeleteDialog(false);
        showSnackbar('Đã xóa thời khóa biểu thành công', 'success');
        setSelectedSchedule(null);
    };

    const handleDuplicateSchedule = () => {
        showSnackbar('Đã tạo bản sao thành công', 'success');
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const filteredSchedules = schedules.filter(schedule => {
        const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.generation.includes(searchTerm);
        const matchesStatus = statusFilter === 'Tất cả' || schedule.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <Box sx={{ p: 1, zIndex: 10, height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <ProgressModal
                open={open}
                value={progress}
                message={statusMessage}
                handleStopTimetableGeneration={handleStopTimetableGeneration}
            />
            {/* Header Section */}
            <Box sx={{ width: '100%', mb: 3 }}>
                <Card sx={{ flexGrow: 1 }}>
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: isSmallScreen ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isSmallScreen ? 'stretch' : 'center',
                            mb: 3,
                            gap: 2
                        }}>
                            <Typography variant="h5" fontWeight="600">
                                Danh sách thời khoá biểu
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                width: isSmallScreen ? '100%' : 'auto'
                            }}>
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm theo mã, tên giảng viên hoặc môn giảng dạy..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        minWidth: 200,
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<FileDownloadIcon />}
                                    disabled={!selectedSchedule}
                                    sx={{
                                        height: 36,
                                        px: 2
                                    }}
                                >
                                    Xuất Excel
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={setCreateScheduleModalOpen}
                                    sx={{
                                        height: 36,
                                        px: 2
                                    }}
                                >
                                    Tạo mới
                                </Button>
                            </Box>
                        </Box>
                        <Grid container spacing={3} sx={{ height: 'calc(100vh - 250px)' }}>
                            {/* Sidebar - Danh sách thời khóa biểu */}
                            <Grid item xs={12} md={4} lg={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Paper sx={{
                                    p: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: 0

                                }}>
                                    {/* Component Header */}
                                    {/* Schedule List Container */}
                                    <Box sx={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: theme.palette.divider,
                                            borderRadius: '4px',
                                            '&:hover': {
                                                backgroundColor: theme.palette.text.secondary,
                                            },
                                        },
                                    }}>
                                        {filteredSchedules.map((schedule) => (
                                            <Card
                                                key={schedule.id}
                                                onClick={() => handleScheduleSelect(schedule)}
                                                sx={{
                                                    mb: 2,
                                                    cursor: 'pointer',
                                                    boxShadow: selectedSchedule?.id === schedule.id ? theme.shadows[4] : theme.shadows[1],
                                                    border: selectedSchedule?.id === schedule.id ? `1px solid ${alpha(theme.palette.secondary.main, 0.3)}` : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                    borderRadius: '12px',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        boxShadow: theme.shadows[3],
                                                        borderColor: selectedSchedule?.id === schedule.id ? alpha(theme.palette.secondary.main, 0.5) : alpha(theme.palette.primary.main, 0.5)
                                                    }
                                                }}
                                            >
                                                <CardContent sx={{
                                                    p: 1.5,
                                                    '&:last-child': { pb: 1.5 },
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 0.5
                                                }}>
                                                    {/* Header row with name and status */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        gap: 1
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{
                                                            fontWeight: 600,
                                                            lineHeight: 1.3,
                                                            color: theme.palette.text.primary
                                                        }}>
                                                            {schedule.name}
                                                        </Typography>

                                                        <Chip
                                                            label={schedule.status}
                                                            size="small"
                                                            variant="outlined"
                                                            color={
                                                                schedule.status === 'Hoạt động' ? 'success' :
                                                                    schedule.status === 'Dự thảo' ? 'warning' : 'error'
                                                            }
                                                            sx={{
                                                                height: 22,
                                                                fontSize: '0.6875rem',
                                                                fontWeight: 500,
                                                                borderWidth: '1.5px',
                                                                '& .MuiChip-label': { px: 0.75 }
                                                            }}
                                                        />
                                                    </Box>

                                                    {/* Version info */}
                                                    <Typography variant="caption" sx={{
                                                        color: theme.palette.text.secondary,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5
                                                    }}>
                                                        <Box component="span" sx={{
                                                            fontSize: '0.75rem',
                                                            lineHeight: 1.5,
                                                            opacity: 0.8
                                                        }}>
                                                            v{schedule.generation}
                                                        </Box>
                                                        <Box component="span" sx={{
                                                            width: 4,
                                                            height: 4,
                                                            borderRadius: '50%',
                                                            bgcolor: theme.palette.text.secondary,
                                                            opacity: 0.6
                                                        }} />
                                                        <Box component="span">
                                                            {new Date(schedule.created).toLocaleDateString()}
                                                        </Box>
                                                    </Typography>

                                                    {/* Optimization indicator */}
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mt: 0.5
                                                    }}>
                                                        <Box sx={{
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: 6,
                                                            bgcolor: theme.palette.mode === 'light' ?
                                                                'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                                                            borderRadius: 3,
                                                            overflow: 'hidden'
                                                        }}>
                                                            <Box sx={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: 0,
                                                                width: `${schedule.optimized}%`,
                                                                height: '100%',
                                                                bgcolor:
                                                                    schedule.optimized >= 90 ? 'success.main' :
                                                                        schedule.optimized >= 80 ? 'warning.main' : 'error.main',
                                                                borderRadius: 3
                                                            }} />
                                                        </Box>

                                                        <Typography variant="caption" sx={{
                                                            fontWeight: 500,
                                                            color:
                                                                schedule.optimized >= 90 ? 'success.main' :
                                                                    schedule.optimized >= 80 ? 'warning.main' : 'error.main',
                                                            minWidth: 40,
                                                            textAlign: 'right'
                                                        }}>
                                                            {schedule.optimized}%
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Main content - Chi tiết thời khóa biểu */}
                            <Grid flex={1} item xs={12} md={8} lg={9} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: "fit-content"
                            }}>
                                <Paper sx={{
                                    p: 3,
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: 0
                                }}>
                                    {selectedSchedule ? (
                                        <>
                                            {/* Header */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 3,
                                                flexWrap: 'wrap',
                                                gap: 2
                                            }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {selectedSchedule.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Phiên bản {selectedSchedule.generation} • Cập nhật lần cuối: {new Date(selectedSchedule.created).toLocaleDateString()}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<EditIcon fontSize="small" />}
                                                        size="small"
                                                        sx={{ borderRadius: 4 }}
                                                    >
                                                        Chỉnh sửa
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<CopyIcon fontSize="small" />}
                                                        size="small"
                                                        onClick={handleDuplicateSchedule}
                                                        sx={{ borderRadius: 4 }}
                                                    >
                                                        Tạo bản sao
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<DeleteIcon fontSize="small" />}
                                                        size="small"
                                                        color="error"
                                                        onClick={handleDeleteSchedule}
                                                        sx={{ borderRadius: 4 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Box>
                                            </Box>

                                            {/* Tabs */}
                                            <Tabs
                                                value={tabValue}
                                                onChange={handleTabChange}
                                                sx={{
                                                    mb: 3,
                                                    '& .MuiTabs-indicator': {
                                                        height: 3,
                                                        borderRadius: '3px 3px 0 0'
                                                    }
                                                }}
                                            >
                                                <Tab label="Thời khóa biểu" sx={{ minWidth: 'auto', px: 2 }} />
                                                <Tab label="Thông tin chi tiết" sx={{ minWidth: 'auto', px: 2 }} />
                                                <Tab label="Lịch sử phiên bản" sx={{ minWidth: 'auto', px: 2 }} />
                                            </Tabs>

                                            {/* Tab content */}
                                            <Box sx={{
                                                flex: 1,
                                                overflow: 'auto',
                                                '&::-webkit-scrollbar': {
                                                    width: '6px',
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    backgroundColor: theme.palette.mode === 'light' ? '#bdbdbd' : '#616161',
                                                    borderRadius: '3px',
                                                }
                                            }}>
                                                {tabValue === 0 && (
                                                    <TableContainer component={Paper} elevation={0}>
                                                        <Table sx={{ minWidth: 800 }}>
                                                            <TableHead>
                                                                <TableRow sx={{
                                                                    '& th': {
                                                                        fontWeight: 600,
                                                                        backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.background.default
                                                                    }
                                                                }}>
                                                                    <TableCell>Thời gian</TableCell>
                                                                    <TableCell>Thứ 2</TableCell>
                                                                    <TableCell>Thứ 3</TableCell>
                                                                    <TableCell>Thứ 4</TableCell>
                                                                    <TableCell>Thứ 5</TableCell>
                                                                    <TableCell>Thứ 6</TableCell>
                                                                    <TableCell>Thứ 7</TableCell>
                                                                    <TableCell>Chủ nhật</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {timetableData.map((row) => (
                                                                    <TableRow
                                                                        key={row.id}
                                                                        hover
                                                                        sx={{ '&:last-child td': { borderBottom: 0 } }}
                                                                    >
                                                                        <TableCell sx={{ fontWeight: 500 }}>{row.time}</TableCell>
                                                                        <TableCell>{row.mon}</TableCell>
                                                                        <TableCell>{row.tue}</TableCell>
                                                                        <TableCell>{row.wed}</TableCell>
                                                                        <TableCell>{row.thu}</TableCell>
                                                                        <TableCell>{row.fri}</TableCell>
                                                                        <TableCell>{row.sat}</TableCell>
                                                                        <TableCell>{row.sun}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                )}

                                                {tabValue === 1 && (
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={6}>
                                                            <Card variant="outlined" sx={{ mb: 3 }}>
                                                                <CardContent>
                                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                                        Thông tin cơ bản
                                                                    </Typography>
                                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 2 }}>
                                                                        <Typography variant="body2" color="text.secondary"><strong>Tên:</strong></Typography>
                                                                        <Typography variant="body2">{selectedSchedule.name}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Phiên bản:</strong></Typography>
                                                                        <Typography variant="body2">{selectedSchedule.generation}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Ngày tạo:</strong></Typography>
                                                                        <Typography variant="body2">{new Date(selectedSchedule.created).toLocaleDateString()}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Trạng thái:</strong></Typography>
                                                                        <Box>
                                                                            <Chip
                                                                                label={selectedSchedule.status}
                                                                                size="small"
                                                                                color={
                                                                                    selectedSchedule.status === 'Hoạt động' ? 'success' :
                                                                                        selectedSchedule.status === 'Dự thảo' ? 'warning' : 'error'
                                                                                }
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>

                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                                        Thống kê lớp học
                                                                    </Typography>
                                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: 2 }}>
                                                                        <Typography variant="body2" color="text.secondary"><strong>Số lớp học:</strong></Typography>
                                                                        <Typography variant="body2">{selectedSchedule.classes}</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Số phòng sử dụng:</strong></Typography>
                                                                        <Typography variant="body2">15 phòng</Typography>

                                                                        <Typography variant="body2" color="text.secondary"><strong>Số tiết học/ngày:</strong></Typography>
                                                                        <Typography variant="body2">4 tiết</Typography>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <Card variant="outlined" sx={{ height: '100%' }}>
                                                                <CardContent>
                                                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                                                        Phân tích tối ưu
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                                        <Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                <Typography variant="body2">Mức độ tối ưu</Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                    {selectedSchedule.optimized}%
                                                                                </Typography>
                                                                            </Box>
                                                                            <Box sx={{
                                                                                width: '100%',
                                                                                height: 8,
                                                                                bgcolor: 'divider',
                                                                                borderRadius: 4,
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <Box
                                                                                    sx={{
                                                                                        width: `${selectedSchedule.optimized}%`,
                                                                                        height: '100%',
                                                                                        bgcolor: selectedSchedule.optimized >= 90 ? 'success.main' :
                                                                                            selectedSchedule.optimized >= 80 ? 'warning.main' : 'error.main'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Box>

                                                                        <Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                <Typography variant="body2">Phân bổ phòng học</Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>78%</Typography>
                                                                            </Box>
                                                                            <Box sx={{
                                                                                width: '100%',
                                                                                height: 8,
                                                                                bgcolor: 'divider',
                                                                                borderRadius: 4,
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <Box
                                                                                    sx={{
                                                                                        width: '78%',
                                                                                        height: '100%',
                                                                                        bgcolor: 'info.main'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Box>

                                                                        <Box>
                                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                                                <Typography variant="body2">Phân bổ giáo viên</Typography>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>85%</Typography>
                                                                            </Box>
                                                                            <Box sx={{
                                                                                width: '100%',
                                                                                height: 8,
                                                                                bgcolor: 'divider',
                                                                                borderRadius: 4,
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <Box
                                                                                    sx={{
                                                                                        width: '85%',
                                                                                        height: '100%',
                                                                                        bgcolor: 'secondary.main'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {tabValue === 2 && (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        height: 300,
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography variant="body1" color="text.secondary">
                                                            Lịch sử các phiên bản sẽ hiển thị tại đây
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                    ) : (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            textAlign: 'center',
                                            p: 3
                                        }}>
                                            <Box sx={{
                                                width: 120,
                                                height: 120,
                                                bgcolor: theme.palette.mode === 'light' ? '#f0f0f0' : '#424242',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3
                                            }}>
                                                <AddIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                            </Box>
                                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1.5 }}>
                                                Chưa có thời khóa biểu được chọn
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                                                Vui lòng chọn một thời khóa biểu từ danh sách bên trái hoặc tạo mới thời khóa biểu
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={handleCreateNewSchedule}
                                                sx={{ borderRadius: 4 }}
                                            >
                                                Tạo thời khóa biểu mới
                                            </Button>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
            <CreateSchedulesAutoModal
                open={createScheduleModalOpen}
                onClose={() => setCreateScheduleModalOpen(false)}
                programs={programs}
                rooms={rooms}
                lecturers={lecturers}
                classes={classes}
                onConfirm={handleGenerateFromModal}
            />
        </Box>
    );
};

export default ScheduleManagement;