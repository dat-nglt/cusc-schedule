import { useState, useEffect, useRef } from 'react';
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


const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [createScheduleModalOpen, setCreateScheduleModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [downloadableFiles, setDownloadableFiles] = useState([]);
    const [error, setError] = useState('');
    const [gaLogs, setGaLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const socketRef = useRef(null);
    const [rooms, setRooms] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [formTest, setFormTest] = useState(null);
    const [gaProgressData, setGaProgressData] = useState(null);
    const [scheduleItems, setScheduleItems] = useState();

    const days_of_week = useState({
        "days_of_week": [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ]
    });

    const timeslot = useState({
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
    });

    const actualInputData = {
        "classes": [
            {
                "class_id": "DH23CS",
                "size": 30,
                "program_id": "CT001"
            },
            {
                "class_id": "DH23AI",
                "size": 30,
                "program_id": "CT002"
            },
            {
                "class_id": "DH22IT",
                "size": 30,
                "program_id": "CT002"
            },
            {
                "class_id": "L01",
                "size": 35,
                "program_id": "CT001"
            }
        ],
        "rooms": [
            {
                "room_id": "LT1",
                "type": "theory",
                "capacity": 50
            },
            {
                "room_id": "TH1",
                "type": "practice",
                "capacity": 30
            },
            {
                "room_id": "LT2",
                "type": "theory",
                "capacity": 45
            },
            {
                "room_id": "TH2",
                "type": "practice",
                "capacity": 35
            },
            {
                "room_id": "LT3",
                "type": "theory",
                "capacity": 40
            },
            {
                "room_id": "TH3",
                "type": "practice",
                "capacity": 30
            },
            {
                "room_id": "LT4",
                "type": "theory",
                "capacity": 30
            },
            {
                "room_id": "TH4",
                "type": "practice",
                "capacity": 25
            }
        ],
        "lecturers": [
            {
                "lecturer_id": "GV001",
                "lecturer_name": "Nguyễn Văn A",
                "subjects": ["MH001", "MH002", "MH003"],
                "busy_slots": [],
                "semester_busy_slots": []
            },
            {
                "lecturer_id": "GV002",
                "lecturer_name": "Trần Thị B",
                "subjects": ["MH004", "MH005", "MH006"],
                "busy_slots": [],
                "semester_busy_slots": []
            },
            {
                "lecturer_id": "GV003",
                "lecturer_name": "Lê Minh C",
                "subjects": ["MH007", "MH008", "MH009"],
                "busy_slots": [],
                "semester_busy_slots": []
            },
            {
                "lecturer_id": "GV005",
                "lecturer_name": "Hoàng Văn E",
                "subjects": ["MH010", "MH012", "MH013"],
                "busy_slots": [],
                "semester_busy_slots": []
            },
            {
                "lecturer_id": "GV006",
                "lecturer_name": "Đỗ Thị F",
                "subjects": ["MH014", "MH015", "MH016"],
                "busy_slots": [],
                "semester_busy_slots": []
            },
            {
                "lecturer_id": "GV007",
                "lecturer_name": "Vũ Văn G",
                "subjects": ["MH003", "MH005", "MH010"],
                "busy_slots": [],
                "semester_busy_slots": []
            },
            {
                "lecturer_id": "GV008",
                "lecturer_name": "Vũ Văn G1",
                "subjects": ["MH015", "MH013", "MH002"],
                "busy_slots": [],
                "semester_busy_slots": []
            }
        ],
        "programs": [
            {
                "program_id": "CT001",
                "program_name": "Chương trình Đào tạo CNTT123",
                "duration": 15,
                "semesters": [
                    {
                        "semester_id": "HK1_CT01_2025",
                        "subject_ids": ["MH001", "MH002"]
                    },
                    {
                        "semester_id": "HK2_CT01_2025",
                        "subject_ids": ["MH003", "MH004"]
                    },
                    {
                        "semester_id": "HK3_CT01_2025",
                        "subject_ids": ["MH005", "MH006"]
                    },
                    {
                        "semester_id": "HK4_CT01_2025",
                        "subject_ids": ["MH007", "MH008"]
                    }
                ]
            },
            {
                "program_id": "CT002",
                "program_name": "nhập tay",
                "duration": 15,
                "semesters": [
                    {
                        "semester_id": "HK1_CT02_2025",
                        "subject_ids": ["MH009", "MH010"]
                    },
                    {
                        "semester_id": "HK2_CT02_2025",
                        "subject_ids": ["MH011", "MH012"]
                    },
                    {
                        "semester_id": "HK3_CT02_2025",
                        "subject_ids": ["MH013", "MH014"]
                    },
                    {
                        "semester_id": "HK4_CT02_2025",
                        "subject_ids": ["MH015", "MH016"]
                    }
                ]
            }
        ],
        "semesters": [
            {
                "semester_id": "HK1_CT01_2025",
                "subject_ids": ["MH001", "MH002"],
                "start_date": "2025-08-15",
                "end_date": "2025-11-28",
                "duration_weeks": 15
            },
            {
                "semester_id": "HK2_CT01_2025",
                "subject_ids": ["MH003", "MH004"],
                "start_date": "2025-12-05",
                "end_date": "2026-03-20",
                "duration_weeks": 15
            },
            {
                "semester_id": "HK3_CT01_2025",
                "subject_ids": ["MH005", "MH006"],
                "start_date": "2026-03-27",
                "end_date": "2026-07-10",
                "duration_weeks": 15
            },
            {
                "semester_id": "HK4_CT01_2025",
                "subject_ids": ["MH007", "MH008"],
                "start_date": "2026-07-17",
                "end_date": "2026-10-30",
                "duration_weeks": 15
            },
            {
                "semester_id": "HK1_CT02_2025",
                "subject_ids": ["MH009", "MH010"],
                "start_date": "2025-08-15",
                "end_date": "2025-11-28",
                "duration_weeks": 15
            },
            {
                "semester_id": "HK2_CT02_2025",
                "subject_ids": ["MH011", "MH012"],
                "start_date": "2025-12-05",
                "end_date": "2026-03-20",
                "duration_weeks": 15
            },
            {
                "semester_id": "HK3_CT02_2025",
                "subject_ids": ["MH013", "MH014"],
                "start_date": "2026-03-27",
                "end_date": "2026-07-10",
                "duration_weeks": 15
            },
            {
                "semester_id": "HK4_CT02_2025",
                "subject_ids": ["MH015", "MH016"],
                "start_date": "2026-07-17",
                "end_date": "2026-10-30",
                "duration_weeks": 15
            }
        ],
        "subjects": [
            {
                "subject_id": "MH001",
                "name": "Computer Fundamentals",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH002",
                "name": "Foundations of Programming with C",
                "theory_hours": 45,
                "practice_hours": 15
            },
            {
                "subject_id": "MH003",
                "name": "Data Processing with XML and JSON",
                "theory_hours": 30,
                "practice_hours": 15
            },
            {
                "subject_id": "MH004",
                "name": "OOAD with UML",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH005",
                "name": "ASP.NET Core MVC-The Framework for Future Web Innovations",
                "theory_hours": 45,
                "practice_hours": 15
            },
            {
                "subject_id": "MH006",
                "name": "Powerful and Rich Applications with Microsoft Azure",
                "theory_hours": 45,
                "practice_hours": 15
            },
            {
                "subject_id": "MH007",
                "name": "Deployment System and Containerize with Docker and Kubernetes",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH008",
                "name": "Project-Robust Java Applications for Enterprises",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH009",
                "name": "Xử lý ảnh với Adobe Photoshop",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH010",
                "name": "Nhiếp ảnh kỹ thuật số và xử lý hậu kỳ với Lightroom",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH011",
                "name": "Tạo hoạt hình 2D cho Web",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH012",
                "name": "Tạo giao diện tương tác cao cho người dùng",
                "theory_hours": 30,
                "practice_hours": 5
            },
            {
                "subject_id": "MH013",
                "name": "Tạo chất liệu (texture) cho mô hình 3D trong game 3D",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH014",
                "name": "Thiết kế màn chơi với Unity 3D",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH015",
                "name": "Tạo chuyển động cho nhân vật",
                "theory_hours": 30,
                "practice_hours": 10
            },
            {
                "subject_id": "MH016",
                "name": "Sử dụng Black Magic Fusion biên tập hình ảnh nâng cao",
                "theory_hours": 30,
                "practice_hours": 10
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
        "days_of_week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
    console.log("scheduleItems", scheduleItems);

    //lấy lịch
    const fetchClassSchedule = async () => {
        setError(null);
        try {
            const response = await getAllSchedulesAPI();
            if (response && response.data) {
                setScheduleItems(response.data);
            } else {
                setLecturers([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải thời khóa biểu:", error);
            setError("Không thể tải thời khóa biểu. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        // fetch lịch 
        fetchClassSchedule();
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
    const transformDataToFormTest = (data) => {
        const { rooms, programs, lecturers, classes } = data;
        // Sử dụng optional chaining và nullish coalescing để code gọn hơn
        if (!classes?.length || !rooms?.length || !lecturers?.length || !programs?.length) {
            console.warn("Dữ liệu đầu vào không đầy đủ. Trả về cấu trúc rỗng.");
            return {
                classes: [],
                rooms: [],
                lecturers: [],
                programs: [],
                time_slots: [],
                days_of_week: []
            };
        }

        const transformedClasses = classes.map(cls => ({
            class_id: cls.class_id,
            size: cls.class_size,
            program_id: cls.program_id ?? "CT001" // Sử dụng nullish coalescing (??)
        }));

        const transformedRooms = rooms.map(room => ({
            room_id: room.room_id,
            type: room.type,
            capacity: room.capacity
        }));

        const transformedLecturers = lecturers.map(lecturer => ({
            lecturer_id: lecturer.lecturer_id,
            lecturer_name: lecturer.name,
            subjects: lecturer.subjects?.map(subject => subject.subject_id) ?? [],
            busy_slots: lecturer.busy_slots ?? []
        }));

        const transformedPrograms = programs.map(program => ({
            program_id: program.program_id,
            duration: parseInt(program.duration) || 0,
            semesters: program.semesters?.map(semester => ({
                semester_id: semester.semester_id,
                subjects: semester.subjects?.map(subject => ({
                    subject_id: subject.subject_id,
                    name: subject.name,
                    theory_hours: subject.theory_hours,
                    practice_hours: subject.practice_hours
                })) ?? []
            })) ?? []
        }));

        return {
            classes: transformedClasses,
            rooms: transformedRooms,
            lecturers: transformedLecturers,
            programs: transformedPrograms,
            time_slots: timeslot[0]?.time_slots ?? [],
            days_of_week: days_of_week[0]?.days_of_week ?? []
        };
    };

    // Update formTest when API data is loaded
    useEffect(() => {
        const dataToTransform = { rooms, programs, lecturers, classes };
        const transformed = transformDataToFormTest(dataToTransform);

        if (transformed) {
            setFormTest(transformed);
        }
    }, [rooms, programs, lecturers, classes]);

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
            const inputData = actualInputData;
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
                    scheduleItems={scheduleItems}
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
            />
        </Box>
    );
};

export default Dashboard;